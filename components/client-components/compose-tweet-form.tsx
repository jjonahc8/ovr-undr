"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

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

  if (pathname.slice(0, 5) === "/post") {
    var placeholder = "What do you think?";
    var padding_y = "pt-1";
    var border_t = "";
    var margin_t = "mt-2";
    var margin_l = "ml-2";
    var padding_x = "px-2";
    var text_size = "text-xl";
    var post_button_name = "Reply";
  } else {
    var placeholder = "What's the play?";
    var padding_y = "py-4";
    var border_t = "border-t-[0.5px] border-gray-600";
    var margin_t = "mt-6";
    var margin_l = "ml-5";
    var padding_x = "px-4";
    var text_size = "text-2xl";
    var post_button_name = "Plot";
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-full">
      <TextareaAutosize
        name="tweet"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-full ${text_size} placeholder:text-gray-600 bg-transparent outline-none ${padding_x} ${padding_y}`}
        maxLength={280}
      />
      {imagePreviewUrl && (
        <div className="relative w-full max-w-md mr-auto">
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setImagePreviewUrl(null);
            }}
            className="absolute top-6 right-2 bg-black bg-opacity-70 rounded-full h-8 w-8 text-white text-2xl hover:bg-opacity-60"
          >
            &times;
          </button>
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className="rounded-xl w-full mt-4"
          />
        </div>
      )}

      <div
        className={`flex justify-between items-center w-full ${border_t} ${margin_t}`}
      >
        <label
          htmlFor="fileUpload"
          className={`cursor-pointer text-white mt-4 ${margin_l}`}
        >
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
            {post_button_name}
          </button>
        </div>
      </div>
    </form>
  );
}
