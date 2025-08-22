"use client";

import { useEffect, useState } from "react";
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
  const [parent, setParent] = useState<string | null>(null);

  const [placeholder, setPlaceholder] = useState("What's the play?");
  const [paddingY, setPaddingY] = useState("py-4");
  const [borderT, setBorderT] = useState("border-t-[0.5px] border-gray-600");
  const [marginT, setMarginT] = useState("mt-6");
  const [marginL, setMarginL] = useState("ml-5");
  const [paddingX, setPaddingX] = useState("px-4");
  const [textSize, setTextSize] = useState("text-xl");
  const [postButtonName, setPostButtonName] = useState("Plot");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.slice(0, 5) === "/post") {
      setPlaceholder("What do you think?");
      setPaddingY("pt-0");
      setBorderT("");
      setMarginT("mt-2");
      setMarginL("ml-2");
      setPaddingX("px-2");
      setTextSize("text-xl");
      setPostButtonName("Reply");
      setParent(pathname.slice(6));
    }
  }, [pathname]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("tweet", tweet);
    if (image) formData.append("file", image);
    if (parent) formData.append("parent", parent);

    submitTweet(formData);
    setTweet("");
    setImage(null);
    setImagePreviewUrl(null);
    setParent(null);
    router.refresh();
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <TextareaAutosize
        name="tweet"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder={placeholder}
        className={`w-full resize-none ${textSize} placeholder:text-gray-500 bg-transparent outline-none border-none ${paddingY === "pt-0" ? "pt-1" : "pt-3"} pb-2 px-0 leading-relaxed`}
        maxLength={280}
      />
      {imagePreviewUrl && (
        <div className="relative w-full max-w-md mb-3">
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setImagePreviewUrl(null);
            }}
            className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-full h-8 w-8 text-white text-lg hover:bg-opacity-90 flex items-center justify-center"
          >
            ×
          </button>
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className="rounded-2xl w-full border border-gray-700"
          />
        </div>
      )}
      
      <div className="flex justify-between items-center pt-3 -ml-2">
        <div className="flex items-center gap-4">
          <label
            htmlFor="fileUpload"
            className="cursor-pointer text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-400/10 rounded-full"
          >
            <GoFileMedia size={20} />
          </label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            accept="image/*"
            onChange={handleImage}
          />
          
          <div className="text-sm text-gray-500">
            {280 - tweet.length} characters remaining
          </div>
        </div>
        
        <button
          type="submit"
          disabled={tweet.trim() === ""}
          className={`rounded-full px-6 py-2 text-sm font-bold transition duration-200 min-w-[80px] ${
            tweet.trim() === ""
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {postButtonName}
        </button>
      </div>
    </form>
  );
}
