'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogBySlug } from '@/store/slices/blogSlice';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function BlogDetailPage() {
    const params = useParams();
    const dispatch = useDispatch();
    const { currentBlog, loading } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogBySlug(params.slug));
    }, [dispatch, params.slug]);

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (!currentBlog) {
        return <div className="text-center py-20">Blog not found</div>;
    }

    return (
        <article className="min-h-screen bg-white">
            {/* Hero Section */}
            {currentBlog.featured_image && (
                <div className="relative h-96 w-full">
                    <Image
                        src={currentBlog.featured_image}
                        alt={currentBlog.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        {currentBlog.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                        {currentBlog.author_name && (
                            <span className="font-medium">{currentBlog.author_name}</span>
                        )}
                        <span>•</span>
                        <time dateTime={currentBlog.published_at}>
                            {new Date(currentBlog.published_at || currentBlog.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>
                </div>

                {currentBlog.excerpt && (
                    <div className="text-xl text-gray-600 mb-8 pb-8 border-b border-gray-200">
                        {currentBlog.excerpt}
                    </div>
                )}

                <div 
                    className="prose prose-lg prose-purple max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentBlog.content }}
                />
            </div>
        </article>
    );
}
