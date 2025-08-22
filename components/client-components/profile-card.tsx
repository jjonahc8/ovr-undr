"use client";

import { useState, useTransition } from "react";
import BackButton from "../ui/back-button";
import generateDate from "../utilities/generateDate";
import EditProfileTrigger from "./edit-profile-trigger";
import { followUser } from "@/app/api/actions/followUser";
import { Button } from "../ui/button";
import FollowersModal from "./followers-modal";

export default function ProfileCard({
  submitProfileChanges,
  authProfile,
  profileUser,
  isFollowing,
  followersCount: initialFollowersCount,
  followingCount,
}: {
  submitProfileChanges: (formData: FormData) => Promise<void>;
  authProfile: any;
  profileUser: any;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}) {
  const [following, setFollowing] = useState(isFollowing);
  const [isPending, startTransition] = useTransition();
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [modalTab, setModalTab] = useState<"followers" | "following">("followers");

  const handleClick = () => {
    startTransition(async () => {
      const result = await followUser(authProfile.id, profileUser.id);
      if (result === "followed") {
        setFollowing(true);
        setFollowersCount((count) => count + 1);
      } else if (result === "unfollowed") {
        setFollowing(false);
        setFollowersCount((count) => count - 1);
      }
    });
  };

  const openFollowersModal = () => {
    setModalTab("followers");
    setShowFollowersModal(true);
  };

  const openFollowingModal = () => {
    setModalTab("following");
    setShowFollowersModal(true);
  };

  return (
    <>
      <div className="flex flex-row items-center mt-4 mb-2 ml-2">
        <BackButton />
        <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
          {profileUser.username}
        </h1>
      </div>
      <div className="relative inline-block">
        {profileUser.banner_link && (
          <img
            className="w-full h-40 mt-3"
            src={profileUser.banner_link}
            alt="profile banner"
          />
        )}
        {!profileUser.banner_link && (
          <div className="w-full h-40 bg-slate-400 mt-3"></div>
        )}
        {profileUser.pfp_link && (
          <img
            className="absolute left-4 bottom-0 translate-y-1/2 w-32 h-32 rounded-full"
            src={profileUser.pfp_link}
            alt="profile picture"
          />
        )}
        {!profileUser.pfp_link && (
          <div className="absolute left-4 bottom-0 translate-y-1/2 w-32 h-32 rounded-full bg-slate-50"></div>
        )}
      </div>
      <div className="flex justify-end mt-4 px-4">
        {authProfile.id === profileUser.id && (
          <EditProfileTrigger submitProfileChanges={submitProfileChanges} />
        )}
        {authProfile.id !== profileUser.id && (
          <Button
            onClick={handleClick}
            disabled={isPending}
            className="text-xl text-white font-semibold bg-transparent border-[0.5px] border-white hover:bg-white 
          hover:text-black transition duration-200 rounded-full"
          >
            {isPending ? "..." : following ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
      <div className="flex flex-col pt-6 px-4">
        <h1 className="text-3xl font-bold">{profileUser.username}</h1>
        <h1 className="text-sm text-gray-400">
          {profileUser.first_name} {profileUser.last_name}
        </h1>
      </div>
      <div className="pt-2 px-4">
        <p>{profileUser.bio}</p>
      </div>
      <div className="pt-2 px-4 text-gray-400">
        <p>Joined {generateDate(profileUser.created_at)}</p>
      </div>
      <div className="flex flex-row items-center py-2 px-4 border-b-[0.5px] border-gray-600">
        <button 
          onClick={openFollowersModal}
          className="flex items-center mr-4 hover:underline transition-all duration-200"
        >
          <h1 className="font-bold mr-2 text-2xl">{followersCount}</h1>
          <p className="text-gray-400">
            {followersCount === 1 ? "Follower" : "Followers"}
          </p>
        </button>
        <button 
          onClick={openFollowingModal}
          className="flex items-center hover:underline transition-all duration-200"
        >
          <h1 className="font-bold mr-2 text-2xl">{followingCount}</h1>
          <p className="text-gray-400">Following</p>
        </button>
      </div>
      
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        userId={profileUser.id}
        username={profileUser.username}
        tab={modalTab}
      />
    </>
  );
}
