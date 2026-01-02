import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LeagueInput from "@/components/client-components/league-name-input";
import { Suspense } from "react";
import TopUsers from "@/components/server-components/top-users";

type SidebarLeague = {
  id: string;
  name: string;
};

export default async function CreatePage() {
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

  const avatar_link = authProfileData.pfp_link ?? null;
  const username = authProfileData.username ?? null;

  const { data: trendingTweets, error: trendingTweetsError } = await supabase
    .from("tweets_with_like_count")
    .select("*")
    .limit(4);
  if (trendingTweetsError)
    console.error("Error fetching trending tweets:", trendingTweetsError);

  const { data: authLeagues, error: authLeaguesErrors } = await supabase
    .from("league_members")
    .select("league_id")
    .eq("player_id", userId ?? "");

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

    return (
      <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
        <div className="max-w-[80vw] w-full h-full flex relative justify-center">
          <LeftSidebar
            trendingTweets={trendingTweets}
            avatar_link={avatar_link}
            username={username}
            leagues={leaguesForSidebar}
            create={true}
          />
          <main className="sticky top-0 flex w-[90%] md:w-[55%] xl:w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
            <div className="flex flex-row items-center mt-4 mb-2 ml-2">
              <BackButton />
              <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
                Create a League
              </h1>
            </div>
            <div className="flex flex-col mt-10">
              <LeagueInput />
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
                <TopUsers currentUserId={authProfileData.id} />
              </Suspense>
            }
          />
        </div>
      </div>
    );
  }
}
