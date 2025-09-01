"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { followUser } from "@/app/api/actions/followUser";
import { usePathname } from "next/navigation";

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  pfp_link: string | null;
  isFollowing: boolean;
}

interface TopUsersClientProps {
  users: User[];
  currentUserId: string;
}

export default function TopUsersClient({
  users,
  currentUserId,
}: TopUsersClientProps) {
  const [followStates, setFollowStates] = useState<Record<string, boolean>>(
    users.reduce((acc, user) => ({ ...acc, [user.id]: user.isFollowing }), {})
  );
  const [isPending, startTransition] = useTransition();
  const [loadingUser, setLoadingUser] = useState<string | null>(null);

  const handleFollow = (userId: string) => {
    setLoadingUser(userId);
    startTransition(async () => {
      try {
        const result = await followUser(currentUserId, userId);

        if (result === "followed") {
          setFollowStates((prev) => ({ ...prev, [userId]: true }));
        } else if (result === "unfollowed") {
          setFollowStates((prev) => ({ ...prev, [userId]: false }));
        }
      } catch (error) {
        console.error("Error following/unfollowing user:", error);
      } finally {
        setLoadingUser(null);
      }
    });
  };

  const userPageName = usePathname().slice(1);

  users = users.filter((user) => user.username !== userPageName);

  return (
    <div className="rounded-xl border-gray-600 border-[0.5px]">
      <h3 className="text-left font-bold text-xl pt-4 pb-2 px-4">
        You might know
      </h3>
      {users.map((user) => (
        <div
          key={user.id}
          className="hover:bg-white/10 p-4 flex justify-between items-center last:rounded-b-xl transition duration-200"
        >
          <Link
            href={`/${user.username}`}
            className="flex items-center space-x-2 flex-1 group"
          >
            <div className="w-10 h-10 rounded-full flex-none">
              {user.pfp_link ? (
                <img
                  src={user.pfp_link}
                  alt={user.username || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-neutral-600 rounded-full"></div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-sm text-white group-hover:underline">
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.username}
              </div>
              <div className="text-gray-500 text-xs">@{user.username}</div>
            </div>
          </Link>

          <button
            onClick={() => handleFollow(user.id)}
            disabled={isPending && loadingUser === user.id}
            className={`rounded-full px-4 py-2 font-semibold flex items-center justify-center transition duration-200 ${
              followStates[user.id]
                ? "bg-gray-700 text-white border border-gray-600 hover:bg-gray-600"
                : "bg-white text-black hover:bg-gray-200"
            } ${
              isPending && loadingUser === user.id
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isPending && loadingUser === user.id ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : followStates[user.id] ? (
              "Following"
            ) : (
              "Follow"
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
