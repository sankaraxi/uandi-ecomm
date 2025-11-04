'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogById } from '@/store/slices/blogSlice';
import BlogForm from '@/components/admin/BlogForm';
import { useParams } from 'next/navigation';

export default function EditBlogPage() {
    const params = useParams();
    const dispatch = useDispatch();
    const { currentBlog, loading } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogById(params.id));
    }, [dispatch, params.id]);

    if (loading || !currentBlog) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Blog</h1>
            <BlogForm blog={currentBlog} />
        </div>
    );
}
