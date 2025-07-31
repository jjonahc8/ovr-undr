import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TweetCard from "@/components/client-components/tweet-card";
import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import ComposeTweet from "@/components/server-components/compose-tweet";

export default async function PostPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: authUserData, error: authUserError } =
    await supabase.auth.getClaims();

  if (authUserError || !authUserData?.claims) {
    console.error("Error fetching authentication");
    redirect("/auth/login");
  }

  let { data: tweet, error: tweetFetchError } = await supabase
    .from("tweets")
    .select("*")
    .eq("id", params.id);
  tweet = tweet?.[0];

  if (tweetFetchError) {
    console.error("Error fetching authentication: ", tweetFetchError);
  }

  let { data: replies, error: replyFetchError } = await supabase
    .from("tweets")
    .select("*")
    .eq("parent_id", params.id);

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[90vw] w-full h-full flex relative">
        <LeftSidebar />
        <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="flex flex-row items-center mt-4 mb-2 ml-2">
            <BackButton />
            <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
              Post
            </h1>
          </div>
          <div>
            <TweetCard tweet={tweet} />
          </div>
          <div className="px-4 pt-2 pb-4 border-b-[0.5px] flex items-stretch border-gray-600 relative">
            <div className="w-10 h-10 bg-slate-400 rounded-full flex-none"></div>
            <ComposeTweet />
          </div>
          <div className="flex flex-col border-gray-600">
            {(replies ?? [])
              .slice()
              .reverse()
              .map((reply, i) => (
                <TweetCard key={reply.id} tweet={reply} />
              ))}
          </div>
        </main>
        <RightSection />
      </div>
    </div>
  );
}
