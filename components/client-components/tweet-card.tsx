"use client";

import { useState, useTransition, useEffect } from "react";
import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { IoShareOutline } from "react-icons/io5";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import generateDate from "../utilities/generateDate";
import NavigateWrapper from "./navigate";
import { ClientLike } from "../types/clientlikes";
import { TweetAuthorParentView } from "../types/tweetsauthorsparents";
import { ParentTweet, Tweet } from "../types/tweet";
import Image from "next/image";

export default function TweetCard({
  tweet,
  parent,
  window,
  tweetsAuthorsParents,
  clientLikes,
  likeMap,
  commentCountMap,
  currentUserId,
}: {
  tweet: Tweet | ParentTweet;
  parent?: ParentTweet;
  window?: boolean;
  tweetsAuthorsParents: TweetAuthorParentView[] | null;
  clientLikes?: ClientLike[] | null;
  likeMap?: Map<string, number>;
  commentCountMap?: Map<string, number>;
  currentUserId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [focused, setFocused] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const pathname = usePathname();
  const date = tweet.created_at ? new Date(tweet.created_at) : new Date();
  const formatted_date = format(date, "MMMM d, yyyy");
  const formatted_time = format(date, "h:mm a");
  const [likeCount, setLikeCount] = useState(
    tweet.id ? likeMap?.get(tweet.id) : undefined
  );
  const commentCount = tweet.id ? commentCountMap?.get(tweet.id) : undefined;

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this tweet? This action cannot be undone."
      )
    ) {
      return;
    }

    const res = await fetch(`/api/delete-tweet?id=${tweet.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      startTransition(() => {
        router.refresh();
      });
    } else {
      const error = await res.json();
      console.error("Failed to delete tweet:", error);
      alert(error.error || "Failed to delete tweet");
    }
  }

  const toggleLike = async (tweetId: string) => {
    if (!liked) {
      setLikeCount((likeCount ?? 0) + 1);
      setLiked(true);
    } else {
      setLikeCount((likeCount ?? 0) - 1);
      setLiked(false);
    }

    const res = await fetch(`/api/like-tweet?id=${tweetId}`, {
      method: "POST",
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Error toggling like:", data.error);
    }
  };

  const handleRedirect = (route: string) => {
    router.push(`/${route}`);
  };

  const isFocusedTweet = tweet.id === pathname.slice(6);

  const parentData = parent ? (
    <TweetCard
      tweet={parent}
      window={true}
      tweetsAuthorsParents={tweetsAuthorsParents}
    />
  ) : null;
  const topBorder = !window ? "border-b-[0.5px] border-gray-600" : "";
  const avatarSize = !window
    ? "min-w-10 w-10 min-h-10 h-10"
    : "min-w-5 w-5 min-h-5 h-5";
  const spaceX =
    !window && !(pathname.slice(0, 5) === "/post") ? "space-x-4" : "space-x-2";
  const hover = !window ? "hover:bg-gray-950" : "";

  const avatarMap = new Map();

  tweetsAuthorsParents?.forEach((tAP) => {
    avatarMap.set(tAP.user_id, tAP.author_pfp_link);

    if (tAP.parent_user_id && tAP.parent_author_pfp_link) {
      avatarMap.set(tAP.parent_user_id, tAP.parent_author_pfp_link);
    }
  });

  useEffect(() => {
    if (isFocusedTweet) {
      setFocused(true);
    }
    if (clientLikes?.some((like) => like.tweet_id === tweet.id)) {
      setLiked(true);
    }
  }, [pathname, isFocusedTweet, tweet.id, clientLikes]);

  return !focused ? (
    <div
      className={`${topBorder} p-2 flex ${spaceX} ${hover}`}
      onClick={() => {
        handleRedirect(`post/${tweet.id}`);
      }}
    >
      <div className={`${avatarSize} ml-2 mt-2`}>
        <NavigateWrapper to={`/${tweet.author}`} stopPropagation={true}>
          {!avatarMap.get(tweet.user_id) && (
            <div className={`${avatarSize} bg-slate-200 rounded-full`} />
          )}
          {avatarMap.get(tweet.user_id) && (
            <Image
              className={`${avatarSize} rounded-full`}
              src={avatarMap.get(tweet.user_id)}
              alt="avatar"
              height={48}
              width={48}
            />
          )}
        </NavigateWrapper>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center justify-between w-full mt-1">
            <div className="flex flex-row items-center">
              <div className="font-bold hover:underline cursor-pointer">
                <NavigateWrapper to={`/${tweet.author}`} stopPropagation={true}>
                  {tweet.author}
                </NavigateWrapper>
              </div>
              <div className="text-gray-500">
                <BsDot />
              </div>
              <div className="text-gray-500 text-sm">
                {generateDate(tweet.created_at)}
              </div>
            </div>
            {!window && currentUserId === tweet.user_id && (
              <div className="text-gray-500 h-4 mr-2">
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
            )}
          </div>
        </div>
        <div className="text-white text-base">{tweet.text}</div>
        {parent && (
          <div
            className="border-[0.5px] border-gray-600 rounded-xl mt-2 mr-3 pb-2 hover:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {parentData}
          </div>
        )}
        {tweet.file_link && (
          <div className="mt-2 mr-3">
            <Image
              src={tweet.file_link}
              alt="Attached file"
              className="w-full h-auto rounded-xl"
              height={1920}
              width={1080}
            />
          </div>
        )}

        {!window && (
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2 w-full">
            <div
              className={`flex flex-row items-center justify-center cursor-pointer group text-gray-500`}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full transition duration-200 group-hover:bg-white/10">
                <BsChat className="w-5 h-5 transition-colors duration-200 group-hover:text-white" />
              </div>
              <div className="text-sm transition-colors duration-200 group-hover:text-white">
                {commentCount}
              </div>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (tweet.id) {
                  toggleLike(tweet.id);
                }
              }}
              className={`flex flex-row items-center justify-center cursor-pointer group ${
                liked ? "text-red-500 fill-red-500" : "text-gray-500"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full transition duration-200 group-hover:bg-white/10">
                <AiOutlineHeart className="w-5 h-5 transition-colors duration-200 group-hover:text-red-500" />
              </div>
              {likeCount !== 0 && (
                <div className="text-sm transition-colors duration-200 group-hover:text-red-500">
                  {likeCount}
                </div>
              )}
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
              <IoShareOutline />
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="border-gray-600 px-2 pr-4 py-2 flex">
      <div className="flex flex-col w-full ml-2 gap-y-2">
        <div className="flex flex-row items-center w-full justify-between">
          <div className="flex flex-row items-center gap-2">
            <div className="w-10 h-10 rounded-full">
              <NavigateWrapper to={`/${tweet.author}`} stopPropagation={true}>
                {!avatarMap.get(tweet.user_id) && (
                  <div className="min-w-10 w-10 min-h-10 h-10 bg-slate-400 rounded-full" />
                )}
                {avatarMap.get(tweet.user_id) && (
                  <Image
                    className="min-w-10 w-10 min-h-10 h-10 rounded-full"
                    src={avatarMap.get(tweet.user_id)}
                    alt="avatar"
                    height={48}
                    width={48}
                  />
                )}
              </NavigateWrapper>
            </div>
            <div className="font-bold hover:underline cursor-pointer text-lg">
              <NavigateWrapper to={`/${tweet.author}`} stopPropagation={true}>
                {tweet.author}
              </NavigateWrapper>
            </div>
          </div>
          {currentUserId === tweet.user_id && (
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
          )}
        </div>
        <div className="text-white text-lg">{tweet.text}</div>
        {parent && (
          <div
            className="border-[0.5px] border-gray-600 rounded-xl mt-2 pb-2 hover:bg-gray-950"
            onClick={(e) => e.stopPropagation()}
          >
            {parentData}
          </div>
        )}
        {tweet.file_link && (
          <div className="w-full">
            <Image
              src={tweet.file_link}
              alt="Attached file"
              className="w-full h-auto rounded-xl"
              height={1920}
              width={1080}
            />
          </div>
        )}
        <div className="flex flex-row items-center text-gray-500 mt-2">
          <div className="text-md">{formatted_time}</div>
          <BsDot />
          <div className="text-md">{formatted_date}</div>
        </div>
        <div className="flex flex-wrap items-center justify-between w-full border-y-[0.5px] mt-2">
          <div
            className={`flex flex-row items-center justify-center cursor-pointer group text-gray-500`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full transition duration-200 group-hover:bg-white/10">
              <BsChat className="w-5 h-5 transition-colors duration-200 group-hover:text-white" />
            </div>
            {commentCount !== 0 && (
              <div className="text-sm transition-colors duration-200 group-hover:text-white">
                {commentCount}
              </div>
            )}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (tweet.id) {
                toggleLike(tweet.id);
              }
            }}
            className={`flex flex-row items-center justify-center cursor-pointer group ${
              liked ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full transition duration-200 group-hover:bg-white/10">
              <AiOutlineHeart className="w-5 h-5 transition-colors duration-200 group-hover:text-red-500" />
            </div>
            {likeCount !== 0 && (
              <div className="text-sm transition-colors duration-200 group-hover:text-red-500">
                {likeCount}
              </div>
            )}
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
            <IoShareOutline className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
