import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import ComposeTweet from "@/components/server-components/compose-tweet";
import MainFeedTimeline from "@/components/server-components/main-feed";
import TopUsers from "@/components/server-components/top-users";
import ScrollableHeader from "@/components/client-components/scrollable-header";
import { Suspense } from "react";
import Image from "next/image";

type SidebarLeague = {
  id: string;
  name: string;
};

export default async function ProtectedPage() {
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
    redirect("/auth/login");
  }

  const avatar_link = authProfileData.pfp_link ?? null;
  const username = authProfileData.username ?? null;

  const { data: authLeagues, error: authLeaguesErrors } = await supabase
    .from("league_members")
    .select("league_id")
    .eq("player_id", userId);

  if (authLeaguesErrors) {
    console.error("Error fetching auth leagues:", authLeaguesErrors);
  }

  let leaguesForSidebar: SidebarLeague[] = [];

  const leagueIds =
    authLeagues
      ?.map((m) => m.league_id)
      .filter((id): id is string => typeof id === "string") ?? [];

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

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar
          avatar_link={avatar_link}
          username={username}
          leagues={leaguesForSidebar}
        />

        <main className="sticky top-0 flex w-[100%] md:w-[65%] xl:w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <ScrollableHeader />

          <div className="border-t-[0.5px] border-b-[0.5px] border-gray-600">
            <div className="px-4 py-4 flex items-start gap-3">
              <div className="w-12 h-12 rounded-full flex-none">
                {!avatar_link ? (
                  <div className="w-12 h-12 bg-slate-400 rounded-full" />
                ) : (
                  <Image
                    className="w-12 h-12 rounded-full"
                    src={avatar_link}
                    alt="profile avatar"
                    width={48}
                    height={48}
                  />
                )}
              </div>

              <div className="flex-1">
                <ComposeTweet />
              </div>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
              </div>
            }
          >
            <MainFeedTimeline userId={userId} />
          </Suspense>
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
              <TopUsers currentUserId={userId} />
            </Suspense>
          }
        />
      </div>
    </div>
  );
}
