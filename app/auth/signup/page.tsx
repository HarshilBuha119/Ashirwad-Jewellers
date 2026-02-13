"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User, Loader, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        setMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-dark to-primary flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-4">
              A
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Join Ashirwad</h1>
            <p className="text-gray-600">Create your luxury jewelry account</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-primary mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 cursor-pointer mt-6">
              <input type="checkbox" className="w-4 h-4 rounded text-luxury-gold mt-1" required />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-luxury-gold font-semibold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-luxury-gold font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-gold text-luxury-dark font-bold py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-luxury-gold font-semibold hover:text-amber-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
