'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestimonials, deleteTestimonial } from '@/store/slices/testimonialSlice';
import Link from 'next/link';

export default function AdminTestimonialsPage() {
    const dispatch = useDispatch();
    const { testimonials, loading } = useSelector((state) => state.testimonials);

    useEffect(() => {
        dispatch(fetchTestimonials());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            await dispatch(deleteTestimonial(id));
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Testimonials</h1>
                <Link
                    href="/admin/console/content-management/testimonials/create"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Create New Testimonial
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {testimonial.customer_image && (
                                    <img
                                        src={testimonial.customer_image}
                                        alt={testimonial.customer_name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-800">{testimonial.customer_name}</h3>
                                    <div className="flex text-yellow-400">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                testimonial.status === 'approved' ? 'bg-green-100 text-green-800' :
                                testimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {testimonial.status}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{testimonial.testimonial_text}</p>
                        {testimonial.location && (
                            <p className="text-xs text-gray-500 mb-4">📍 {testimonial.location}</p>
                        )}
                        <div className="flex gap-2">
                            <Link
                                href={`/admin/console/content-management/testimonials/${testimonial.id}/edit`}
                                className="flex-1 text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(testimonial.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
