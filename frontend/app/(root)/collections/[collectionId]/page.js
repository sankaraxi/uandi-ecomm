"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionProducts } from "@/store/collectionsSlice";
import { addToCart, openCart } from "@/store/slices/cartSlice";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default function Page() {
  const { collectionId } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { selectedCollection, loading, error } = useSelector((state) => state.collections);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [wishlist, setWishlist] = useState([]);

  const collectionData = selectedCollection?.collection;
  const rawProducts = selectedCollection?.products || [];

  useEffect(() => {
    if (collectionId) {
      dispatch(getCollectionProducts(collectionId));
    }
  }, [dispatch, collectionId]);

  // Backend now provides variants with images & category; ensure fallback if missing
  const products = useMemo(() => {
    return rawProducts.map((p) => {
      const seen = new Set();
      const variants = (p.variants || [])
        .filter(v => v && v.variant_id && !seen.has(v.variant_id) && parseFloat(v.final_price || v.price || 0) > 0 && (seen.add(v.variant_id) || true))
        .map((v, idx) => {
          let images = v.images || [];
          if (idx === 0 && p.main_image && !images.some(img => img.image_url === p.main_image)) {
            images = [{ image_url: p.main_image }, ...images];
          }
          return { ...v, images };
        });
      return { ...p, variants };
    });
  }, [rawProducts]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {error && <p className="text-center text-red-500 text-lg py-4">{error}</p>}
      <div className="mb-6">
        {loading ? (
          <h1 className="text-2xl font-semibold text-neutral-900">Loading…</h1>
        ) : (
          <h1 className="text-3xl font-semibold text-neutral-900">{collectionData?.collection_name}</h1>
        )}
        {!loading && <p className="text-sm text-neutral-500 mt-1">{products.length} product(s)</p>}
      </div>
      {loading && <p className="text-center text-gray-500 text-lg py-6">Fetching products...</p>}
      {!loading && products.length === 0 && <p className="text-center text-gray-500 py-10">No products in this collection.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            isAuthenticated={isAuthenticated}
            inWishlist={wishlist.includes(product.product_id)}
            onToggleWishlist={toggleWishlist}
            onNavigate={(id) => router.push(`/products/${id}`)}
            onAddToCart={({ product: p, variant }) => {
              if (!variant) return;
              const price = parseFloat(variant.final_price || variant.price || 0);
              if (!price) return;
              dispatch(
                addToCart({
                  product_id: p.product_id,
                  product_name: p.product_name,
                  variant_id: variant.variant_id,
                  variant_name: variant.variant_name,
                  price,
                  quantity: 1,
                  main_image: p.main_image,
                  source_collection_id: collectionId,
                })
              );
              dispatch(openCart());
            }}
          />
        ))}
      </div>
    </div>
  );
}