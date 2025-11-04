// frontend/app/(admin)/product-management/product-details/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById, clearSelectedProduct } from '@/store/productsSlice';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  ArrowLeftIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import AddVariantModal from '@/components/AddVariantModal';
import EditVariantModal from '@/components/EditVariantModal';
import ImageGalleryModal from '@/components/ImageGalleryModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProductDetailsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const role = params.role;

  const { selectedProduct } = useSelector(state => state.products);
  const [loading, setLoading] = useState(true);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [showEditVariantModal, setShowEditVariantModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    loadProduct();
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, productId]);

  const loadProduct = () => {
    setLoading(true);
    dispatch(fetchProductById(productId)).then(() => {
      setLoading(false);
    });
  };

  const handleDeleteVariant = async (variantId, variantName) => {
    const result = await Swal.fire({
      title: 'Delete Variant?',
      text: `Are you sure you want to delete "${variantName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ec4899',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/products/variants/${variantId}`, {
          method: 'DELETE'
        });
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Variant deleted successfully',
          icon: 'success',
          confirmButtonColor: '#ec4899',
          timer: 2000
        });
        
        loadProduct();
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete variant',
          icon: 'error',
          confirmButtonColor: '#ec4899'
        });
      }
    }
  };

  const handleEditVariant = (variant) => {
    setSelectedVariant(variant);
    setShowEditVariantModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${role}/console/product-management/all-products`}>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{selectedProduct.product_name}</h1>
            <p className="text-gray-500 mt-1">Manage product details and variants</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/${role}/console/product-management/edit-product/${productId}`}>
            <button className="btn-secondary flex items-center gap-2">
              <PencilIcon className="w-4 h-4" />
              Edit Product
            </button>
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images Section */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h2>
          
          {selectedProduct.images && selectedProduct.images.length > 0 ? (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={selectedProduct.images.find(img => img.is_main)?.image_url || selectedProduct.images[0].image_url}
                  alt={selectedProduct.product_name}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="256" viewBox="0 0 400 256"%3E%3Crect width="400" height="256" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                <button
                  onClick={() => setShowImageGallery(true)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-lg transition-colors shadow-lg"
                >
                  <PhotoIcon className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              {selectedProduct.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.images.slice(0, 4).map((image, index) => (
                    <img
                      key={image.image_id}
                      src={image.image_url}
                      alt={`${selectedProduct.product_name} ${index + 1}`}
                      className="w-full h-16 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setShowImageGallery(true)}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setShowImageGallery(true)}
                className="w-full text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                View All Images ({selectedProduct.images.length})
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">No images available</p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Product Name</label>
              <p className="text-gray-800 font-medium">{selectedProduct.product_name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Category</label>
              <p className="text-gray-800">{selectedProduct.category_name}</p>
            </div>

            {selectedProduct.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-800">{selectedProduct.description}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div>
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                  selectedProduct.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedProduct.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Total Variants</label>
              <p className="text-gray-800 font-medium">{selectedProduct.variants?.length || 0}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Total Stock</label>
              <p className="text-gray-800 font-medium">
                {selectedProduct.variants?.reduce((sum, v) => sum + v.stock, 0) || 0} units
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Product Variants</h2>
            <p className="text-sm text-gray-500 mt-1">Manage different variants of this product</p>
          </div>
          <button
            onClick={() => setShowAddVariantModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Variant
          </button>
        </div>

        {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Variant</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">MRP</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Final Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.variants.map(variant => (
                  <tr key={variant.variant_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{variant.variant_name || 'Default'}</p>
                        {variant.weight && (
                          <p className="text-sm text-gray-500">{variant.weight}{variant.unit}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{variant.sku || '-'}</span>
                    </td>
                    <td className="py-4 px-4">
                      {variant.mrp_price ? (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{parseFloat(variant.mrp_price).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-800">
                        ₹{parseFloat(variant.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-pink-600">
                        ₹{parseFloat(variant.final_price).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        variant.stock > 10 
                          ? 'bg-green-100 text-green-700'
                          : variant.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {variant.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditVariant(variant)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVariant(variant.variant_id, variant.variant_name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No variants added yet</p>
            <button
              onClick={() => setShowAddVariantModal(true)}
              className="btn-primary"
            >
              Add First Variant
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddVariantModal && (
        <AddVariantModal
          productId={productId}
          onClose={() => setShowAddVariantModal(false)}
          onSuccess={() => {
            setShowAddVariantModal(false);
            loadProduct();
          }}
        />
      )}

      {showEditVariantModal && selectedVariant && (
        <EditVariantModal
          variant={selectedVariant}
          productId={selectedProduct.product_id}
          images={selectedProduct.images || []}
          onClose={() => {
            setShowEditVariantModal(false);
            setSelectedVariant(null);
          }}
          onSuccess={() => {
            setShowEditVariantModal(false);
            setSelectedVariant(null);
            loadProduct();
          }}
        />
      )}

      {showImageGallery && selectedProduct.images && (
        <ImageGalleryModal
          images={selectedProduct.images}
          productName={selectedProduct.product_name}
          onClose={() => setShowImageGallery(false)}
        />
      )}
    </div>
  );
}
