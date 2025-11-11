"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { MapPin, Phone, User, ArrowRight } from "lucide-react";
import CartSummary from "@/components/Checkout/CartSummary";
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from "@/store/slices/addressSlice";

export default function Page() {
    const dispatch = useDispatch();
    let { user } = useSelector((state) => state.auth);
    const { addresses, loading, error } = useSelector((state) => state.addresses);
    const { items } = useSelector((state) => state.cart);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 99;
    const tax = 520;
    const total = subtotal + shipping + tax;

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                user = JSON.parse(storedUser);
            }
        }

        if (user) {
            dispatch(fetchAddresses(user.user_id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (addresses.length === 0) {
            setShowAddAddressForm(true);
        } else {
            setShowAddAddressForm(false);
        }
    }, [addresses]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!user) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                user = JSON.parse(storedUser);
            }
        }

        try {
            if (formData.id) {
                await dispatch(updateAddress({ id: formData.id, addressData: { ...formData, user_id: user.user_id } })).unwrap();
            } else {
                await dispatch(addAddress({ ...formData, user_id: user.user_id })).unwrap();
            }
            setShowAddAddressForm(false);
        } catch (err) {
            alert("Error saving address");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await dispatch(deleteAddress(id)).unwrap();
            } catch (err) {
                alert("Error deleting address");
            }
        }
    };

    return (
        <main className="min-h-screen bg-[#f8f8f7] text-gray-800">
            <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-white rounded-2xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100"
                >
                    <h1 className="text-3xl font-semibold tracking-tight mb-2">
                        Delivery Details
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Select an address or add a new one.
                    </p>

                    {loading && <p>Loading addresses...</p>}
                    {error && <p className="text-red-500">Error loading addresses.</p>}

                    {!loading && !error && (
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className={`border rounded-xl p-4 cursor-pointer ${selectedAddress?.id === address.id ? 'border-gray-800 ring-1 ring-gray-800' : 'border-gray-200'}`}
                                    onClick={() => setSelectedAddress(address)}
                                >
                                    <div className="flex justify-between">
                                        <p className="font-semibold">{address.full_name}</p>
                                        <div>
                                            <button className="text-xs text-blue-500" onClick={() => {
                                                setFormData(address);
                                                setShowAddAddressForm(true);
                                            }}>Edit</button>
                                            <button className="text-xs text-red-500 ml-2" onClick={() => handleDelete(address.id)}>Delete</button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{address.address_line_1}, {address.address_line_2}</p>
                                    <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.postal_code}</p>
                                    <p className="text-sm text-gray-600">{address.country}</p>
                                    <p className="text-sm text-gray-600">Phone: {address.phone_number}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        className="text-sm text-blue-500 mt-4"
                        onClick={() => {
                            setFormData({
                                id: null,
                                full_name: "",
                                phone_number: "",
                                address_line_1: "",
                                address_line_2: "",
                                city: "",
                                state: "",
                                postal_code: "",
                                country: "",
                            });
                            setShowAddAddressForm(!showAddAddressForm);
                        }}
                    >
                        {showAddAddressForm ? 'Cancel' : '+ Add New Address'}
                    </button>

                    {showAddAddressForm && (
                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm text-gray-600">Full Name</label>
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 mt-1 bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-400 transition">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="full_name"
                                            placeholder="Rahul Mehta"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className="flex-1 bg-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">Phone</label>
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 mt-1 bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-400 transition">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone_number"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            className="flex-1 bg-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Address</label>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 mt-1 bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-400 transition">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="address_line_1"
                                        placeholder="123 MG Road"
                                        value={formData.address_line_1}
                                        onChange={handleChange}
                                        className="flex-1 bg-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="address_line_2"
                                    placeholder="Apartment, suite, landmark (optional)"
                                    value={formData.address_line_2}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-3 mt-1 bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-400 transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm text-gray-600">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="Bangalore"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-3 mt-1 bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-400 transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="Karnataka"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-3 mt-1 bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-400 transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm text-gray-600">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postal_code"
                                        placeholder="560001"
                                        value={formData.postal_code}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-3 mt-1 bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-400 transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="India"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-3 mt-1 bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-400 transition"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ scale: 1.01 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Save Address <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    )}

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.01 }}
                        disabled={!selectedAddress}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-8 disabled:bg-gray-400"
                        onClick={() => console.log("Proceed to payment with address:", selectedAddress)}
                    >
                        Continue to Payment <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100 h-fit"
                >
                    <CartSummary
                        items={items}
                        subtotal={subtotal}
                        shipping={shipping}
                        tax={tax}
                        total={total}
                    />
                </motion.div>
            </div>
        </main>
    );
}
