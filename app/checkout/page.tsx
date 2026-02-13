"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { createOrder } from "@/lib/api";
import { ArrowLeft, Loader, Check } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, cartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      setError("Please sign in to place an order");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const order = await createOrder(user.id, items, cartTotal);

      if (order) {
        clearCart();
        setStep("confirmation");
      }
    } catch (err) {
      setError("Failed to place order. Please try again.");
      console.error("Order error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-luxury-light py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to proceed with checkout.</p>
          <Link
            href="/auth/login"
            className="inline-block bg-luxury-gold text-luxury-dark px-8 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-luxury-light py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Your Cart is Empty</h1>
          <Link
            href="/products"
            className="inline-block bg-luxury-gold text-luxury-dark px-8 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-luxury-light py-12">
        <div className="container-padding max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-3">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>

            <div className="bg-luxury-light p-6 rounded-lg mb-8 text-left">
              <h2 className="font-bold text-primary mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax (18% GST):</span>
                  <span className="font-semibold">₹{Math.round(cartTotal * 0.18).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between">
                  <span className="font-bold text-primary">Total Amount:</span>
                  <span className="text-2xl font-bold text-luxury-gold">
                    ₹{Math.round(cartTotal * 1.18).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/orders"
                className="block bg-luxury-gold text-luxury-dark px-8 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors"
              >
                View My Orders
              </Link>
              <Link
                href="/"
                className="block border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-light py-12">
      <div className="container-padding max-w-6xl mx-auto">
        <Link href="/cart" className="inline-flex items-center gap-2 text-luxury-gold hover:text-amber-600 mb-8 transition-colors font-semibold">
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Steps */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
                <div className="flex-1">
                  <div className={`flex items-center gap-3 ${step === "shipping" ? "text-luxury-gold" : "text-gray-400"}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === "shipping" ? "bg-luxury-gold text-white" : "bg-gray-200"}`}>
                      1
                    </div>
                    <span className="font-bold">Shipping</span>
                  </div>
                </div>

                <div className={`flex-1 h-1 mx-4 ${step !== "shipping" ? "bg-luxury-gold" : "bg-gray-200"}`} />

                <div className="flex-1">
                  <div className={`flex items-center gap-3 ${step === "payment" ? "text-luxury-gold" : "text-gray-400"}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === "payment" ? "bg-luxury-gold text-white" : "bg-gray-200"}`}>
                      2
                    </div>
                    <span className="font-bold">Payment</span>
                  </div>
                </div>
              </div>

              {/* Shipping Form */}
              {step === "shipping" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary mb-6">Shipping Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep("payment")}
                    className="w-full bg-luxury-gold text-luxury-dark py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Payment Form */}
              {step === "payment" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary mb-6">Payment Information</h2>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">CVV</label>
                      <input
                        type="text"
                        name="cardCvv"
                        placeholder="123"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("shipping")}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 bg-luxury-gold text-luxury-dark py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 h-fit">
              <h2 className="text-xl font-bold text-primary mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-primary">{item.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-luxury-gold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18%)</span>
                  <span>₹{Math.round(cartTotal * 0.18).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">Total</span>
                  <span className="text-2xl font-bold text-luxury-gold">
                    ₹{Math.round(cartTotal * 1.18).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
