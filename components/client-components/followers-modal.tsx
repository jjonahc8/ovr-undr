"use client";

import { useState, useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "../types/user";

export default function FollowersModal({
  isOpen,
  onClose,
  userId,
  username,
  tab: initialTab,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  tab: "followers" | "following";
}) {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    initialTab
  );
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const initializeData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);

        // fetch who the logged-in user is following
        const { data: followData } = await supabase
          .from("follows")
          .select("followee_id")
          .eq("follower_id", user.id);

        if (followData) {
          setFollowingSet(new Set(followData.map((f) => f.followee_id)));
        }
      }

      // Fetch followers or following data
      setLoading(true);
      setError(null);

      try {
        if (activeTab === "followers") {
          const { data: followData, error: followError } = await supabase
            .from("follows")
            .select("follower_id")
            .eq("followee_id", userId);

          if (followError) throw followError;

          if (followData?.length) {
            const followerIds = followData.map((f) => f.follower_id);

            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("id, username, first_name, last_name, pfp_link")
              .in("id", followerIds);

            if (profileError) throw profileError;

            setFollowers(profileData || []);
          } else {
            setFollowers([]);
          }
        } else {
          const { data: followData, error: followError } = await supabase
            .from("follows")
            .select("followee_id")
            .eq("follower_id", userId);

          if (followError) throw followError;

          if (followData?.length) {
            const followingIds = followData.map((f) => f.followee_id);

            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("id, username, first_name, last_name, pfp_link")
              .in("id", followingIds);

            if (profileError) throw profileError;

            setFollowing(profileData || []);
          } else {
            setFollowing([]);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      initializeData();
    }
  }, [isOpen, activeTab, userId, supabase]);

  const handleFollow = (targetUserId: string) => {
    if (!currentUserId) return;

    setLoadingUser(targetUserId);

    startTransition(async () => {
      const isFollowing = followingSet.has(targetUserId);

      try {
        if (isFollowing) {
          // Unfollow
          await supabase
            .from("follows")
            .delete()
            .eq("follower_id", currentUserId)
            .eq("followee_id", targetUserId);

          setFollowingSet((prev) => {
            const newSet = new Set(prev);
            newSet.delete(targetUserId);
            return newSet;
          });
        } else {
          // Follow
          await supabase.from("follows").insert([
            {
              follower_id: currentUserId,
              followee_id: targetUserId,
            },
          ]);

          setFollowingSet((prev) => new Set(prev).add(targetUserId));
        }
      } catch (err) {
        console.error("Follow toggle error:", err);
      } finally {
        setLoadingUser(null);
      }
    });
  };

  if (!isOpen) return null;

  const currentData = activeTab === "followers" ? followers : following;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black border border-gray-600 rounded-xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white">@{username}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-600">
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
              activeTab === "followers"
                ? "text-white border-b-2 border-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
              activeTab === "following"
                ? "text-white border-b-2 border-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Following
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          ) : currentData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No {activeTab} yet
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {currentData.map((user) => (
                <div
                  key={user.id}
                  onClick={() => router.push(`/${user.username}`)}
                  className="flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 min-w-10 min-h-10 rounded-full flex-none">
                      {user.pfp_link ? (
                        <Image
                          src={user.pfp_link}
                          alt={user.username}
                          className="w-10 h-10 min-w-10 min-h-10 rounded-full"
                          height={48}
                          width={48}
                        />
                      ) : (
                        <div className="w-10 h-10 min-w-10 min-h-10 bg-gray-600 rounded-full" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold text-white text-sm">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.username}
                      </div>
                      <div className="text-gray-400 text-xs">
                        @{user.username}
                      </div>
                    </div>
                  </div>

                  {user.id !== currentUserId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(user.id);
                      }}
                      disabled={isPending && loadingUser === user.id}
                      className={`rounded-full px-4 py-1 font-semibold text-sm flex items-center justify-center transition-colors ${
                        followingSet.has(user.id)
                          ? "bg-black text-white border border-gray-400 hover:bg-gray-800"
                          : "bg-white text-black hover:bg-gray-200"
                      } ${
                        isPending && loadingUser === user.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isPending && loadingUser === user.id ? (
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      ) : followingSet.has(user.id) ? (
                        "Unfollow"
                      ) : (
                        "Follow"
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
