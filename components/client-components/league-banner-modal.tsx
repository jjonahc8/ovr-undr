"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LeagueBannerModal({
  onClose,
  submitLeagueChanges,
}: {
  onClose: () => void;
  submitLeagueChanges: (formData: FormData) => Promise<void>;
}) {
  const [mounted, setMounted] = useState(false);
  const [banner, setBanner] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBanner(file);
    setPreviewURL(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (banner) formData.append("banner", banner);

    await submitLeagueChanges(formData);
    router.refresh();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-scroll"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-black p-6 rounded-xl w-[90%] max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Edit League Banner</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!previewURL ? (
            <>
              <label htmlFor="leagueBannerUpload" className="cursor-pointer">
                <div className="flex items-center justify-center rounded-xl w-full h-32 hover:bg-slate-500 bg-slate-400">
                  Upload banner
                </div>
              </label>
              <input
                id="leagueBannerUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleBanner}
              />
            </>
          ) : (
            <div className="relative">
              <Image
                src={previewURL}
                alt="Banner preview"
                className="rounded-xl w-full h-32 object-cover"
                height={1080}
                width={1920}
              />
              <button
                type="button"
                onClick={() => {
                  setBanner(null);
                  setPreviewURL(null);
                }}
                className="absolute top-2 right-2 bg-black/70 rounded-full h-8 w-8 text-white text-2xl flex items-center justify-center hover:bg-black/60"
              >
                &times;
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={!banner}
            className={`rounded p-2 transition ${
              !banner
                ? "bg-gray-400 text-gray-700"
                : "bg-black text-white hover:bg-black/70"
            }`}
          >
            Save
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
