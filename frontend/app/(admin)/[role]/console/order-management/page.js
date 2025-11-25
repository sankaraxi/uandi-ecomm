"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlassIcon, EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function AllOrdersPage() {
	const { role } = useParams();
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");
	const [payment, setPayment] = useState("all");
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/all`, {
					withCredentials: true
				});
				if (response.data.success) {
					const mappedOrders = response.data.orders.map(order => ({
						id: order.order_number,
						customer: order.shipping_name || `${order.first_name} ${order.last_name}`,
						email: order.email,
						items: order.items_count,
						total: parseFloat(order.total_amount),
						status: order.order_status,
						payment: order.payment_method,
						date: order.created_at,
						fulfillment: order.order_status // Using order status as fulfillment status for now
					}));
					setOrders(mappedOrders);
				}
			} catch (error) {
				console.error("Failed to fetch orders:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return orders.filter((o) => {
			const matchesSearch =
				!q ||
				o.id.toLowerCase().includes(q) ||
				(o.customer && o.customer.toLowerCase().includes(q)) ||
				(o.email && o.email.toLowerCase().includes(q));
			const matchesStatus = status === "all" || o.status.toLowerCase() === status;
			const matchesPayment = payment === "all" || o.payment.toLowerCase() === payment;
			return matchesSearch && matchesStatus && matchesPayment;
		});
	}, [orders, search, status, payment]);

	const statusBadge = (s) => {
		const map = {
			delivered: "bg-green-100 text-green-700",
			processing: "bg-blue-100 text-blue-700",
			cancelled: "bg-red-100 text-red-700",
			refunded: "bg-amber-100 text-amber-700",
			pending: "bg-yellow-100 text-yellow-700",
		};
		return map[s?.toLowerCase()] || "bg-gray-100 text-gray-700";
	};

	if (loading) {
		return <div className="p-6 text-center">Loading orders...</div>;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
					<p className="text-gray-500 mt-1">Review, search, and filter recent orders</p>
				</div>
			</div>

			{/* Filters */}
			<div className="card">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="relative">
						{/* <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by order id, customer, or email..."
							className="input-field pl-10"
						/>
					</div>
					<select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
						<option value="all">All Status</option>
						<option value="delivered">Delivered</option>
						<option value="processing">Processing</option>
						<option value="cancelled">Cancelled</option>
						<option value="refunded">Refunded</option>
						<option value="pending">Pending</option>
					</select>
					<select value={payment} onChange={(e) => setPayment(e.target.value)} className="input-field">
						<option value="all">All Payments</option>
						<option value="prepaid">Prepaid</option>
						<option value="cod">COD</option>
						<option value="upi">UPI</option>
					</select>
				</div>
			</div>

			{/* Orders table */}
			<div className="card">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Order</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
								<th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
								<th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((o) => (
								<tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
									<td className="py-3 px-4">
										<p className="font-medium text-gray-800">{o.id}</p>
										<p className="text-xs text-gray-500">{o.fulfillment}</p>
									</td>
									<td className="py-3 px-4">
										<div>
											<p className="text-sm text-gray-800">{o.customer}</p>
											<p className="text-xs text-gray-500">{o.email}</p>
										</div>
									</td>
									<td className="py-3 px-4 text-sm text-gray-700">{o.items}</td>
									<td className="py-3 px-4 text-sm text-gray-700">{o.payment}</td>
									<td className="py-3 px-4 text-sm text-gray-700">{new Date(o.date).toLocaleDateString('en-IN')}</td>
									<td className="py-3 px-4">
										<span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusBadge(o.status)}`}>
											{o.status}
										</span>
									</td>
									<td className="py-3 px-4 text-right text-sm font-semibold text-gray-900">₹{o.total.toLocaleString()}</td>
									<td className="py-3 px-4">
										<div className="flex justify-end">
											<Link href={`/${role}/console/order-management/${encodeURIComponent(o.id)}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
												<EyeIcon className="w-5 h-5" />
											</Link>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{filtered.length === 0 && (
						<div className="text-center py-12">
							<p className="text-gray-500">No orders found</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
