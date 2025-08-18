import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  const apiKey = process.env.SPORTSDATA_API_KEY;
  const apiKey2 = process.env.SPORTSDATA_API_KEY2;

  if (!apiKey) return <div>API key not set</div>;

  const eventsRes = await fetch(
    `https://replay.sportsdata.io/api/v3/nfl/odds/json/bettingevents/2023reg?key=${apiKey}`,
    { next: { revalidate: 60 } }
  );

  if (!eventsRes.ok)
    return (
      <div>
        Error: {eventsRes.status} {eventsRes.statusText}
      </div>
    );

  let eventsData: any[] = await eventsRes.json();

  const games = eventsData
    .filter((item) => item.BettingEventType === "Game")
    .map((item) => {
      const [away, home] = item.Name.split(" @ ");
      return {
        id: item.ScoreID,
        home,
        away,
        date: item.StartDate,
      };
    })
    .filter((item) => item.home === "Pittsburgh Steelers" && item.id === 18541);

  const pickRes = await fetch(
    `http://archive.sportsdata.io/v3/nfl/odds/json/bettingplayerpropsbyscoreid/${games[0].id}/2023-12-07-03-05.json?key=${apiKey2}`,
    { next: { revalidate: 60 } }
  );

  if (!pickRes.ok)
    return (
      <div>
        Error: {pickRes.status} {pickRes.statusText}
      </div>
    );

  let pickData: any[] = await pickRes.json();

  const playerProps = pickData
    .map((item) => {
      const draftKingsPicks = item.BettingOutcomes.filter(
        (pick: any) => pick.SportsBook.Name === "DraftKings"
      ).map((prop: any) => ({
        bet: prop.BettingOutcomeType,
        value: prop.Value,
        payout: prop.PayoutAmerican,
      }));

      return {
        name: item.PlayerName,
        type: item.BettingBetType,
        available: item.AnyBetsAvailable,
        picks: draftKingsPicks,
      };
    })
    .filter((pick) => pick.picks.length === 2);

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar
          trendingTweets={trendingTweets}
          avatar_link={avatar_link}
          username={username}
          create={true}
        />
        <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="flex flex-row items-center mt-4 mb-2 ml-2">
            <BackButton />
            <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
              Create a League
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-center text-2xl font-bold">
              OvrUndr SportsDataIO MVP Use Case
            </h1>
            <h1 className="text-center font-semibold mb-4">
              Resulting via box score or prop plus*
            </h1>
            <h1 className="text-center text-xl font-bold underline">
              Betting Events by Season Output
            </h1>
            <h1 className="text-center font-semibold">
              (1 API call per season)
            </h1>
            <pre>{JSON.stringify(games, null, 2)}</pre>
            <h1 className="text-center text-xl font-bold underline">
              Player Props by Score ID Output
            </h1>
            <h1 className="text-center font-semibold">
              (Worst case 51 API calls per league per season)
            </h1>
            <h1 className="text-center">
              Each call 12-24 hrs before game time to allow users to make
              selections
            </h1>
            <pre>{JSON.stringify(playerProps, null, 2)}</pre>
          </div>
        </main>
        <RightSection />
      </div>
    </div>
  );
}
