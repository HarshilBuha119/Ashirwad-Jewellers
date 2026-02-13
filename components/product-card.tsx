"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import type { Jewelry } from "@/lib/supabase";

interface ProductCardProps {
  product: Jewelry;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
      description: product.description,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please sign in to add favorites");
      return;
    }
    setIsFavorited(!isFavorited);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer h-full">
        <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-100 aspect-square">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-between p-4 opacity-0 group-hover:opacity-100">
              <button
                onClick={handleToggleFavorite}
                className="p-3 bg-white rounded-full hover:bg-luxury-gold transition-colors"
                aria-label="Add to favorites"
              >
                <Heart
                  size={20}
                  className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-800"}
                />
              </button>
              <button
                onClick={handleAddToCart}
                className={`p-3 rounded-full transition-colors ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-white hover:bg-luxury-gold text-gray-800"
                }`}
                aria-label="Add to cart"
              >
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="mb-2">
              <span className="text-xs font-semibold text-luxury-gold uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            <h3 className="font-bold text-primary text-lg mb-2 group-hover:text-luxury-gold transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Price and Metal Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-luxury-gold">
                  ₹{product.price.toLocaleString()}
                </p>
                {product.weight && (
                  <p className="text-xs text-gray-500 mt-1">
                    {product.weight}g
                  </p>
                )}
              </div>
              {product.metal_type && (
                <span className="text-xs bg-luxury-light text-primary px-2 py-1 rounded">
                  {product.metal_type}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
