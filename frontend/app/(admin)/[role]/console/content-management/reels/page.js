'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReels, deleteReel } from '@/store/slices/reelSlice';
import Link from 'next/link';

export default function AdminReelsPage() {
    const dispatch = useDispatch();
    const { reels, loading } = useSelector((state) => state.reels);

    useEffect(() => {
        dispatch(fetchReels());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this reel?')) {
            await dispatch(deleteReel(id));
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Product Reels</h1>
                <Link
                    href="/admin/console/content-management/reels/create"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Create New Reel
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reels.map((reel) => (
                            <tr key={reel.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {reel.thumbnail_url && (
                                            <img
                                                src={reel.thumbnail_url}
                                                alt={reel.title}
                                                className="w-16 h-16 object-cover rounded mr-3"
                                            />
                                        )}
                                        <div className="text-sm font-medium text-gray-900">{reel.title}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reel.product_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reel.variant_id || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        reel.status === 'active' ? 'bg-green-100 text-green-800' :
                                        reel.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {reel.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reel.views_count}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                    <Link href={`/admin/reels/${reel.id}/edit`} className="text-purple-600 hover:text-purple-900">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(reel.id)}
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
