import LeagueTabs from "@/components/client-components/league-tabs";
import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LeaguePage() {
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
              League Name
            </h1>
          </div>
          <div className="relative inline-block">
            <div className="w-full h-40 bg-slate-400 mt-3"></div>
            <div className="absolute left-4 bottom-0 translate-y-1/2 w-32 h-32 rounded-full bg-slate-50"></div>
          </div>
          <div className="flex flex-col pt-20 pb-4 px-4 border-b-[0.5px] border-gray-600">
            <h1 className="text-2xl font-bold">League Name</h1>
            <h1 className="text-sm text-gray-400">
              League Manager: League Manager Username
            </h1>
          </div>
          <LeagueTabs />
        </main>
        <RightSection />
      </div>
    </div>
  );
}
