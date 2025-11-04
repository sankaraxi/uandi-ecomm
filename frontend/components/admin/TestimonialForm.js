'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTestimonial, updateTestimonial } from '@/store/slices/testimonialSlice';
import { useRouter } from 'next/navigation';

export default function TestimonialForm({ testimonial = null }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_image: '',
        rating: 5,
        testimonial_text: '',
        location: '',
        verified_purchase: false,
        status: 'pending',
        display_order: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (testimonial) {
            setFormData(testimonial);
        }
    }, [testimonial]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (testimonial) {
                await dispatch(updateTestimonial({ id: testimonial.id, testimonialData: formData })).unwrap();
            } else {
                await dispatch(createTestimonial(formData)).unwrap();
            }
            router.push('/admin/testimonials');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Image URL</label>
                <input
                    type="url"
                    name="customer_image"
                    value={formData.customer_image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Text</label>
                <textarea
                    name="testimonial_text"
                    value={formData.testimonial_text}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    name="verified_purchase"
                    checked={formData.verified_purchase}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <label className="text-sm font-medium text-gray-700">Verified Purchase</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                    <input
                        type="number"
                        name="display_order"
                        value={formData.display_order}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Saving...' : testimonial ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
