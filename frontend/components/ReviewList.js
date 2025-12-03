"use client";

import { StarIcon } from "@heroicons/react/24/solid";

export default function ReviewList({ reviews }) {
  if (!reviews?.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 font-medium text-lg">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((r) => (
        <div
          key={r.review_id}
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, idx) => (
                <StarIcon
                  key={idx}
                  className={`w-5 h-5 ${
                    idx < r.ratings ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {new Date(r.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            {r.review_description}
          </p>

          {r.images_json && r.images_json.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {r.images_json.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="shrink-0 relative cursor-pointer group"
                  onClick={() => window.open(imgUrl, '_blank')}
                >
                  <img
                    src={imgUrl}
                    alt={`Review Image ${idx + 1}`}
                    className="h-20 w-20 object-cover rounded-lg border border-gray-200 group-hover:border-[#D8234B] transition-colors"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
