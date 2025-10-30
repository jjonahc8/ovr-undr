"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import Image from "next/image";

export default function EditProfileModal({
  onClose,
  submitProfileChanges,
}: {
  onClose: () => void;
  submitProfileChanges: (formData: FormData) => Promise<void>;
}) {
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreviewURL, setBannerPreviewURL] = useState<string | null>(null);
  const [pfp, setPFP] = useState<File | null>(null);
  const [pfpPreviewURL, setPFPPreviewURL] = useState<string | null>(null);
  const router = useRouter();
  const formData = new FormData();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (firstName) formData.append("firstName", firstName);
    if (lastName) formData.append("lastName", lastName);
    if (bio) formData.append("bio", bio);
    if (banner) formData.append("banner", banner);
    if (pfp) formData.append("pfp", pfp);
    await submitProfileChanges(formData);
    router.refresh();
    onClose();
  };

  const handleBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBanner(file);
    setBannerPreviewURL(file ? URL.createObjectURL(file) : null);
  };

  const handlePFP = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPFP(file);
    setPFPPreviewURL(file ? URL.createObjectURL(file) : null);
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
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* later make it so that when you open the form it fetches current values */}
          <div className="relative inline-block">
            {!bannerPreviewURL && (
              <>
                <label
                  htmlFor="backgroundUpload"
                  className="cursor-pointer text-black"
                >
                  <div
                    className="flex items-center justify-center  rounded-xl w-full h-32 
                hover:bg-slate-500 bg-slate-400"
                  >
                    Edit banner
                  </div>
                </label>
                <input
                  type="file"
                  id="backgroundUpload"
                  className="hidden"
                  onChange={(e) => {
                    handleBanner(e);
                  }}
                />
              </>
            )}
            {bannerPreviewURL && (
              <div className="relative">
                <Image
                  src={bannerPreviewURL}
                  alt="Preview"
                  className="rounded-xl w-full h-32"
                  height={1080}
                  width={1920}
                />
                <button
                  type="button"
                  onClick={() => {
                    setBanner(null);
                    setBannerPreviewURL(null);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full h-8 w-8 text-white text-2xl 
                flex items-center justify-center hover:bg-opacity-60"
                >
                  &times;
                </button>
              </div>
            )}
            {!pfpPreviewURL && (
              <>
                <label
                  htmlFor="profileUpload"
                  className="cursor-pointer text-black overflow-hidden h-32 w-32"
                >
                  <div
                    className="absolute left-4 bottom-0 translate-y-1/2 flex items-center justify-center text-center overflow-hidden 
                    rounded-full h-32 w-32 hover:bg-slate-300 bg-slate-200"
                  >
                    Edit profile picture
                  </div>
                </label>
                <input
                  type="file"
                  id="profileUpload"
                  className="hidden"
                  onChange={(e) => {
                    handlePFP(e);
                  }}
                />
              </>
            )}
            {pfpPreviewURL && (
              <div className="absolute left-4 bottom-0 translate-y-1/2 inline-block group overflow-hidden rounded-full h-32 w-32">
                <Image
                  src={pfpPreviewURL}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  height={1080}
                  width={1920}
                />
                <button
                  type="button"
                  onClick={() => {
                    setPFP(null);
                    setPFPPreviewURL(null);
                  }}
                  className="absolute inset-0 bg-black bg-opacity-50 text-white text-5xl hidden group-hover:flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="p-2 border rounded mt-16"
            maxLength={50}
          />
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="p-2 border rounded"
            maxLength={50}
          />
          <TextareaAutosize
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="p-2 border rounded"
            maxLength={160}
          />
          <button
            type="submit"
            disabled={
              firstName.trim() === "" &&
              lastName.trim() === "" &&
              bio.trim() === "" &&
              !banner &&
              !pfp
            }
            className={`bg-black text-white rounded p-2 transition ${
              firstName.trim() === "" &&
              lastName.trim() === "" &&
              bio.trim() === "" &&
              !banner &&
              !pfp
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
