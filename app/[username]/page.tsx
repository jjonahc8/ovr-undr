import TweetCard from "@/components/client-components/tweet-card";
import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/ui/back-button";
import generateDate from "@/components/utilities/generateDate";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditProfileTrigger from "@/components/client-components/edit-profile-trigger";
import submitProfileChanges from "../api/actions/submit-profile-changes";
import { Button } from "@/components/ui/button";

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
  const authUser = authUserData?.claims;
  const authUserID = authUser?.sub;

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

  let { data: profileUser, error: profileUserError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", profileUsername);

  if (profileUserError) {
    console.error("Error fetching profile:", profileUserError);
  }

  let { data: tweetsAuthorsParents, error: tweetFetchError } = await supabase
    .from("tweets_with_authors_and_parents")
    .select("*")
    .eq("user_id", profileUser?.[0]?.id)
    .range(0, 100);

  if (tweetFetchError) {
    console.error("Tweet Fetch Error:", tweetFetchError);
    return;
  }

  const tweetIds = (tweetsAuthorsParents ?? []).map((t) => t.id);

  // FETCH LIKES & LIKE COUNTS IN PARALLEL
  const [
    { data: likeCounts, error: likeCountError },
    { data: clientLikes, error: clientLikesError },
  ] = await Promise.all([
    supabase.rpc("get_like_counts", { tweet_ids: tweetIds }),
    supabase
      .from("likes")
      .select("tweet_id")
      .eq("user_id", authProfile.id)
      .in("tweet_id", tweetIds),
  ]);

  if (likeCountError) console.error("Like Count Error:", likeCountError);
  if (clientLikesError) console.error("Client Likes Error:", clientLikesError);

  // Create a Map for like counts keyed by tweet_id
  const likeMap = new Map<string, number>();
  likeCounts?.forEach((row: any) => {
    likeMap.set(row.tweet_id, Number(row.count) ?? 0);
  });

  const parentMap = new Map(
    tweetsAuthorsParents?.map((tAP) => [
      tAP.parent_tweet_id,
      {
        id: tAP.parent_tweet_id,
        text: tAP.parent_text,
        created_at: tAP.parent_created_at,
        user_id: tAP.parent_user_id,
        author: tAP.parent_author_username,
      },
    ])
  );

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[90vw] w-full h-full flex relative">
        <LeftSidebar avatar_link={avatar_link} username={username} />
        <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="flex flex-row items-center mt-4 mb-2 ml-2">
            <BackButton />
            <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
              {profileUsername}
            </h1>
          </div>
          <div className="relative inline-block">
            {profileUser?.[0]?.banner_link && (
              <img
                className="w-full h-40 mt-3"
                src={profileUser?.[0]?.banner_link}
                alt="profile banner"
              />
            )}
            {!profileUser?.[0]?.banner_link && (
              <div className="w-full h-40 bg-slate-400 mt-3"></div>
            )}
            {profileUser?.[0]?.pfp_link && (
              <img
                className="absolute left-4 bottom-0 translate-y-1/2 w-32 h-32 rounded-full"
                src={profileUser?.[0]?.pfp_link}
                alt="profile picture"
              />
            )}
            {!profileUser?.[0]?.pfp_link && (
              <div className="absolute left-4 bottom-0 translate-y-1/2 w-32 h-32 rounded-full bg-slate-50"></div>
            )}
          </div>
          <div className="flex justify-end mt-4 px-4">
            {authUserID === profileUser?.[0]?.id && (
              <EditProfileTrigger submitProfileChanges={submitProfileChanges} />
            )}
            {authUserID !== profileUser?.[0].id && (
              <Button
                className="text-xl text-white font-semibold bg-transparent border-[0.5px] border-white hover:bg-white 
          hover:text-black transition duration-200 rounded-full"
              >
                Follow
              </Button>
            )}
          </div>
          <div className="flex flex-col pt-6 px-4">
            <h1 className="text-3xl font-bold">{profileUsername}</h1>
            <h1 className="text-sm text-gray-400">
              {profileUser?.[0]?.first_name} {profileUser?.[0]?.last_name}
            </h1>
          </div>
          <div className="pt-2 px-4">
            <p>{profileUser?.[0]?.bio}</p>
          </div>
          <div className="pt-2 px-4 text-gray-400">
            <p>Joined {generateDate(profileUser?.[0].created_at)}</p>
          </div>
          <div className="flex flex-row items-center py-2 px-4 border-b-[0.5px] border-gray-600">
            <h1 className="font-bold mr-2 text-2xl">
              {profileUser?.[0]?.followers}
            </h1>
            <p className="mr-4 text-gray-400">Followers</p>
            <h1 className="font-bold mr-2 text-2xl">
              {profileUser?.[0]?.following}
            </h1>
            <p className="text-gray-400">Following</p>
          </div>
          <div className="flex flex-col">
            {(tweetsAuthorsParents ?? [])
              .slice()
              .reverse()
              .map((tAP) => (
                <TweetCard
                  key={tAP.id}
                  tweet={{
                    id: tAP.id,
                    text: tAP.text,
                    created_at: tAP.created_at,
                    user_id: tAP.user_id,
                    parent_id: tAP.parent_id,
                    author: tAP.author_username,
                  }}
                  parent={tAP.parent_id ? parentMap.get(tAP.parent_id) : null}
                  tweetsAuthorsParents={tweetsAuthorsParents}
                  clientLikes={clientLikes}
                  likeMap={likeMap}
                />
              ))}
          </div>
        </main>
        <RightSection />
      </div>
    </div>
  );
}
