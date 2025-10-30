import { Suspense } from "react";
import { redirect } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import ProfileFeedTimeline from "@/components/server-components/profile-feed";
import { createClient } from "@/lib/supabase/server";
import ProfileCard from "@/components/client-components/profile-card";
import TopUsers from "@/components/server-components/top-users";
import submitProfileChanges from "@/app/api/actions/submit-profile-changes";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
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

  const profileUsername = params.username;

  const { data: profileUser, error: profileUserError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", profileUsername)
    .single();

  if (profileUserError) {
    console.error("Error fetching profile:", profileUserError);
  }

  let isFollowing = false;
  let followersCount = 0;
  let followingCount = 0;

  if (authProfile?.id && profileUser?.id) {
    const [followStatusRes, followersRes, followingRes] = await Promise.all([
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", authProfile.id)
        .eq("followee_id", profileUser.id),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("followee_id", profileUser.id),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", profileUser.id),
    ]);

    if (followStatusRes.count && followStatusRes.count > 0) {
      isFollowing = true;
    }

    followersCount = followersRes.count ?? 0;
    followingCount = followingRes.count ?? 0;
  }

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar avatar_link={avatar_link} username={username} />
        <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <ProfileCard
            authProfile={authProfile}
            profileUser={profileUser}
            submitProfileChanges={submitProfileChanges}
            isFollowing={isFollowing}
            followersCount={followersCount}
            followingCount={followingCount}
          />
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
              </div>
            }
          >
            <ProfileFeedTimeline
              authProfile={authProfile}
              profileUser={profileUser}
            />
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
