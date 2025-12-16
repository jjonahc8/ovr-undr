import LeagueTabs from "@/components/client-components/league-tabs";
import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import { createClient } from "@/lib/supabase/server";
import InviteButton from "@/components/client-components/invite-button";

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: trendingTweets, error: trendingTweetsError } = await supabase
    .from("tweets_with_like_count")
    .select("*")
    .limit(4);

  if (trendingTweetsError) {
    console.error("Error fetching trending tweets:", trendingTweetsError);
  }

  const { data: league, error: leagueError } = await supabase
    .from("leagues")
    .select("*")
    .eq("id", id)
    .single();

  if (leagueError || !league) {
    console.error("Error fetching league:", leagueError);
    return;
  }

  const { data: managerProfile, error: managerError } = await supabase
    .from("profiles")
    .select("username,pfp_link")
    .eq("id", league.admin_id)
    .single();

  if (managerError) {
    console.error("Error fetching manager profile:", managerError);
  }

  const { data: playerOdds, error: playerOddsError } = await supabase
    .from("betting_odds")
    .select("*")
    .not("player_id", "is", null)
    .limit(5);

  if (playerOddsError) {
    console.error("Error fetching odds data", playerOddsError);
  }

  const betSlips =
    playerOdds?.map(
      ({
        home_team,
        away_team,
        player_name,
        market_key,
        price,
        point,
        player_id,
      }) => ({
        home_team,
        away_team,
        player_name,
        market_key,
        price,
        point,
        player_id,
      })
    ) ?? [];

  const avatar_link = managerProfile?.pfp_link ?? null;
  const username = managerProfile?.username ?? null;

  const { data: viewer } = await supabase.auth.getUser();
  const isAdmin = viewer?.user?.id === league.admin_id;

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar
          trendingTweets={trendingTweets}
          avatar_link={avatar_link}
          username={username}
          league={true}
        />
        <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="flex flex-row items-center mt-4 mb-2 ml-2">
            <BackButton />
            <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
              {league.name}
            </h1>
          </div>
          <div className="relative inline-block">
            <div className="w-full h-40 bg-slate-400 mt-3"></div>
            <div className="absolute left-4 bottom-0 translate-y-1/2 w-32 h-32 rounded-full bg-slate-50"></div>
          </div>
          <div className="flex flex-col pt-20 pb-4 px-4 border-b-[0.5px] border-gray-600">
            <h1 className="text-2xl font-bold">{league.name}</h1>
            <h1 className="text-sm text-gray-400">
              League Manager: {managerProfile?.username ?? "Unknown"}
            </h1>
          </div>
          {isAdmin && <InviteButton leagueId={league.id} />}

          <LeagueTabs betSlips={betSlips} />
        </main>
        <RightSection />
      </div>
    </div>
  );
}
