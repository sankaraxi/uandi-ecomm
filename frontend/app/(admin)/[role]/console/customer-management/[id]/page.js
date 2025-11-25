"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, ShoppingBagIcon, CurrencyRupeeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CustomerDetailsPage() {
  const params = useParams();
  const role = params.role;
  const id = params.id;

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_URL}/customers/${id}`, {
            withCredentials: true
        });
        if (response.data.success) {
            setCustomer(response.data.customer);
        } else {
            setError("Customer not found");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-4 p-6">
        <Link href={`/${role}/console/customer-management`} className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Customers
        </Link>
        <p className="text-red-600">{error || "Customer not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/${role}/console/customer-management`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.first_name} {customer.last_name}</h1>
            <p className="text-gray-500 mt-1">Customer details</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <ShoppingBagIcon className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-xl font-bold text-gray-900">{customer.orders_count || 0}</p>
              </div>
          </div>
          <div className="card p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <CurrencyRupeeIcon className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">₹{(customer.total_revenue || 0).toLocaleString()}</p>
              </div>
          </div>
          <div className="card p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                  <MapPinIcon className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-sm text-gray-500">Saved Addresses</p>
                  <p className="text-xl font-bold text-gray-900">{customer.addresses?.length || 0}</p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="card h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-800">{customer.first_name} {customer.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-800">{customer.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-800">{customer.phone_number || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${customer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {customer.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Joined</label>
              <p className="text-gray-800">{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '-'}</p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="card h-fit lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Addresses</h2>
            {customer.addresses && customer.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customer.addresses.map((addr) => (
                        <div key={addr.address_id} className="border border-gray-200 rounded-lg p-4 relative">
                            {addr.is_default === 1 && (
                                <span className="absolute top-2 right-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Default</span>
                            )}
                            <p className="font-medium text-gray-900">{addr.full_name}</p>
                            <p className="text-sm text-gray-600 mt-1">{addr.address_line_1}</p>
                            {addr.address_line_2 && <p className="text-sm text-gray-600">{addr.address_line_2}</p>}
                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.postal_code}</p>
                            <p className="text-sm text-gray-600">{addr.country}</p>
                            <p className="text-sm text-gray-600 mt-2">Phone: {addr.phone_number}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm">No addresses found.</p>
            )}
        </div>
      </div>

      {/* Orders History */}
      <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order History</h2>
          {customer.orders && customer.orders.length > 0 ? (
              <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead>
                          <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-500">
                              <th className="pb-3 pl-2">Order ID</th>
                              <th className="pb-3">Date</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3">Payment</th>
                              <th className="pb-3 text-right pr-2">Total</th>
                              <th className="pb-3 text-right pr-2">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {customer.orders.map((order) => (
                              <tr key={order.order_id} className="hover:bg-gray-50">
                                  <td className="py-3 pl-2 text-sm font-medium text-gray-900">{order.order_number}</td>
                                  <td className="py-3 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                                  <td className="py-3">
                                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full 
                                          ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                            order.order_status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                            'bg-blue-100 text-blue-700'}`}>
                                          {order.order_status}
                                      </span>
                                  </td>
                                  <td className="py-3 text-sm text-gray-600">{order.payment_method}</td>
                                  <td className="py-3 text-sm font-medium text-gray-900 text-right pr-2">₹{parseFloat(order.total_amount).toLocaleString()}</td>
                                  <td className="py-3 text-right pr-2">
                                      <Link href={`/${role}/console/order-management/${order.order_number}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                          View
                                      </Link>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          ) : (
              <p className="text-gray-500 text-sm">No orders found.</p>
          )}
      </div>
    </div>
  );
}
