import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import ComposeTweet from "@/components/server-components/compose-tweet";
import ReplyFeedTimeline from "@/components/server-components/reply-feed";
import { Suspense } from "react";
import FocusedTweet from "@/components/server-components/focused-tweet";

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

  const { data: authProfileData, error: authProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUserData.claims.sub);

  if (authProfileError) {
    console.error("Error fetching auth user's profile:", authProfileError);
    return;
  }

  const authProfile = authProfileData?.[0];

  const avatar_link: string | null = authProfile.pfp_link;
  const username: string | null = authProfile.username;

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar avatar_link={avatar_link} username={username} />
        <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="flex flex-row items-center mt-4 mb-2 ml-2">
            <BackButton />
            <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
              Post
            </h1>
          </div>
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
              </div>
            }
          >
            <FocusedTweet params={params} authProfile={authProfile} />
          </Suspense>
          <div
            className={`px-4 pt-2 pb-4 border-b-[0.5px] border-gray-600 flex items-stretch relative`}
          >
            <div className="w-10 h-10 rounded-full flex-none">
              {!avatar_link && (
                <div className="w-10 h-10 bg-slate-400 rounded-full" />
              )}
              {avatar_link && (
                <img className="w-10 h-10 rounded-full" src={avatar_link} />
              )}
            </div>
            <ComposeTweet />
          </div>
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
              </div>
            }
          >
            <ReplyFeedTimeline params={params} authProfile={authProfile} />
          </Suspense>
        </main>
        <RightSection />
      </div>
    </div>
  );
}
