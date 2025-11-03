// frontend/components/StockUpdateModal.js
'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function StockUpdateModal({ product, onClose, onUpdate }) {
  const [stocks, setStocks] = useState(
    product.variants.reduce((acc, variant) => {
      acc[variant.variant_id] = variant.stock;
      return acc;
    }, {})
  );

  const handleUpdate = (variantId) => {
    onUpdate(variantId, stocks[variantId]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Update Stock</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">{product.product_name}</h3>
            <p className="text-sm text-gray-500">Update stock quantity for each variant</p>
          </div>

          {product.variants.map(variant => (
            <div key={variant.variant_id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{variant.variant_name}</p>
                <p className="text-sm text-gray-500">SKU: {variant.sku || '-'}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stocks[variant.variant_id]}
                  onChange={(e) => setStocks({
                    ...stocks,
                    [variant.variant_id]: parseInt(e.target.value) || 0
                  })}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={() => handleUpdate(variant.variant_id)}
                  className="btn-primary text-sm"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
