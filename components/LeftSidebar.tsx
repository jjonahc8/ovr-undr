"use client";

import { BsThreeDots } from "react-icons/bs";
import { LogoutButton } from "./client-components/logout-button";
import NavigateWrapper from "./client-components/navigate";

export function LeftSidebar({
  avatar_link,
  username,
}: {
  avatar_link: string | null;
  username: string | null;
}) {
  return (
    <section className="w-[35%] sticky top-0 flex flex-col items-stretch h-screen">
      <div className="flex flex-col justify-between h-full mt-2 mr-6">
        <div className="flex flex-col">
          <NavigateWrapper to={"/"}>
            <div className="text-3xl font-bold rounded-xl w-fit p-2">
              <h1>Ovr/Undr</h1>
            </div>
          </NavigateWrapper>
          <div className="flex flex-col mt-6 gap-4">
            <NavigateWrapper to={"/league/create"}>
              <div className="flex flex-col space-y-4 rounded-xl p-4 border-gray-600 border-[0.5px]">
                <div className="flex flex-row">
                  <h1 className="font-bold text-xl">Create a Fantasy League</h1>
                </div>
                <div className="flex flex-row">
                  <h2 className="text-sm">
                    Start picking in a new high-paced fantasy environment with
                    less scheduling, and more drafting!
                  </h2>
                </div>
                <div>
                  <div>
                    <button className="w-20 h-10 rounded-full font-semibold border-gray-600 border-[0.5px]">
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </NavigateWrapper>
            <NavigateWrapper to={"/league/CHANGETHISTOLEAGUEID"}>
              <div className="flex flex-col items-center space-y-2 rounded-xl p-4 border-gray-600 border-[0.5px]">
                <div className="rounded-full h-24 w-24 bg-gray-400" />
                <div className="flex flex-row justify-center">
                  <h1 className="font-bold text-center text-2xl">
                    League Name
                  </h1>
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                  <div className="mr-[0.5px]">
                    {!avatar_link && (
                      <div className="w-6 h-6 bg-slate-400 rounded-full" />
                    )}
                    {avatar_link && (
                      <img
                        className="rounded-full min-w-6 w-6 min-h-6 h-6"
                        src={avatar_link}
                      />
                    )}
                  </div>

                  <h2 className="font-semibold">{username}:</h2>
                  <h1 className="font-bold text-xl">Xth</h1>
                </div>
                <button className="w-32 h-10 rounded-full font-semibold border-gray-600 border-[0.5px]">
                  Leaderboard
                </button>
              </div>
            </NavigateWrapper>
          </div>
        </div>
        <NavigateWrapper to={`/${username}`}>
          <div
            className="rounded-full flex items-center space-x-2 bg-transparent p-4 text-center 
      hover:bg-white/10 transition duration-200 w-full justify-between"
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex flex-row items-center space-x-2 rounded-full w-10 h-10">
                {!avatar_link && (
                  <div className="w-10 h-10 bg-slate-400 rounded-full" />
                )}
                {avatar_link && (
                  <img
                    className="rounded-full min-w-10 w-10 min-h-10 h-10"
                    src={avatar_link}
                  />
                )}
                <div className="text-left text-sm">{username}</div>
              </div>
              <div className="flex items-center gap-2">
                <LogoutButton />
                <BsThreeDots />
              </div>
            </div>
          </div>
        </NavigateWrapper>
      </div>
    </section>
  );
}

export default LeftSidebar;
