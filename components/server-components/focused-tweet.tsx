import { createClient } from "@/lib/supabase/server";
import TweetCard from "../client-components/tweet-card";

export default async function FocusedTweet({
  params,
  authProfile,
}: {
  params: any;
  authProfile: any;
}) {
  const supabase = await createClient();

  const { data: tweetsAuthorsParents, error: tweetFetchError } = await supabase
    .from("tweets_with_authors_and_parents")
    .select("*")
    .eq("id", params.id);

  if (tweetFetchError) {
    console.error("Error fetching main tweet:", tweetFetchError);
    return;
  }

  const tAP = tweetsAuthorsParents[0];

  const tweet = {
    id: tAP.id,
    text: tAP.text,
    created_at: tAP.created_at,
    user_id: tAP.user_id,
    parent_id: tAP.parent_id,
    author: tAP.author_username,
    file_link: tAP.file_link,
  };

  const parent_id = tAP.parent_tweet_id;
  let parent = null;
  if (parent_id) {
    parent = {
      id: tAP.parent_tweet_id,
      text: tAP.parent_text,
      created_at: tAP.created_at,
      user_id: tAP.user_id,
      author: tAP.parent_author_username,
      file_link: tAP.parent_file_link,
    };
  }

  const [
    { data: likeCounts, error: likeCountError },
    { data: clientLikes, error: clientLikesError },
    { data: replyCounts, error: replyCountError },
  ] = await Promise.all([
    supabase.rpc("get_like_counts", { tweet_ids: [tAP.id] }),
    supabase
      .from("likes")
      .select("tweet_id")
      .eq("user_id", authProfile.id)
      .in("tweet_id", [tAP.id]),
    supabase.rpc("get_reply_counts", { tweet_ids: [tAP.id] }),
  ]);

  if (likeCountError) console.error("Like Count Error:", likeCountError);
  if (clientLikesError) console.error("Client Likes Error:", clientLikesError);
  if (replyCountError) console.error("Reply Count Error:", replyCountError);

  const commentCountMap = new Map<string, number>();
  replyCounts?.forEach((row: any) => {
    commentCountMap.set(row.tweet_id, Number(row.count) ?? 0);
  });

  const likeMap = new Map<string, number>();
  likeCounts?.forEach((row: any) => {
    likeMap.set(row.tweet_id, Number(row.count) ?? 0);
  });
  return (
    <div>
      <TweetCard
        tweet={tweet}
        parent={parent}
        tweetsAuthorsParents={tweetsAuthorsParents}
        clientLikes={clientLikes}
        likeMap={likeMap}
        commentCountMap={commentCountMap}
        currentUserId={authProfile.id}
      />
    </div>
  );
}
