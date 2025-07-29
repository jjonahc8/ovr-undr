"use client";

import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { IoShareOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import generateDate from "../utilities/generateDate";

export default function TweetCard({ tweet }: { tweet: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    const res = await fetch(`/api/delete-tweet?id=${tweet.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      startTransition(() => {
        router.refresh();
      });
    } else {
      console.error("Failed to delete tweet");
    }
  }

  const handleRedirect = (route: string) => {
    router.push(`/${route}`);
  };

  return (
    <div className="border-b-[0.5px] border-gray-600 p-2 flex space-x-4">
      <div>
        <div className="w-10 h-10 bg-slate-200 rounded-full ml-2 mt-2" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center w-full mt-1">
            <div
              onClick={() => handleRedirect(tweet.author)}
              className="font-bold hover:underline cursor-pointer"
            >
              {tweet.author}
            </div>
            <div className="text-gray-500">
              <BsDot />
            </div>
            <div className="text-gray-500 text-sm">
              {generateDate(tweet.created_at)}
            </div>
          </div>
          <div className="text-gray-500">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <BsThreeDots />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDelete}>
                  <button disabled={isPending} className="text-red-500">
                    Delete Tweet
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="text-white text-base">{tweet.text}</div>
        {tweet.file_link && (
          <img
            className="rounded-xl mt-2 max-w-md"
            src={tweet.file_link}
            alt="Attached file"
          />
        )}
        <div className="flex items-center justify-between space-x-20 mt-2 w-full">
          <div className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
            <BsChat />
          </div>
          <div className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
            <AiOutlineRetweet />
          </div>
          <div className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
            <AiOutlineHeart />
          </div>
          <div className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
            <IoShareOutline />
          </div>
        </div>
      </div>
    </div>
  );
}
