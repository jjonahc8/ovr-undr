"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ComposeTweetForm({
  submitTweet,
}: {
  submitTweet: (formData: FormData) => void;
}) {
  const [tweet, setTweet] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("tweet", tweet);

    submitTweet(formData);
    setTweet("");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-full">
      <input
        type="text"
        name="tweet"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="What's the plot?"
        className="w-full h-full text-2xl placeholder:text-gray-600 bg-transparent border-b-[0.5px] border-gray-600 p-4 
          outline-none border-none"
      />
      <div className="w-full justify-between items-center flex">
        <div></div>
        <div className="w-full max-w-[100px]">
          <button
            type="submit"
            disabled={tweet.trim() === ""}
            className={`rounded-full px-4 py-2 w-full text-lg text-center transition duration-200 font-semibold
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
