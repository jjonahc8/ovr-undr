"use client";

import { useState } from "react";
import Link from "next/link";

export default function MailingList() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/mailing-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Successfully subscribed to the mailing list!" });
        setEmail("");
      } else {
        setMessage({ type: "error", text: data.error || "Failed to subscribe. Please try again." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <nav className="w-full border-b border-gray-700 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
            ovr/undr
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Join Our Mailing List
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Be the first to know about new features, updates, and exclusive content.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white transition-colors text-white placeholder-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-900/30 border border-green-700 text-green-300"
                : "bg-red-900/30 border border-red-700 text-red-300"
            }`}>
              {message.text}
            </div>
          )}

          <Link
            href="/"
            className="inline-block mt-8 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-700 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 ovr/undr. Built for sports betting enthusiasts.</p>
        </div>
      </footer>
    </main>
  );
}
