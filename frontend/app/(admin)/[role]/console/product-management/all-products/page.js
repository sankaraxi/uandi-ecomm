// frontend/app/(admin)/product-management/all-products/page.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, updateStock } from '@/store/productsSlice';
import { fetchCategories } from '@/store/categoriesSlice';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';
import ProductPreviewModal from '@/components/ProductPreviewModal';
import StockUpdateModal from '@/components/StockUpdateModal';
import { useParams, useRouter } from "next/navigation";



export default function AllProductsPage() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories || { categories: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewProduct, setPreviewProduct] = useState(null);
  const [stockUpdateProduct, setStockUpdateProduct] = useState(null);
  const router = useRouter();
  const { role } = useParams();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async (productId, productName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${productName}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ec4899',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#ec4899'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete product.',
          icon: 'error',
          confirmButtonColor: '#ec4899'
        });
      }
    }
  };

  const handleStockUpdate = async (variantId, newStock) => {
    try {
      await dispatch(updateStock({ variantId, stock: newStock })).unwrap();
      dispatch(fetchProducts());
      Swal.fire({
        title: 'Success!',
        text: 'Stock updated successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update stock.',
        icon: 'error',
        confirmButtonColor: '#ec4899'
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category.category_id == categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && product.is_active) || 
      (statusFilter === 'inactive' && !product.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = useMemo(() => {
    const total = products?.length || 0;
    const active = products?.filter(p => p.is_active)?.length || 0;
    const outOfStock = products?.filter(p => (p.variants || []).reduce((s, v) => s + (v.stock || 0), 0) <= 0)?.length || 0;
    return { total, active, outOfStock };
  }, [products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your catalog, stock and visibility</p>
        </div>
        <Link href={`/${role}/console/product-management/add-product`} className="btn-primary inline-flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-lg bg-pink-50 p-3">
            <FunnelIcon className="w-6 h-6 text-pink-600" />
          </div>
        </div>
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.outOfStock}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {(categories || []).map(cat => (
              <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Product</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Variants</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Stock</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.product_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {product.main_image ? (
                        <img 
                          src={product.main_image} 
                          alt={product.product_name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div>
                        <Link href={`/${role}/console/product-management/product-details/${product.product_id}`} className="font-medium text-gray-800 hover:text-pink-600">
                          {product.product_name}
                        </Link>
                        <p className="text-sm text-gray-500">ID: {product.product_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{product.category.category_name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{product.variants.length} variant(s)</span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => setStockUpdateProduct(product)}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Total: {product.variants.reduce((sum, v) => sum + v.stock, 0)}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      product.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
  onClick={() => router.push(`/${role}/console/product-management/product-details/${product.product_id}`)}
  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
  title="View Details"
>
  <EyeIcon className="w-5 h-5" />
</button>
                      <Link href={`/${role}/console/product-management/edit-product/${product.product_id}`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.product_id, product.product_name)}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {previewProduct && (
        <ProductPreviewModal
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
        />
      )}

      {stockUpdateProduct && (
        <StockUpdateModal
          product={stockUpdateProduct}
          onClose={() => setStockUpdateProduct(null)}
          onUpdate={handleStockUpdate}
        />
      )}
    </div>
  );
}
