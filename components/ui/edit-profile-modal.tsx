"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";

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
    await submitProfileChanges(formData);
    router.refresh();
    onClose();
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* later make it so that when you open the form it fetches current values */}
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="p-2 border rounded"
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
              bio.trim() === ""
            }
            className={`bg-black text-white rounded p-2 transition ${
              firstName.trim() === "" &&
              lastName.trim() === "" &&
              bio.trim() === ""
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
