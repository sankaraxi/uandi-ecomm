'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog } from '@/store/slices/blogSlice';
import Link from 'next/link';

export default function AdminBlogsPage() {
    const dispatch = useDispatch();
    const { blogs, loading } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            await dispatch(deleteBlog(id));
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Blogs</h1>
                <Link
                    href="/admin/console/content-management/blogs/create"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Create New Blog
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {blogs.map((blog) => (
                            <tr key={blog.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.author_name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        blog.status === 'published' ? 'bg-green-100 text-green-800' :
                                        blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {blog.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(blog.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                    <Link href={`/admin/console/content-management/blogs/${blog.id}/edit`} className="text-purple-600 hover:text-purple-900">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
