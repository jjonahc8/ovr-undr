import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import LabeledSlider from "@/components/client-components/labeled-slider";
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
          <div className="flex flex-col mt-10">
            <div className="text-center text-3xl text-gray-500 font-bold">
              Insert League Name...
            </div>
            <div className="flex flex-col font-semibold mt-4 mx-6 gap-4">
              <LabeledSlider
                label="How many players?"
                min={2}
                max={12}
                defaultValue={4}
              />
              <LabeledSlider
                label="How many weeks?"
                min={1}
                max={17}
                defaultValue={17}
              />
            </div>
            <div className="text-center mt-6">
              <button
                className="text-2xl font-semibold rounded-full border-[0.5px] border-white hover:bg-white 
          hover:text-black transition duration-200 px-4 py-2"
              >
                Create League
              </button>
            </div>
          </div>
        </main>
        <RightSection />
      </div>
    </div>
  );
}
