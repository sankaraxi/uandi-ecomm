// frontend/components/ProductPreviewModal.js
'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ProductPreviewModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Product Preview</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{product.product_name}</h3>
            <p className="text-gray-500 mt-2">{product.description}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-pink-100 text-pink-700">
                {product.category.category_name}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {product.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Main Image */}
          {product.main_image && (
            <div>
              <img
                src={product.main_image}
                alt={product.product_name}
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Variants */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Product Variants</h4>
            <div className="space-y-3">
              {product.variants.map(variant => (
                <div key={variant.variant_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Variant</p>
                      <p className="font-medium text-gray-800">{variant.variant_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">SKU</p>
                      <p className="font-medium text-gray-800">{variant.sku || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <div>
                        {variant.mrp_price && (
                          <span className="line-through text-gray-400 text-sm mr-2">
                            ₹{parseFloat(variant.mrp_price).toFixed(2)}
                          </span>
                        )}
                        <span className="font-medium text-pink-600">
                          ₹{parseFloat(variant.final_price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="font-medium text-gray-800">{variant.stock} units</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
