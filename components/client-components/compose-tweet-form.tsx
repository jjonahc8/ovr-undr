"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import { GoFileMedia } from "react-icons/go";

export default function ComposeTweetForm({
  submitTweet,
}: {
  submitTweet: (formData: FormData) => void;
}) {
  const [tweet, setTweet] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const formData = new FormData();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    formData.append("tweet", tweet);
    if (image) formData.append("file", image);

    submitTweet(formData);
    setTweet("");
    setImage(null);
    setImagePreviewUrl(null);
    router.refresh();
  };

  const handleImage = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-full">
      <TextareaAutosize
        name="tweet"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="What's the plot?"
        className="w-full h-full text-2xl placeholder:text-gray-600 bg-transparent border-b-[0.5px] border-gray-600 p-4 
          outline-none border-none no-scrollbar"
        maxLength={280}
      />

      {imagePreviewUrl && (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setImagePreviewUrl(null);
            }}
            className="absolute top-2 right-10 bg-black bg-opacity-70 rounded-full h-8 w-8 text-white text-2xl hover:bg-opacity-60"
          >
            &times;
          </button>
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className="rounded-xl max-w-md ml-4"
          />
        </div>
      )}
      <div className="w-full justify-between items-center flex border-t-[0.5px] border-gray-600 mt-6">
        <label htmlFor="fileUpload" className="cursor-pointer text-white mt-4">
          <GoFileMedia />
        </label>
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={(e) => {
            handleImage(e);
          }}
        />
        <div className="w-full max-w-[100px] mt-4">
          <button
            type="submit"
            disabled={tweet.trim() === ""}
            className={`rounded-full py-2 w-full text-xl text-center transition duration-200 font-semibold
              ${
                tweet.trim() === ""
                  ? "bg-gray-400 text-gray-700"
                  : "bg-white text-black hover:bg-white/70"
              }`}
          >
            Plot
          </button>
        </div>
      </div>
    </form>
  );
}
