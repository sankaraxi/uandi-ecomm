"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import {
    deleteVariant,
    fetchProductById,
    selectSelectedProduct,
} from "@/store/productsSlice";
import { Plus, ArrowLeft } from "lucide-react";

export default function VariantDetailsPage() {
    const { id, "variant-id": variantId, role } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const product = useSelector(selectSelectedProduct);
    const [variant, setVariant] = useState(null);
    const [openSection, setOpenSection] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch product details
    useEffect(() => {
        if (id) dispatch(fetchProductById(id));
    }, [dispatch, id]);

    // Find specific variant once product is loaded
    useEffect(() => {
        if (product?.variants?.length) {
            const foundVariant = product.variants.find(
                (v) => v.variant_id === parseInt(variantId)
            );
            setVariant(foundVariant || null);

            // Set default main image
            if (foundVariant?.images?.length) {
                const main =
                    foundVariant.images.find((img) => img.is_main) ||
                    foundVariant.images[0];
                setSelectedImage(main);
            }
        }
    }, [product, variantId]);

    const handleDelete = async () => {
        // SweetAlert confirmation
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete this variant.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            await dispatch(deleteVariant({ productId: id, variantId }));

            await Swal.fire({
                title: "Deleted!",
                text: "The variant has been successfully deleted.",
                icon: "success",
                confirmButtonColor: "#ec4899",
                timer: 1500,
                showConfirmButton: false,
            });

            router.push(`/${role}/console/product-management/product-details/${id}`);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to delete the variant. Please try again.",
                icon: "error",
                confirmButtonColor: "#ec4899",
            });
        }
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    if (!variant) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading variant details...</p>
            </div>
        );
    }

    const images = variant.images || [];

    return (
        <div className="min-h-screen">
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Back Button */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href={`/${role}/console/product-management/product-details/${id}`}>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Product</span>
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square relative">
                            <Image
                                key={selectedImage?.image_url || "/placeholder.svg"}
                                src={selectedImage?.image_url || "/placeholder.svg"}
                                alt={variant.variant_name || "Variant Image"}
                                width={600}
                                height={600}
                                className="w-full h-full object-cover transition-all duration-300 ease-in-out"
                            />
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <div
                                        key={img.image_id || index}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                                            selectedImage?.image_url === img.image_url
                                                ? "border-pink-500 scale-105"
                                                : "border-transparent hover:border-gray-300"
                                        }`}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <Image
                                            src={img.image_url || "/placeholder.svg"}
                                            alt={`Thumbnail ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="py-4">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {variant.variant_name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                <span className="text-lg font-medium text-gray-700">
                  {variant.weight ? `${variant.weight}${variant.unit}` : "—"}
                </span>
                                <span className="text-2xl font-bold text-gray-900">
                  ₹{variant.price}
                </span>
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed">
                                {variant.description ||
                                    "This variant currently has no description."}
                            </p>
                        </div>

                        <div className="border-t border-gray-200 my-8"></div>

                        {/* Expandable Sections */}
                        <div className="space-y-4">
                            {[
                                {
                                    key: "details",
                                    title: "Details",
                                    content:
                                        "Product details and specifications will appear here...",
                                },
                                {
                                    key: "payments",
                                    title: "Payments Options",
                                    content: "Available payment methods will appear here...",
                                },
                                {
                                    key: "shipping",
                                    title: "Shipping",
                                    content: "Shipping information and options will appear here...",
                                },
                            ].map(({ key, title, content }) => (
                                <div key={key} className="border-b border-gray-200 pb-4">
                                    <button
                                        onClick={() => toggleSection(key)}
                                        className="flex items-center justify-between w-full text-left"
                                    >
                    <span className="text-lg font-semibold text-gray-900">
                      {title}
                    </span>
                                        <Plus
                                            className={`w-5 h-5 text-gray-600 transition-transform ${
                                                openSection === key ? "rotate-45" : ""
                                            }`}
                                        />
                                    </button>
                                    {openSection === key && (
                                        <div className="mt-4 text-gray-600">
                                            <p>{content}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() =>
                                    router.push(
                                        `/${role}/console/product-management/product-details/${id}/variant/${variantId}/edit`
                                    )
                                }
                                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
                            >
                                Edit Variant
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
                            >
                                Delete Variant
                            </button>
                        </div>

                        {/* Extra Info */}
                        <div className="mt-8 grid grid-cols-2 gap-6 text-sm text-gray-500">
                            <div>
                                <p className="font-medium mb-1">SKU</p>
                                <p>{variant.sku || "N/A"}</p>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Stock</p>
                                <p
                                    className={
                                        variant.stock === 0
                                            ? "text-red-600"
                                            : variant.stock < 10
                                                ? "text-orange-600"
                                                : "text-green-600"
                                    }
                                >
                                    {variant.stock} units
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
