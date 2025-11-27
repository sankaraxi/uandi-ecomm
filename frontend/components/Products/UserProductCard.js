import { Star } from "lucide-react";

export default function UserProductCard({ product }) {
  return (
    <div className="w-[260px] bg-white rounded-2xl shadow-md border border-zinc-100 overflow-hidden flex flex-col">
      {/* Product Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-[1.05rem] font-semibold text-zinc-800">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-500 mt-1 leading-snug">
          {product.description}
        </p>

        {/* Divider */}
        <div className="border-b my-3 border-zinc-200" />

        {/* Price + Rating */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-[1.05rem] font-semibold text-zinc-800">
            ₹ {product.price}
          </p>

          <div className="flex items-center gap-1 text-zinc-600">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-xs text-zinc-400">
              | {product.ratingCount} Ratings
            </span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button className="m-4 mt-0 py-2 rounded-xl text-white text-sm font-medium 
        bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition">
        Add To Cart
      </button>
    </div>
  );
}
