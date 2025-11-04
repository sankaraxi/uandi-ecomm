'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReelsByProduct } from '@/store/slices/reelSlice';
import ReelPlayer from './ReelPlayer';

export default function ReelGrid({ productId }) {
    const dispatch = useDispatch();
    const { reels, loading } = useSelector((state) => state.reels);
    const [selectedReel, setSelectedReel] = useState(null);

    useEffect(() => {
        if (productId) {
            dispatch(fetchReelsByProduct(productId));
        }
    }, [dispatch, productId]);

    if (loading) {
        return <div className="text-center py-10">Loading reels...</div>;
    }

    if (reels.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Product Videos</h2>
            
            {/* Selected Reel Player */}
            {selectedReel && (
                <div className="mb-8">
                    <ReelPlayer reel={selectedReel} />
                </div>
            )}

            {/* Reel Thumbnails Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {reels.map((reel) => (
                    <button
                        key={reel.id}
                        onClick={() => setSelectedReel(reel)}
                        className={`relative aspect-[9/16] rounded-lg overflow-hidden group cursor-pointer ${
                            selectedReel?.id === reel.id ? 'ring-4 ring-purple-500' : ''
                        }`}
                    >
                        <img
                            src={reel.thumbnail_url || '/placeholder-video.jpg'}
                            alt={reel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white text-xs font-medium truncate">{reel.title}</p>
                            <p className="text-white/70 text-xs">{reel.views_count} views</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
