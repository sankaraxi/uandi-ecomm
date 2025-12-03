'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { fetchProducts } from '@/store/productsSlice';

export default function SearchModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.products);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen && (!products || products.length === 0)) {
      dispatch(fetchProducts());
    }
  }, [isOpen, dispatch]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return (products || []).filter((p) => {
      const name = (p.product_name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return p.is_active && (name.includes(q) || desc.includes(q));
    });
  }, [products, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
            aria-label="Close search"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: 'transform' }}
            className="fixed right-0 top-0 z-50 w-full sm:w-[520px] h-full bg-white/80 backdrop-blur-xl shadow-2xl flex flex-col rounded-l-2xl border-l border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-800">Search Products</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Search input */}
            <div className="p-5 border-b border-gray-100">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  placeholder="Search by name or description"
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Results */}
            <div className="grow overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {loading && (
                <div className="text-center text-sm text-gray-500">Loading products...</div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="text-center text-gray-500">No matching products</div>
              )}

              {!loading && results.length > 0 && (
                <ul className="divide-y divide-gray-200">
                  {results.map((p) => (
                    <li key={p.product_id} className="py-3">
                      <Link
                        href={`/products/${p.product_id}`}
                        onClick={onClose}
                        className="flex items-center gap-3"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                          <img src={p.main_image} alt={p.product_name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.product_name}</p>
                          <p className="text-xs text-gray-500 truncate">{p.category?.category_name || 'Product'}</p>
                          {/* Price preview: lowest variant */}
                          {p.variants?.length > 0 && (
                            <p className="text-sm text-gray-800 mt-0.5">
                              ₹{Math.min(...p.variants.map(v => parseFloat(v.final_price || v.price || 0))).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
