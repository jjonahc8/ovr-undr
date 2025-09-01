import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar avatar_link={avatar_link} username={username} />
        <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="flex flex-row items-center mt-4 mb-2 ml-2">
            <BackButton />
            <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
              Global Leaderboard
            </h1>
          </div>

          {/* Global leaderboard table */}
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-600 rounded-lg">
                <thead>
                  <tr className="bg-gray-800 text-left">
                    <th className="px-4 py-2 border-b border-gray-600">Rank</th>
                    <th className="px-4 py-2 border-b border-gray-600">
                      Player
                    </th>
                    <th className="px-4 py-2 border-b border-gray-600">
                      Leagues
                    </th>
                    <th className="px-4 py-2 border-b border-gray-600">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example static rows, replace with Supabase data */}
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-700">1</td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      Alice
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">3</td>
                    <td className="px-4 py-2 border-b border-gray-700">540</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-700">2</td>
                    <td className="px-4 py-2 border-b border-gray-700">Bob</td>
                    <td className="px-4 py-2 border-b border-gray-700">2</td>
                    <td className="px-4 py-2 border-b border-gray-700">410</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-700">3</td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      Charlie
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">4</td>
                    <td className="px-4 py-2 border-b border-gray-700">390</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <RightSection trendingTweets={trendingTweets} leaderboard={true} />
      </div>
    </div>
  );
}
