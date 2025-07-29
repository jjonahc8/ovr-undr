"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function EditProfileModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-black p-6 rounded-xl w-[90%] max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-black text-white rounded p-2 hover:bg-gray-900 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
