import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-luxury-dark text-white mt-20">
      <div className="container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-dark font-bold text-lg">
                A
              </div>
              <h3 className="text-xl font-bold">Ashirwad</h3>
            </div>
            <p className="text-sm text-gray-300">
              Premium jewelry collection with authentic gemstones and precious metals. Timeless designs for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-luxury-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-luxury-gold">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=rings" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/products?category=necklace" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/products?category=earrings" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/products?category=bracelets" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-luxury-gold">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-luxury-gold mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-luxury-gold mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-300">info@ashirwad.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-luxury-gold mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-300">123 Jewelry Lane, Premium City, PC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-white/10 pt-8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-gray-400">© 2024 Ashirwad Jewellers. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-300 hover:text-luxury-gold transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-luxury-gold transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-luxury-gold transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
