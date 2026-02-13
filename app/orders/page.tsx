"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { fetchUserOrders } from "@/lib/api";
import { Calendar, Package, ArrowRight } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      const loadOrders = async () => {
        try {
          const data = await fetchUserOrders(user.id);
          setOrders(data || []);
        } catch (error) {
          console.error("Error loading orders:", error);
        } finally {
          setOrdersLoading(false);
        }
      };

      loadOrders();
    }
  }, [user]);

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-luxury-light border-t-luxury-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-luxury-light py-12">
      <div className="container-padding max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">My Orders</h1>
          <p className="text-gray-600">
            You have {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-primary mb-3">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't made any purchases yet. Explore our luxury jewelry collection.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-dark px-8 py-4 rounded-lg font-bold hover:bg-amber-600 transition-colors"
            >
              Start Shopping
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start mb-6 pb-6 border-b border-gray-200">
                  {/* Order ID */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order ID</p>
                    <p className="font-mono text-sm font-bold text-primary">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>

                  {/* Order Date */}
                  <div className="flex items-start gap-2">
                    <Calendar className="text-luxury-gold flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-semibold text-primary">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-luxury-gold">
                      ₹{order.total_amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-bold text-primary mb-4">Items</h3>
                  <div className="space-y-3">
                    {order.order_items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-primary">
                            {item.jewellary?.name || "Product"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-luxury-gold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 border-2 border-luxury-gold text-luxury-gold rounded-lg hover:bg-luxury-gold/10 transition-colors font-semibold">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
