import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchJewelry } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";

async function FeaturedProducts() {
  const products = await fetchJewelry();
  const featured = products.slice(0, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {featured.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-luxury-dark to-primary py-16 md:py-24 text-white">
        <div className="container-padding max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Timeless Luxury
                <span className="text-luxury-gold block">Jewelry Collection</span>
              </h1>
              <p className="text-gray-200 text-lg mb-8 max-w-md">
                Discover our exquisite collection of handcrafted jewelry featuring authentic gemstones and precious metals. Each piece tells a story of elegance and sophistication.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="bg-luxury-gold text-luxury-dark px-8 py-4 rounded-lg font-bold hover:bg-amber-600 transition-colors flex items-center gap-2"
                >
                  Shop Now
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden md:block">
              <div className="relative w-full aspect-square bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent flex items-center justify-center">
                  <Sparkles size={120} className="text-luxury-gold opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 md:py-16 border-b border-gray-200">
        <div className="container-padding max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={24} className="text-luxury-gold" />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Authentic Quality</h3>
                <p className="text-sm text-gray-600">100% genuine gemstones and metals</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck size={24} className="text-luxury-gold" />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Fast Shipping</h3>
                <p className="text-sm text-gray-600">Secure delivery within 3-5 days</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={24} className="text-luxury-gold" />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Lifetime Warranty</h3>
                <p className="text-sm text-gray-600">Free repairs and maintenance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container-padding max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Featured Collection</h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              Explore our handpicked selection of luxury jewelry pieces, curated for elegance and timeless appeal.
            </p>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProducts />
          </Suspense>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-luxury-light py-16 md:py-24 border-t border-gray-200">
        <div className="container-padding max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Shop by Category</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Rings", image: "rings", icon: "💍" },
              { name: "Necklaces", image: "necklace", icon: "✨" },
              { name: "Earrings", image: "earrings", icon: "👂" },
              { name: "Bracelets", image: "bracelets", icon: "🎀" },
              { name: "Watches", image: "watches", icon: "⌚" },
              { name: "Nose Rings", image: "nose", icon: "👃" },
            ].map((category) => (
              <Link
                key={category.image}
                href={`/products?category=${category.image}`}
                className="group relative h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark to-primary group-hover:from-primary group-hover:to-luxury-gold transition-all" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                  <span className="text-5xl">{category.icon}</span>
                  <h3 className="text-2xl font-bold text-center">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-luxury-gold to-amber-600 py-16 md:py-20">
        <div className="container-padding max-w-6xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Luxury Jewelry Awaits</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-95">
            From engagement rings to everyday elegance, find the perfect piece to celebrate life's precious moments.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-luxury-gold px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
