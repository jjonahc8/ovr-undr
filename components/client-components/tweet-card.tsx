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
import { useState, useTransition, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import generateDate from "../utilities/generateDate";
import { format } from "date-fns";

export default function TweetCard({ tweet }: { tweet: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [focused, setFocused] = useState(false);
  const pathname = usePathname();
  const date = new Date(tweet.created_at);
  const formatted_date = format(date, "MMMM d, yyyy");
  const formatted_time = format(date, "h:mm a");

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

  useEffect(() => {
    const checkIfFocusedTweet = () => {
      if (tweet.id === pathname.slice(6)) {
        setFocused(true);
      }
    };

    checkIfFocusedTweet();
  }, []);

  return !focused ? (
    <div
      className="border-b-[0.5px] border-gray-600 p-2 flex space-x-4 hover:bg-gray-950"
      onClick={() => {
        handleRedirect(`post/${tweet.id}`);
      }}
    >
      <div className="w-10 h-10 ml-2 mt-2">
        <div className="w-10 h-10 bg-slate-200 rounded-full" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center justify-between w-full mt-1">
            <div className="flex flex-row items-center">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleRedirect(tweet.author);
                }}
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
            <div className="text-gray-500 h-4 mr-3">
              <DropdownMenu>
                <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                  <BsThreeDots />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    <button disabled={isPending} className="text-red-500">
                      Delete Tweet
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="text-white text-base">{tweet.text}</div>
        {tweet.file_link && (
          <div className="mt-2 mr-3">
            <img
              src={tweet.file_link}
              alt="Attached file"
              className="w-full h-auto rounded-xl"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mr-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
            <BsChat />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
            <AiOutlineRetweet />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
            <AiOutlineHeart />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
            <IoShareOutline />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="border-gray-600 px-2 pr-4 py-2 flex">
      <div className="flex flex-col w-full ml-2 gap-y-2">
        <div className="flex flex-row items-center w-full justify-between">
          <div className="flex flex-row items-center gap-2">
            <div className="w-10 h-10">
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleRedirect(tweet.author);
              }}
              className="font-bold hover:underline cursor-pointer text-lg"
            >
              {tweet.author}
            </div>
          </div>
          <div className="text-gray-500 h-4">
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
        <div className="text-white text-lg">{tweet.text}</div>
        {tweet.file_link && (
          <div className="w-full">
            <img
              src={tweet.file_link}
              alt="Attached file"
              className="w-full h-auto rounded-xl"
            />
          </div>
        )}
        <div className="flex flex-row items-center text-gray-500 mt-2">
          <div className="text-md">{formatted_time}</div>
          <BsDot />
          <div className="text-md">{formatted_date}</div>
        </div>
        <div className="flex flex-wrap items-center justify-between w-full border-y-[0.5px] mt-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
            <BsChat className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
            <AiOutlineRetweet className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
            <AiOutlineHeart className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
            <IoShareOutline className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
