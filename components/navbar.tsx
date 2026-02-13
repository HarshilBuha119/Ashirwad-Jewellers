"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Menu, X, ShoppingBag, User, LogOut, Search } from "lucide-react";

export function Navbar() {
  const { cartCount } = useCart();
  const { user, signOut, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-luxury-dark text-white shadow-lg">
      <div className="container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-luxury-gold transition-colors">
            <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-dark font-bold">
              A
            </div>
            <span className="hidden sm:inline">Ashirwad</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 ml-12">
            <Link href="/products" className="hover:text-luxury-gold transition-colors text-sm">
              Products
            </Link>
            <Link href="/about" className="hover:text-luxury-gold transition-colors text-sm">
              About
            </Link>
            <Link href="/contact" className="hover:text-luxury-gold transition-colors text-sm">
              Contact
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors" aria-label="User menu">
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-luxury-dark rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/profile" className="block px-4 py-3 hover:bg-luxury-gold/10 first:rounded-t-lg">
                    My Profile
                  </Link>
                  <Link href="/favorites" className="block px-4 py-3 hover:bg-luxury-gold/10">
                    Favorites
                  </Link>
                  <Link href="/orders" className="block px-4 py-3 hover:bg-luxury-gold/10">
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-luxury-gold/10 last:rounded-b-lg flex items-center gap-2 text-red-600"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-luxury-gold text-luxury-dark rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-white/10">
            <Link href="/products" className="block px-4 py-2 hover:bg-luxury-gold/10 transition-colors">
              Products
            </Link>
            <Link href="/about" className="block px-4 py-2 hover:bg-luxury-gold/10 transition-colors">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 hover:bg-luxury-gold/10 transition-colors">
              Contact
            </Link>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-600/10 text-red-400"
              >
                Sign Out
              </button>
            )}
          </nav>
        )}

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4">
            <input
              type="text"
              placeholder="Search jewelry..."
              className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            />
          </div>
        )}
      </div>
    </header>
  );
}
