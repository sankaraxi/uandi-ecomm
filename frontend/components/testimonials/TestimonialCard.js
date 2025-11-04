import Image from 'next/image';

export default function TestimonialCard({ testimonial }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
                {testimonial.customer_image ? (
                    <Image
                        src={testimonial.customer_image}
                        alt={testimonial.customer_name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                        {testimonial.customer_name.charAt(0)}
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.customer_name}</h4>
                    {testimonial.location && (
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-3">{testimonial.testimonial_text}</p>
            {testimonial.verified_purchase && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Purchase
                </span>
            )}
        </div>
    );
}
