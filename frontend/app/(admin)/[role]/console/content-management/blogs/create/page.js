'use client';

import BlogForm from '@/components/admin/BlogForm';

export default function CreateBlogPage() {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Blog</h1>
            <BlogForm />
        </div>
    );
}
