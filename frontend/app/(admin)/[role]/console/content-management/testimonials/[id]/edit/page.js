'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestimonialById } from '@/store/slices/testimonialSlice';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { useParams } from 'next/navigation';

export default function EditTestimonialPage() {
    const params = useParams();
    const dispatch = useDispatch();
    const { currentTestimonial, loading } = useSelector((state) => state.testimonials);

    useEffect(() => {
        dispatch(fetchTestimonialById(params.id));
    }, [dispatch, params.id]);

    if (loading || !currentTestimonial) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Testimonial</h1>
            <TestimonialForm testimonial={currentTestimonial} />
        </div>
    );
}
