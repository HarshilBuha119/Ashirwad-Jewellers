"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchJewelryById } from "@/lib/api";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Heart, ShoppingCart, ArrowLeft, Star, Check, Truck, Shield, RotateCcw } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchJewelryById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        quantity,
        description: product.description,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      alert("Please sign in to add favorites");
      return;
    }
    setIsFavorited(!isFavorited);
  };

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Product Not Found</h1>
          <Link href="/products" className="text-luxury-gold hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-light py-8">
      <div className="container-padding max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Link href="/products" className="inline-flex items-center gap-2 text-luxury-gold hover:text-amber-600 mb-8 transition-colors">
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-24 h-fit">
            <div className="relative aspect-square bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleToggleFavorite}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-luxury-gold group"
                aria-label="Add to favorites"
              >
                <Heart
                  size={24}
                  className={`transition-colors ${
                    isFavorited
                      ? "fill-red-500 text-red-500"
                      : "text-gray-800 group-hover:text-white"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-luxury-gold uppercase tracking-widest bg-luxury-light px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < 4 ? "fill-luxury-gold text-luxury-gold" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(128 reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="border-b border-gray-200 pb-6">
              <div className="text-4xl font-bold text-luxury-gold mb-2">
                ₹{product.price.toLocaleString()}
              </div>
              <p className="text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg">
              {product.metal_type && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Metal Type</p>
                    <p className="font-semibold text-primary">{product.metal_type}</p>
                  </div>
                </>
              )}
              {product.weight && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Weight</p>
                    <p className="font-semibold text-primary">{product.weight}g</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Availability</p>
                <p className="font-semibold text-green-600 flex items-center gap-1">
                  <Check size={16} />
                  In Stock
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Product ID</p>
                <p className="font-semibold text-primary text-sm">{product.id.substring(0, 8)}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
              <label className="text-sm font-semibold text-primary">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-luxury-light transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-luxury-light transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`py-4 px-6 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                addedToCart
                  ? "bg-green-500 text-white"
                  : "bg-luxury-gold text-luxury-dark hover:bg-amber-600"
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={24} />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={24} />
                  Add to Cart
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-700 bg-white p-4 rounded-lg">
                <Truck className="text-luxury-gold flex-shrink-0" size={20} />
                <span>Free shipping on orders above ₹500</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 bg-white p-4 rounded-lg">
                <Shield className="text-luxury-gold flex-shrink-0" size={20} />
                <span>100% Authentic & Certified</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 bg-white p-4 rounded-lg">
                <RotateCcw className="text-luxury-gold flex-shrink-0" size={20} />
                <span>30-day returns & exchange policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-20 border-t border-gray-300 pt-12">
          <h2 className="text-3xl font-bold text-primary mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related products */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                  <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
