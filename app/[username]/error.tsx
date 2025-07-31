"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Error in /post/[id]:", error);
  }, [error]);

  return (
    <div className="text-white flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-2xl font-bold mb-4">404 Page Not Found</h1>
      <button
        onClick={() => router.replace("/protected")}
        className="px-4 py-2 rounded bg-white text-black hover:bg-white/80"
      >
        Return to home
      </button>
    </div>
  );
}
