// frontend/app/(admin)/product-management/categories/page.js
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '@/store/categoriesSlice';
import Swal from 'sweetalert2';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.categories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    category_name: '',
    category_description: ''
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        category_name: category.category_name,
        category_description: category.category_description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        category_name: '',
        category_description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ category_name: '', category_description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await dispatch(updateCategory({ 
          id: editingCategory.category_id, 
          categoryData: formData 
        })).unwrap();
        Swal.fire({
          title: 'Success!',
          text: 'Category updated successfully',
          icon: 'success',
          confirmButtonColor: '#ec4899'
        });
      } else {
        await dispatch(createCategory(formData)).unwrap();
        Swal.fire({
          title: 'Success!',
          text: 'Category created successfully',
          icon: 'success',
          confirmButtonColor: '#ec4899'
        });
      }
      handleCloseModal();
      dispatch(fetchCategories());
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to save category',
        icon: 'error',
        confirmButtonColor: '#ec4899'
      });
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${categoryName}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ec4899',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
        Swal.fire({
          title: 'Deleted!',
          text: 'Category has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#ec4899'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Cannot delete category with existing products',
          icon: 'error',
          confirmButtonColor: '#ec4899'
        });
      }
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 mt-1">Manage product categories</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.category_id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {category.category_name}
                </h3>
                {category.category_description && (
                  <p className="text-gray-500 text-sm mt-1">
                    {category.category_description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Created: {new Date(category.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(category.category_id, category.category_name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No categories found. Create your first category!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.category_description}
                  onChange={(e) => setFormData({ ...formData, category_description: e.target.value })}
                  rows="3"
                  className="input-field"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
