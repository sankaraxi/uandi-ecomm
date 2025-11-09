"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProductById, selectSelectedProduct } from "@/store/productsSlice";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EditVariantPage() {
    const { id: productId, "variant-id": variantId, role } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const product = useSelector(selectSelectedProduct);

    const [formData, setFormData] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([""]);
    const [loading, setLoading] = useState(true);

    // Fetch the product and variant details
    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(productId));
        }
    }, [dispatch, productId]);

    useEffect(() => {
        if (product?.variants?.length) {
            const foundVariant = product.variants.find(
                (v) => v.variant_id === parseInt(variantId)
            );

            if (foundVariant) {
                setFormData({
                    variant_name: foundVariant.variant_name || "",
                    sku: foundVariant.sku || "",
                    mrp_price: foundVariant.mrp_price || "",
                    price: foundVariant.price || "",
                    gst_percentage: foundVariant.gst_percentage || 18,
                    gst_included:
                        foundVariant.gst_included !== undefined
                            ? foundVariant.gst_included
                            : true,
                    stock: foundVariant.stock || 0,
                    weight: foundVariant.weight || "",
                    unit: foundVariant.unit || "ml",
                });
                setExistingImages(foundVariant.images || []);
            }
            setLoading(false);
        }
    }, [product, variantId]);

    // Input handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddNewImageField = () =>
        setNewImages((imgs) => [...imgs, ""]);

    const handleChangeNewImage = (idx, val) =>
        setNewImages((imgs) =>
            imgs.map((u, i) => (i === idx ? val : u))
        );

    const handleRemoveNewImage = (idx) =>
        setNewImages((imgs) =>
            imgs.length > 1 ? imgs.filter((_, i) => i !== idx) : imgs
        );

    const handleDeleteExistingImage = async (imageId) => {
        try {
            const res = await fetch(`${API_URL}/products/images/${imageId}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!json?.success) throw new Error(json?.message || "Failed");
            setExistingImages((imgs) =>
                imgs.filter((img) => img.image_id !== imageId)
            );
            Swal.fire({
                title: "Deleted!",
                text: "Image removed successfully.",
                icon: "success",
                confirmButtonColor: "#ec4899",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err?.message || "Failed to remove image",
                icon: "error",
                confirmButtonColor: "#ec4899",
            });
        }
    };

    const calculateFinalPrice = () => {
        if (!formData?.price) return 0;
        const price = parseFloat(formData.price);
        const gst = parseFloat(formData.gst_percentage);
        return formData.gst_included ? price : price + (price * gst) / 100;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData?.price) {
            Swal.fire({
                title: "Error!",
                text: "Please enter a valid price.",
                icon: "error",
                confirmButtonColor: "#ec4899",
            });
            return;
        }

        try {
            // Update variant details
            const response = await fetch(
                `${API_URL}/products/variants/${variantId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!data.success) throw new Error(data.message);

            // Add new images (if provided)
            for (const url of newImages) {
                if (!url.trim()) continue;
                await fetch(`${API_URL}/products/images`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        product_id: productId,
                        variant_id: variantId,
                        image_url: url.trim(),
                        is_main: false,
                    }),
                });
            }

            Swal.fire({
                title: "Success!",
                text: "Variant updated successfully",
                icon: "success",
                confirmButtonColor: "#ec4899",
                timer: 2000,
                showConfirmButton: false,
            });

            router.push(`/${role}/console/product-management/product-details/${productId}`);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message || "Failed to update variant",
                icon: "error",
                confirmButtonColor: "#ec4899",
            });
        }
    };

    if (loading || !formData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-10 w-10 border-b-2 border-pink-500 mx-auto mb-3"></div>
                    <p className="text-gray-500">Loading variant details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-50 rounded-xl"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Edit Variant
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Update variant information and images
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: "Variant Name", name: "variant_name" },
                                { label: "SKU", name: "sku" },
                                { label: "MRP Price (₹)", name: "mrp_price" },
                                { label: "Selling Price (₹)", name: "price", required: true },
                                { label: "GST (%)", name: "gst_percentage" },
                                { label: "Stock", name: "stock", required: true },
                                { label: "Weight", name: "weight" },
                            ].map((f) => (
                                <div key={f.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {f.label}
                                    </label>
                                    <input
                                        type="text"
                                        name={f.name}
                                        value={formData[f.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                                        required={f.required}
                                    />
                                </div>
                            ))}

                            {/* Unit Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                                >
                                    <option value="ml">ml</option>
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="l">l</option>
                                    <option value="pcs">pcs</option>
                                </select>
                            </div>
                        </div>

                        {/* GST Included */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="gst_included"
                                checked={formData.gst_included}
                                onChange={handleChange}
                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                GST Included in Price
                            </label>
                        </div>

                        {/* Final Price */}
                        <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
                            <div className="flex justify-between text-gray-700">
                                <span>Final Price:</span>
                                <span className="font-bold text-pink-600">
                  ₹{calculateFinalPrice().toFixed(2)}
                </span>
                            </div>
                        </div>

                        {/* Image Management */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-gray-800">
                                Variant Images
                            </h3>

                            {/* Existing Images */}
                            {existingImages.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {existingImages.map((img) => (
                                        <div key={img.image_id} className="relative group">
                                            <img
                                                src={img.image_url}
                                                alt=""
                                                className="w-full h-24 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteExistingImage(img.image_id)
                                                }
                                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-white/90 text-red-600 text-xs px-2 py-1 rounded transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No images for this variant yet.
                                </p>
                            )}

                            {/* Add new image URLs */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-700">
                                        Add new image URLs
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleAddNewImageField}
                                        className="text-xs text-pink-600 hover:underline"
                                    >
                                        + Add Image
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {newImages.map((u, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={u}
                                                onChange={(e) =>
                                                    handleChangeNewImage(idx, e.target.value)
                                                }
                                                placeholder="https://..."
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl"
                                            />
                                            {newImages.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveNewImage(idx)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
