import { AuthButton } from "@/components/server-components/auth-button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  if (user) {
    redirect("/protected");
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <nav className="w-full border-b border-gray-700 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            Ovr/Undr
          </div>
          {/* <AuthButton /> */} 
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Ovr/Undr Sports
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            The social platform for sports betting enthusiasts. Share predictions, track performance, and compete with friends.
          </p>
          
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/auth/sign-up"
              className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors duration-200 min-w-[160px]"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="border border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-colors duration-200 min-w-[160px]"
            >
              Sign In
            </Link>
          </div> */}

          <div className="mb-8">
            <Link
              href="/mailing-list"
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-200 transition-colors duration-200 inline-block"
            >
              Join our mailing list for updates
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
            <div className="text-center p-6 border border-gray-700 rounded-lg bg-gray-900/30">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
              <p className="text-gray-400">Monitor your betting success and learn from your predictions</p>
            </div>
            
            <div className="text-center p-6 border border-gray-700 rounded-lg bg-gray-900/30">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Compete in Leagues</h3>
              <p className="text-gray-400">Join leagues with friends and climb the leaderboards</p>
            </div>
            
            <div className="text-center p-6 border border-gray-700 rounded-lg bg-gray-900/30">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Social Predictions</h3>
              <p className="text-gray-400">Share your picks and discuss with the community</p>
            </div>
          </div>
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
