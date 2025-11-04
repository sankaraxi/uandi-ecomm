'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestimonials } from '@/store/slices/testimonialSlice';
import TestimonialCard from './TestimonialCard';

export default function TestimonialSlider() {
    const dispatch = useDispatch();
    const { testimonials, loading } = useSelector((state) => state.testimonials);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        dispatch(fetchTestimonials({ status: 'approved', limit: 10 }));
    }, [dispatch]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (loading || testimonials.length === 0) return null;

    return (
        <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                            <TestimonialCard testimonial={testimonial} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
            >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
            >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex ? 'bg-purple-600 w-8' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
