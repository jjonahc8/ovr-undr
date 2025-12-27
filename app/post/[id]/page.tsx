import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import ComposeTweet from "@/components/server-components/compose-tweet";
import ReplyFeedTimeline from "@/components/server-components/reply-feed";
import TopUsers from "@/components/server-components/top-users";
import { Suspense } from "react";
import FocusedTweet from "@/components/server-components/focused-tweet";
import Image from "next/image";

type SidebarLeague = {
  id: string;
  name: string;
};

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

  const { data: authLeagues, error: authLeaguesErrors } = await supabase
    .from("league_members")
    .select("league_id")
    .eq("player_id", authProfile?.id ?? "");

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
  }

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar
          avatar_link={avatar_link}
          username={username}
          leagues={leaguesForSidebar}
        />
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
          <div className="px-4 py-4 flex items-start gap-3 border-b-[0.5px] border-gray-600">
            <div className="w-10 h-10 rounded-full flex-none">
              {!avatar_link && (
                <div className="w-10 h-10 bg-slate-400 rounded-full" />
              )}
              {avatar_link && (
                <Image
                  className="w-10 h-10 rounded-full"
                  src={avatar_link}
                  alt="profile avatar"
                  height={48}
                  width={48}
                />
              )}
            </div>
            <div className="flex-1">
              <ComposeTweet />
            </div>
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
              <TopUsers currentUserId={authUserData.claims.sub} />
            </Suspense>
          }
        />
      </div>
    </div>
  );
}
