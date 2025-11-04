'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { incrementViews } from '@/store/slices/reelSlice';

export default function ReelPlayer({ reel }) {
    const videoRef = useRef(null);
    const dispatch = useDispatch();
    const viewCounted = useRef(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => {
            if (!viewCounted.current) {
                dispatch(incrementViews(reel.id));
                viewCounted.current = true;
            }
        };

        video.addEventListener('play', handlePlay);
        return () => video.removeEventListener('play', handlePlay);
    }, [reel.id, dispatch]);

    return (
        <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] max-w-md mx-auto shadow-2xl">
            <video
                ref={videoRef}
                controls
                poster={reel.thumbnail_url}
                className="w-full h-full object-cover"
            >
                <source src={reel.video_url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white font-semibold text-lg mb-1">{reel.title}</h3>
                {reel.description && (
                    <p className="text-white/80 text-sm">{reel.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-white/70 text-xs">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {reel.views_count} views
                    </span>
                    {reel.duration && (
                        <span>{Math.floor(reel.duration / 60)}:{(reel.duration % 60).toString().padStart(2, '0')}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
