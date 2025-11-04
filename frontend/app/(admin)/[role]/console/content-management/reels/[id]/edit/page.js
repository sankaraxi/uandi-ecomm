'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReelById } from '@/store/slices/reelSlice';
import ReelForm from '@/components/admin/ReelForm';
import { useParams } from 'next/navigation';

export default function EditReelPage() {
    const params = useParams();
    const dispatch = useDispatch();
    const { currentReel, loading } = useSelector((state) => state.reels);

    useEffect(() => {
        dispatch(fetchReelById(params.id));
    }, [dispatch, params.id]);

    if (loading || !currentReel) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Product Reel</h1>
            <ReelForm reel={currentReel} />
        </div>
    );
}
