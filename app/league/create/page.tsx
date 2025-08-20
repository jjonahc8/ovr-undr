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

  const oddsKey = process.env.ODDS_API_KEY;

  if (!oddsKey) return <div>API key not set</div>;

  const eventsRes = await fetch(
    `https://api.the-odds-api.com/v4/sports/americanfootball_nfl_preseason/events?apiKey=${oddsKey}&dateFormat=iso&commenceTimeFrom=2025-08-20T00%3A00%3A00Z&commenceTimeTo=2025-09-20T00%3A00%3A00Z`,
    { next: { revalidate: 60 } }
  );

  if (!eventsRes.ok)
    return (
      <div>
        Error: {eventsRes.status} {eventsRes.statusText}
      </div>
    );

  let eventsData: any[] = await eventsRes.json();

  const focusEventID = "c450d95036ea8ed06024763891d13889";

  eventsData = eventsData.filter((event) => event.id === focusEventID)[0];

  const oddsRes = await fetch(
    `https://api.the-odds-api.com/v4/sports/americanfootball_nfl_preseason/events/${focusEventID}/odds?apiKey=${oddsKey}&regions=us&dateFormat=iso&oddsFormat=american&includeLinks=true&includeSids=true&includeBetLimits=true`,
    { next: { revalidate: 600 } }
  );

  const oddsHeaders = Object.fromEntries(oddsRes.headers.entries());

  let oddsData: any[] = await oddsRes.json();

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
          <h1 className="text-xl font-bold underline text-center">
            Response Headers
          </h1>
          <pre>{JSON.stringify(oddsHeaders, null, 2)}</pre>
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
            <pre>{JSON.stringify(eventsData, null, 2)}</pre>
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
            <pre>{JSON.stringify(oddsData, null, 2)}</pre>
          </div>
        </main>
        <RightSection />
      </div>
    </div>
  );
}
