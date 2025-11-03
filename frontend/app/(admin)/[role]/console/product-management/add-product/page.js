// frontend/app/(admin)/product-management/add-product/page.js
'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/store/productsSlice';
import { fetchCategories } from '@/store/categoriesSlice';
import Swal from 'sweetalert2';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AddProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories } = useSelector(state => state.categories);
  
  const [formData, setFormData] = useState({
    product_name: '',
    category_id: '',
    description: '',
    is_active: true
  });

  const [images, setImages] = useState(['']);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.product_name || !formData.category_id) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields',
        icon: 'error',
        confirmButtonColor: '#ec4899'
      });
      return;
    }

    try {
      // Create product
      const productResult = await dispatch(createProduct(formData)).unwrap();
      const productId = productResult.data.product_id;

      // Add images
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          await fetch(`${API_URL}/products/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_id: productId,
              image_url: images[i],
              is_main: i === 0
            })
          });
        }
      }

      Swal.fire({
        title: 'Success!',
        text: 'Product created successfully. You can now add variants.',
        icon: 'success',
        confirmButtonColor: '#ec4899',
        showCancelButton: true,
        confirmButtonText: 'Add Variants',
        cancelButtonText: 'Go to Products'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/admin/product-management/product-details/${productId}`);
        } else {
          router.push('/admin/product-management/all-products');
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create product',
        icon: 'error',
        confirmButtonColor: '#ec4899'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-500 mt-1">Create a new product (Add variants later)</p>
        </div>
        <Link href="/admin/product-management/all-products">
          <button className="btn-secondary">Cancel</button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="input-field"
              placeholder="Enter product description..."
            ></textarea>
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Active Product
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Product Images</h2>
              <p className="text-sm text-gray-500 mt-1">First image will be set as main image</p>
            </div>
            <button
              type="button"
              onClick={addImageField}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Image
            </button>
          </div>

          <div className="space-y-3">
            {images.map((image, index) => (
              <div key={index} className="flex items-center gap-3">
                {image && (
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Enter image URL"
                  className="input-field flex-1"
                />
                {index === 0 && (
                  <span className="text-sm text-pink-600 font-medium whitespace-nowrap px-3 py-1 bg-pink-50 rounded-full">
                    Main Image
                  </span>
                )}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/product-management/all-products">
            <button type="button" className="btn-secondary">
              Cancel
            </button>
          </Link>
          <button type="submit" className="btn-primary">
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
