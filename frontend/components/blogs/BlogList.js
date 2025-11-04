'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '@/store/slices/blogSlice';
import BlogCard from './BlogCard';

export default function BlogList() {
    const dispatch = useDispatch();
    const { blogs, loading } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogs({ status: 'published', limit: 12 }));
    }, [dispatch]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
            ))}
        </div>
    );
}
