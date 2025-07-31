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
  const [textSize, setTextSize] = useState("text-2xl");
  const [postButtonName, setPostButtonName] = useState("Plot");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.slice(0, 5) === "/post") {
      setPlaceholder("What do you think?");
      setPaddingY("pt-1");
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
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-full">
      <TextareaAutosize
        name="tweet"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-full ${textSize} placeholder:text-gray-600 bg-transparent outline-none ${paddingX} ${paddingY}`}
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
        className={`flex justify-between items-center w-full ${borderT} ${marginT}`}
      >
        <label
          htmlFor="fileUpload"
          className={`cursor-pointer text-white mt-4 ${marginL}`}
        >
          <GoFileMedia />
        </label>
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={handleImage}
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
            {postButtonName}
          </button>
        </div>
      </div>
    </form>
  );
}
