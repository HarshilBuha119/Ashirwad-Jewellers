"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { fetchFavorites } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { Heart, ArrowRight } from "lucide-react";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      const loadFavorites = async () => {
        try {
          const data = await fetchFavorites(user.id);
          setFavorites(data || []);
        } catch (error) {
          console.error("Error loading favorites:", error);
        } finally {
          setFavoritesLoading(false);
        }
      };

      loadFavorites();
    }
  }, [user]);

  if (loading || favoritesLoading) {
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
      <div className="container-padding max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">My Favorites</h1>
          <p className="text-gray-600">
            You have {favorites.length} favorite item{favorites.length !== 1 ? "s" : ""}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Heart size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-primary mb-3">No Favorites Yet</h2>
            <p className="text-gray-600 mb-8">
              Start adding your favorite jewelry pieces to keep track of items you love.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-dark px-8 py-4 rounded-lg font-bold hover:bg-amber-600 transition-colors"
            >
              Explore Products
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <ProductCard
                key={favorite.product_id}
                product={favorite.jewellary || favorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
