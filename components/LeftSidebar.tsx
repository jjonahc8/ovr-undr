"use client";

import { BsThreeDots } from "react-icons/bs";
import { LogoutButton } from "./client-components/logout-button";
import NavigateWrapper from "./client-components/navigate";
import TrendingWindow from "./client-components/trending-window";
import { TrendingTweetView } from "./types/trendingtweets";
import Image from "next/image";
import React from "react";
import { FaArrowLeft, FaArrowRight, FaTrophy } from "react-icons/fa";

type SidebarLeague = {
  id: string;
  name: string;
};

function Avatar({ src }: { src: string }) {
  const [finalSrc, setFinalSrc] = React.useState(src);

  React.useEffect(() => {
    setFinalSrc(`${src}?v=${crypto.randomUUID()}`);
  }, [src]);

  return (
    <Image
      className="rounded-full min-w-6 w-6 min-h-6 h-6"
      src={finalSrc}
      alt="profile avatar"
      width={48}
      height={48}
    />
  );
}

export function LeftSidebar({
  avatar_link,
  username,
  create,
  league,
  trendingTweets,
  leagues,
}: {
  avatar_link: string | null;
  username: string | null;
  create?: boolean;
  league?: boolean;
  trendingTweets?: TrendingTweetView[] | null;
  leagues?: SidebarLeague[] | null;
}) {
  const safeLeagues = leagues ?? [];
  const hasLeagues = safeLeagues.length > 0;

  const [leagueIndex, setLeagueIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (safeLeagues.length === 0) {
      setLeagueIndex(0);
      return;
    }
    setLeagueIndex((i) => i % safeLeagues.length);
  }, [safeLeagues.length]);

  const currentLeague =
    safeLeagues.length > 0 ? safeLeagues[leagueIndex] : null;

  const leagueHref = currentLeague
    ? `/league/${currentLeague.id}`
    : "/league/create";

  const leagueTitle = currentLeague?.name ?? "League Name";

  const canCycle = safeLeagues.length > 1;

  const cycleLeagueRight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canCycle) return;
    setLeagueIndex((i) => (i + 1) % safeLeagues.length);
  };

  const cycleLeagueLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canCycle) return;
    setLeagueIndex((i) => (i - 1 + safeLeagues.length) % safeLeagues.length);
  };

  const NoLeaguesModule = () => (
    <div className="flex flex-col items-center space-y-3 rounded-xl p-4 border-gray-600 border-[0.5px] text-center">
      <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center">
        <FaTrophy className="text-4xl text-black/70" />
      </div>
      <h1 className="font-bold text-xl">No Leagues Yet</h1>
      <h2 className="text-sm text-gray-400">Create or Join a League Today!</h2>
    </div>
  );

  const LeagueCard = ({
    useAvatarCacheBust,
  }: {
    useAvatarCacheBust: boolean;
  }) => (
    <div className="flex flex-col items-center space-y-2 rounded-xl p-4 border-gray-600 border-[0.5px]">
      <div className="rounded-full h-24 w-24 bg-gray-400" />
      <h1 className="font-bold text-center text-2xl">{leagueTitle}</h1>

      <div className="flex flex-row items-center justify-center gap-1">
        <div className="mr-[0.5px]">
          {!avatar_link ? (
            <div className="w-6 h-6 bg-slate-400 rounded-full" />
          ) : useAvatarCacheBust ? (
            <Avatar src={avatar_link} />
          ) : (
            <Image
              className="rounded-full min-w-6 w-6 min-h-6 h-6"
              src={avatar_link}
              alt="profile avatar"
              width={48}
              height={48}
            />
          )}
        </div>
        <h2 className="font-semibold">{username}:</h2>
        <h1 className="font-bold text-xl">Xth</h1>
      </div>

      <div className="flex gap-2">
        {canCycle ? (
          <button
            type="button"
            onClick={cycleLeagueLeft}
            className="flex items-center justify-center w-10 h-10 rounded-full font-semibold border-gray-600 border-[0.5px] hover:bg-white/10 transition duration-200"
            aria-label="Prev league"
            title="Prev league"
          >
            <FaArrowLeft />
          </button>
        ) : null}

        {canCycle ? (
          <button
            type="button"
            onClick={cycleLeagueRight}
            className="flex items-center justify-center w-10 h-10 rounded-full font-semibold border-gray-600 border-[0.5px] hover:bg-white/10 transition duration-200"
            aria-label="Next league"
            title="Next league"
          >
            <FaArrowRight />
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <section className="w-[35%] sticky top-0 hidden md:flex flex-col h-screen">
      <NavigateWrapper to={"/"}>
        <div className="text-3xl font-bold rounded-xl w-fit mt-4 mr-6">
          <h1 className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            ovr/undr
          </h1>
        </div>
      </NavigateWrapper>

      <div className="flex-1 overflow-y-auto mr-6 mt-8">
        <div className="flex flex-col gap-4">
          {create ? (
            <div>
              {hasLeagues ? (
                <NavigateWrapper to={leagueHref}>
                  <LeagueCard useAvatarCacheBust />
                </NavigateWrapper>
              ) : (
                <NoLeaguesModule />
              )}
            </div>
          ) : league ? (
            <NavigateWrapper to={"/league/create"}>
              <div className="flex flex-col space-y-4 rounded-xl p-4 border-gray-600 border-[0.5px]">
                <h1 className="font-bold text-xl">Create a Fantasy League</h1>
                <h2 className="text-sm">
                  Start picking in a new high-paced fantasy environment with
                  less scheduling, and more drafting!
                </h2>
                <button className="w-20 h-10 rounded-full font-semibold border-gray-600 border-[0.5px] hover:bg-white/10 transition duration-200">
                  Create
                </button>
              </div>
            </NavigateWrapper>
          ) : (
            <NavigateWrapper to={"/league/create"}>
              <div className="flex flex-col space-y-4 rounded-xl p-4 border-gray-600 border-[0.5px]">
                <h1 className="font-bold text-xl">Create a Fantasy League</h1>
                <h2 className="text-sm">
                  Start picking in a new high-paced fantasy environment with
                  less scheduling, and more drafting!
                </h2>
                <button className="w-20 h-10 rounded-full font-semibold border-gray-600 border-[0.5px] hover:bg-white/10 transition duration-200">
                  Create
                </button>
              </div>
            </NavigateWrapper>
          )}

          {create || league ? (
            <TrendingWindow trendingTweets={trendingTweets} />
          ) : !hasLeagues ? (
            <NoLeaguesModule />
          ) : (
            <NavigateWrapper to={leagueHref}>
              <LeagueCard useAvatarCacheBust={false} />
            </NavigateWrapper>
          )}
        </div>
      </div>

      <NavigateWrapper to={`/${username ?? ""}`}>
        <div
          className="rounded-xl flex items-center space-x-2 bg-transparent p-4 mr-6 text-center 
                     hover:bg-white/10 transition duration-200 justify-between"
        >
          <div className="flex items-center w-full justify-between">
            <div className="flex flex-row items-center space-x-2 rounded-full w-10 h-10">
              {!avatar_link ? (
                <div className="w-10 h-10 bg-slate-400 rounded-full" />
              ) : (
                <Image
                  className="rounded-full min-w-10 w-10 min-h-10 h-10"
                  src={avatar_link}
                  alt="profile avatar"
                  width={48}
                  height={48}
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
    </section>
  );
}

export default LeftSidebar;
