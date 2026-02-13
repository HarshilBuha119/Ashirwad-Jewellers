"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { User, Mail, Phone, MapPin, LogOut, Edit2, Save, X, Loader } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, loading, isAuthenticated } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-luxury-light border-t-luxury-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zip: profileData.zip,
        },
      });

      if (error) {
        alert("Error saving profile: " + error.message);
      } else {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-luxury-light py-12">
      <div className="container-padding max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-luxury-gold to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-primary mb-1">
                  {profileData.fullName || user?.user_metadata?.full_name || "User"}
                </h2>
                <p className="text-gray-600 text-sm break-all">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2 border-t border-gray-200 pt-6">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 bg-luxury-gold/10 text-luxury-gold rounded-lg font-semibold"
                >
                  <User size={20} />
                  My Profile
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                >
                  <Mail size={20} />
                  My Orders
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                >
                  <Mail size={20} />
                  Favorites
                </Link>
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold border border-red-200"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-primary">Profile Information</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-luxury-dark rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Profile Form */}
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={profileData.state}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>

                    {/* ZIP Code */}
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={profileData.zip}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            zip: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-luxury-gold text-luxury-dark rounded-lg hover:bg-amber-600 transition-colors font-bold disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <Mail className="text-luxury-gold flex-shrink-0" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="text-lg font-semibold text-primary">{user?.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  {profileData.phone && (
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                      <Phone className="text-luxury-gold flex-shrink-0" size={24} />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="text-lg font-semibold text-primary">{profileData.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  {profileData.address && (
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                      <MapPin className="text-luxury-gold flex-shrink-0 mt-1" size={24} />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-lg font-semibold text-primary">
                          {profileData.address}
                          {profileData.city && `, ${profileData.city}`}
                          {profileData.state && `, ${profileData.state}`}
                          {profileData.zip && ` ${profileData.zip}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {!profileData.phone && !profileData.address && (
                    <p className="text-gray-600 text-center py-8">
                      No additional profile information yet. Click "Edit Profile" to add details.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
