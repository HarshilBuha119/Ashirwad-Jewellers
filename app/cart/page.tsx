"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-light py-12">
        <div className="container-padding max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-primary mb-3">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Explore our luxury jewelry collection and add items to your cart.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-dark px-8 py-4 rounded-lg font-bold hover:bg-amber-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-light py-12">
      <div className="container-padding max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex gap-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="text-lg font-bold text-primary hover:text-luxury-gold transition-colors cursor-pointer mb-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-2xl font-bold text-luxury-gold">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex flex-col items-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Total for Item */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-2">
                          Subtotal:
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="mt-auto p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping Link */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-luxury-gold hover:text-amber-600 mt-6 transition-colors font-semibold"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 h-fit">
              <h2 className="text-2xl font-bold text-primary mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18% GST)</span>
                  <span>₹{Math.round(cartTotal * 0.18).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-xl">
                <span className="font-bold text-primary">Total</span>
                <span className="text-3xl font-bold text-luxury-gold">
                  ₹{Math.round(cartTotal * 1.18).toLocaleString()}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-luxury-gold text-luxury-dark py-4 rounded-lg font-bold text-lg hover:bg-amber-600 transition-colors text-center block mb-3"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear your cart?")) {
                    clearCart();
                  }
                }}
                className="w-full border-2 border-red-600 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Clear Cart
              </button>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-luxury-light rounded-lg text-sm text-gray-700">
                <p className="font-semibold mb-2">✓ Secure Checkout</p>
                <p>Your payment information is encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
