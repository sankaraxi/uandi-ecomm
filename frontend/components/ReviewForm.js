"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "@/store/slices/reviewsSlice";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";

export default function ReviewForm({ productId, token, userId, onClose }) {
  const dispatch = useDispatch();

  console.log("ReviewForm props - productId:", productId, "userId:", userId);

  const [ratings, setRatings] = useState(5);
  const [review_description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [hoveredRating, setHoveredRating] = useState(0);

  const submitReview = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("product_id", productId);
    fd.append("user_id", userId);
    fd.append("ratings", ratings);  
    fd.append("review_description", review_description);

    console.log("FormData contents:");
for (let p of fd.entries()) console.log(p);

    Array.from(images).forEach((file) => fd.append("images", file));

    await dispatch(createReview({ formData: fd, token }));

    // reset
    setRatings(5);
    setDescription("");
    setImages([]);
    if (onClose) onClose();
  };

  return (
    <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={submitReview} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">Your Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatings(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform transform hover:scale-110 focus:outline-none"
              >
                {star <= (hoveredRating || ratings) ? (
                  <StarIcon className="w-10 h-10 text-yellow-400" />
                ) : (
                  <StarIconOutline className="w-10 h-10 text-gray-300" />
                )}
              </button>
            ))}
            <span className="ml-3 text-lg font-semibold text-gray-700">{ratings} / 5</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">Your Review</label>
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D8234B] focus:border-transparent transition-all min-h-[120px] resize-none"
            placeholder="Share your experience with this product..."
            value={review_description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">Add Photos/Videos (Optional)</label>
          <div className="relative">
            <input type="file" multiple accept="image/*,video/*" onChange={(e) => setImages(e.target.files)} className="hidden" id="review-media-upload" />
            <label htmlFor="review-media-upload" className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-xl px-6 py-8 cursor-pointer hover:border-[#D8234B] hover:bg-red-50 transition-all group">
              <svg className="w-8 h-8 text-gray-400 group-hover:text-[#D8234B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600 group-hover:text-[#D8234B] font-medium">{images && images.length > 0 ? `${images.length} file(s) selected` : 'Click to upload photos or videos'}</span>
            </label>
          </div>
        </div>

        <button type="submit" className="w-full bg-[#D8234B] hover:bg-[#b21c3f] text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2">
          Submit Review
        </button>
      </form>
    </div>
  );
}
