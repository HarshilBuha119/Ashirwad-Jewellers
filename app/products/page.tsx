"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchJewelry } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ChevronDown } from "lucide-react";

const CATEGORIES = [
  { value: "rings", label: "Rings" },
  { value: "necklace", label: "Necklaces" },
  { value: "earrings", label: "Earrings" },
  { value: "bracelets", label: "Bracelets" },
  { value: "watches", label: "Watches" },
  { value: "nose", label: "Nose Rings" },
];

const PRICE_RANGES = [
  { value: "0-10000", label: "₹0 - ₹10,000" },
  { value: "10000-50000", label: "₹10,000 - ₹50,000" },
  { value: "50000-100000", label: "₹50,000 - ₹100,000" },
  { value: "100000", label: "₹100,000+" },
];

async function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchJewelry();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by price
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      result = result.filter((p) => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [products, selectedCategory, selectedPriceRange, sortBy]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
          <h2 className="text-xl font-bold text-primary mb-6">Filters</h2>

          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="font-semibold text-primary mb-4 flex items-center justify-between">
              Category
              <ChevronDown size={18} />
            </h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={!selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-4 h-4 text-luxury-gold rounded"
                />
                <span className="ml-3 text-sm text-gray-700">All Categories</span>
              </label>
              {CATEGORIES.map((cat) => (
                <label key={cat.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={selectedCategory === cat.value}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-luxury-gold rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-8">
            <h3 className="font-semibold text-primary mb-4 flex items-center justify-between">
              Price
              <ChevronDown size={18} />
            </h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  value=""
                  checked={!selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-4 h-4 text-luxury-gold rounded"
                />
                <span className="ml-3 text-sm text-gray-700">All Prices</span>
              </label>
              {PRICE_RANGES.map((range) => (
                <label key={range.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    value={range.value}
                    checked={selectedPriceRange === range.value}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-4 h-4 text-luxury-gold rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold text-primary mb-4">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Products Grid */}
      <main className="lg:col-span-3">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {selectedCategory
              ? CATEGORIES.find((c) => c.value === selectedCategory)?.label
              : "All Products"}
          </h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center shadow-md">
            <p className="text-gray-600 text-lg mb-4">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedPriceRange("");
              }}
              className="text-luxury-gold font-semibold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-luxury-light py-8">
      <div className="container-padding max-w-7xl mx-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  );
}
