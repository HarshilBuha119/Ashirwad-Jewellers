"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Loader } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });

      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-luxury-dark to-primary py-20 md:py-28 text-white">
        <div className="container-padding max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            We'd love to hear from you. Reach out to our team anytime.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container-padding max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-primary mb-8">Contact Information</h2>

              {[
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+1 (555) 123-4567",
                  subtext: "Mon-Fri, 9 AM - 6 PM EST",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "info@ashirwad.com",
                  subtext: "We'll respond within 24 hours",
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: "123 Jewelry Lane, Premium City, PC 12345",
                  subtext: "Visit our showroom",
                },
                {
                  icon: Clock,
                  label: "Hours",
                  value: "Monday - Sunday: 10 AM - 8 PM",
                  subtext: "Closed on public holidays",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-luxury-gold/10">
                        <Icon className="text-luxury-gold" size={24} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-1">
                        {item.label}
                      </h3>
                      <p className="text-gray-700 font-semibold">{item.value}</p>
                      <p className="text-gray-600 text-sm mt-1">{item.subtext}</p>
                    </div>
                  </div>
                );
              })}

              {/* Map Placeholder */}
              <div className="bg-luxury-light rounded-lg h-80 flex items-center justify-center border-2 border-gray-200">
                <div className="text-center">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-semibold">
                    Map will be displayed here
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-primary mb-8">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    ✓ Thank you for reaching out! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-luxury-gold text-luxury-dark py-3 rounded-lg font-bold text-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                  We typically respond within 24 hours. For urgent inquiries,
                  please call us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-luxury-light py-16 md:py-24 border-t border-gray-200">
        <div className="container-padding max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "What is your return policy?",
                a: "We offer a 30-day return and exchange policy on all purchases. Items must be in original condition with all packaging.",
              },
              {
                q: "Do you provide certificates for gemstones?",
                a: "Yes, all gemstones above a certain weight come with authentic certifications from recognized gemological institutes.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, digital wallets, and bank transfers for your convenience.",
              },
              {
                q: "How long does shipping take?",
                a: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery.",
              },
              {
                q: "Do you offer customization services?",
                a: "Yes! We offer custom design services. Please contact our team to discuss your specific requirements.",
              },
              {
                q: "Are your products insured?",
                a: "All products are shipped with insurance. We recommend additional insurance for high-value items.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-primary mb-3">{item.q}</h3>
                <p className="text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
