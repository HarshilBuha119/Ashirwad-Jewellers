import React from "react";
import { Award, Heart, Zap, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-luxury-dark to-primary py-20 md:py-28 text-white">
        <div className="container-padding max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            About Ashirwad
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Celebrating timeless elegance and craftsmanship since our founding.
            Every piece tells a story of luxury and dedication.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container-padding max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6">Our Story</h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Ashirwad Jewellers was founded with a vision to bring luxury jewelry
                within reach of everyone. We believe that every celebration deserves
                a piece of elegance.
              </p>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                With years of expertise and a passion for craftsmanship, we source
                the finest gemstones and precious metals from trusted suppliers around
                the world. Each piece is carefully handcrafted by our skilled artisans.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our commitment to quality, authenticity, and customer satisfaction has
                made us a trusted name in the jewelry industry.
              </p>
            </div>

            <div className="bg-gradient-to-br from-luxury-gold/20 to-luxury-dark/10 rounded-2xl p-12 flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="text-6xl font-bold text-luxury-gold mb-2">20+</div>
                <p className="text-2xl font-semibold text-primary mb-8">Years of Excellence</p>
                <div className="space-y-4 text-gray-700">
                  <p>✓ 10,000+ Happy Customers</p>
                  <p>✓ 5,000+ Unique Designs</p>
                  <p>✓ 100% Authentic Gemstones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-luxury-light py-16 md:py-24 border-y border-gray-200">
        <div className="container-padding max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Quality",
                description:
                  "We never compromise on quality. Every piece is thoroughly inspected and certified.",
              },
              {
                icon: Heart,
                title: "Integrity",
                description:
                  "Honest dealings and transparent pricing. What you see is what you get.",
              },
              {
                icon: Zap,
                title: "Innovation",
                description:
                  "Blending traditional craftsmanship with modern design trends.",
              },
              {
                icon: Users,
                title: "Customer Focus",
                description:
                  "Your satisfaction is our priority. We're always here to help.",
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                  <Icon className="w-16 h-16 text-luxury-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-3">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-luxury-dark to-primary text-white py-16 md:py-24">
        <div className="container-padding max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-luxury-gold mb-2">10K+</div>
              <p className="text-lg text-gray-200">Happy Customers</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-luxury-gold mb-2">5K+</div>
              <p className="text-lg text-gray-200">Unique Designs</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-luxury-gold mb-2">100%</div>
              <p className="text-lg text-gray-200">Authentic</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-luxury-gold mb-2">24/7</div>
              <p className="text-lg text-gray-200">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container-padding max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Discover Our Collection
          </h2>
          <p className="text-gray-700 text-xl mb-8 max-w-2xl mx-auto">
            Explore our handpicked selection of luxury jewelry pieces, crafted with
            precision and passion.
          </p>
          <a
            href="/products"
            className="inline-block bg-luxury-gold text-luxury-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-600 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </section>
    </div>
  );
}
