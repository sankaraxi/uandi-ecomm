'use client';

import TestimonialForm from '@/components/admin/TestimonialForm';

export default function CreateTestimonialPage() {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Testimonial</h1>
            <TestimonialForm />
        </div>
    );
}
