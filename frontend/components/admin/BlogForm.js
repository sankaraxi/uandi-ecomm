'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBlog, updateBlog } from '@/store/slices/blogSlice';
import { useRouter } from 'next/navigation';

export default function BlogForm({ blog = null }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        author_name: '',
        status: 'draft',
        published_at: '',
        meta_title: '',
        meta_description: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (blog) {
            // Format datetime for input field
            const formattedBlog = {
                ...blog,
                published_at: blog.published_at 
                    ? new Date(blog.published_at).toISOString().slice(0, 16) 
                    : ''
            };
            setFormData(formattedBlog);
        }
    }, [blog]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data - convert datetime to MySQL format or null
            const submitData = {
                ...formData,
                published_at: formData.published_at 
                    ? new Date(formData.published_at).toISOString().slice(0, 19).replace('T', ' ')
                    : null
            };

            if (blog) {
                await dispatch(updateBlog({ id: blog.id, blogData: submitData })).unwrap();
            } else {
                await dispatch(createBlog(submitData)).unwrap();
            }
            router.push('/admin/blogs');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="Leave empty to auto-generate from title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                <input
                    type="url"
                    name="featured_image"
                    value={formData.featured_image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                <input
                    type="text"
                    name="author_name"
                    value={formData.author_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Published Date</label>
                    <input
                        type="datetime-local"
                        name="published_at"
                        value={formData.published_at}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for current date/time</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title (SEO)</label>
                <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description (SEO)</label>
                <textarea
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
    