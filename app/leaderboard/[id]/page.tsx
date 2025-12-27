import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import TopUsers from "@/components/server-components/top-users";
import BackButton from "@/components/ui/back-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type SidebarLeague = {
  id: string;
  name: string;
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const { data: authClaims, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !authClaims?.claims) redirect("/auth/login");

  const userId = authClaims.claims.sub;

  const { data: authProfileData, error: authProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (authProfileError || !authProfileData) {
    console.error("Error fetching profile:", authProfileError);
    return;
  }

  const { data: trendingTweets, error: trendingTweetsError } = await supabase
    .from("tweets_with_like_count")
    .select("*")
    .limit(4);

  if (trendingTweetsError) {
    console.error("Error fetching trending tweets:", trendingTweetsError);
  }

  const avatar_link = authProfileData.pfp_link ?? null;
  const username = authProfileData.username ?? null;

  const { data: authLeagues, error: authLeaguesErrors } = await supabase
    .from("league_members")
    .select("league_id")
    .eq("player_id", authProfileData.id ?? "");

  if (authLeaguesErrors) {
    console.error("Error fetching auth leagues:", authLeaguesErrors);
  }

  let leaguesForSidebar: SidebarLeague[] = [];

  if (authLeagues && authLeagues.length !== 0) {
    const leagueIds = authLeagues
      .map((m) => m.league_id)
      .filter((id): id is string => typeof id === "string");

    if (leagueIds.length > 0) {
      const { data: leaguesData, error: leaguesError } = await supabase
        .from("leagues")
        .select("id,name")
        .in("id", leagueIds);

      if (leaguesError) {
        console.error("Error fetching leagues:", leaguesError);
      } else {
        leaguesForSidebar =
          leaguesData?.map((l) => ({ id: l.id, name: l.name })) ?? [];
      }
    }
  }

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar
          avatar_link={avatar_link}
          username={username}
          leagues={leaguesForSidebar}
        />
        <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="flex flex-row items-center mt-4 mb-4 ml-2">
            <BackButton />
            <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
              🏆 Global Leaderboard
            </h1>
          </div>

          <div className="px-4">
            <div className="flex flex-col rounded-xl border-gray-600 border-[0.5px]">
              <div className="flex flex-col gap-3 px-4 py-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🥇</span>
                    <div className="w-10 h-10 bg-slate-400 rounded-full" />
                    <div>
                      <p className="font-semibold">Alice</p>
                      <p className="text-xs text-gray-400">3 leagues</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">540 pts</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🥈</span>
                    <div className="w-10 h-10 bg-slate-400 rounded-full" />
                    <div>
                      <p className="font-semibold">Bob</p>
                      <p className="text-xs text-gray-400">2 leagues</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">410 pts</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🥉</span>
                    <div className="w-10 h-10 bg-slate-400 rounded-full" />
                    <div>
                      <p className="font-semibold">Charlie</p>
                      <p className="text-xs text-gray-400">4 leagues</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">390 pts</span>
                </div>

                <div className="border-t border-gray-600 pt-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-6 text-center">
                        4
                      </span>
                      <div className="w-10 h-10 bg-slate-400 rounded-full" />
                      <div>
                        <p className="font-semibold">David</p>
                        <p className="text-xs text-gray-400">1 league</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">310 pts</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-6 text-center">
                        5
                      </span>
                      <div className="w-10 h-10 bg-slate-400 rounded-full" />
                      <div>
                        <p className="font-semibold">Eve</p>
                        <p className="text-xs text-gray-400">2 leagues</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">280 pts</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-6 text-center">
                        6
                      </span>
                      <div className="w-10 h-10 bg-slate-400 rounded-full" />
                      <div>
                        <p className="font-semibold">Frank</p>
                        <p className="text-xs text-gray-400">1 league</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">250 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <RightSection
          topUsersComponent={
            <Suspense
              fallback={
                <div className="rounded-xl border-gray-600 border-[0.5px]">
                  <h3 className="text-left font-bold text-xl pt-4 pb-2 px-4">
                    You might know
                  </h3>
                  <div className="p-4 text-center text-gray-500">
                    Loading...
                  </div>
                </div>
              }
            >
              <TopUsers currentUserId={userId ?? ""} />
            </Suspense>
          }
        />
      </div>
    </div>
  );
}
