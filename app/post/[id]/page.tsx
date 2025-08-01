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

  const { data: tweetsAuthorsParents, error: tweetFetchError } = await supabase
    .from("tweets_with_authors_and_parents")
    .select("*")
    .or(`id.eq.${params.id},parent_id.eq.${params.id}`);

  if (tweetFetchError) {
    console.error("Error fetching tweets and replies:", tweetFetchError);
    return;
  }

  const tAP = tweetsAuthorsParents.find((t) => t.id === params.id);

  const tweet = {
    id: tAP.id,
    text: tAP.text,
    created_at: tAP.created_at,
    user_id: tAP.user_id,
    parent_id: tAP.parent_id,
    author: tAP.author_username,
  };

  // parent
  const parent_id = tAP.parent_tweet_id;
  let parent = null;
  if (parent_id) {
    parent = {
      id: tAP.parent_tweet_id,
      text: tAP.parent_text,
      created_at: tAP.created_at,
      user_id: tAP.user_id,
      author: tAP.parent_author_username,
    };
  }

  const replies = tweetsAuthorsParents.filter((t) => t.parent_id === params.id);

  const tweetIds = tweetsAuthorsParents.map((t) => t.id);

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

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[90vw] w-full h-full flex relative">
        <LeftSidebar avatar_link={avatar_link} username={username} />
        <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="flex flex-row items-center mt-4 mb-2 ml-2">
            <BackButton />
            <h1 className="text-xl font-bold px-6 backdrop-blur bg-black/10 sticky top-0">
              Post
            </h1>
          </div>
          <div>
            <TweetCard
              tweet={tweet}
              parent={parent}
              tweetsAuthorsParents={tweetsAuthorsParents}
              clientLikes={clientLikes}
              likeMap={likeMap}
            />
          </div>
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
          <div className="flex flex-col border-gray-600">
            {(replies ?? [])
              .slice()
              .reverse()
              .map((reply, i) => (
                <TweetCard
                  key={reply.id}
                  tweet={{
                    id: reply.id,
                    text: reply.text,
                    created_at: reply.created_at,
                    user_id: reply.user_id,
                    parent_id: reply.parent_id,
                    author: reply.author_username,
                  }}
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
