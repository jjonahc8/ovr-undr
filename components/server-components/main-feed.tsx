import { createClient } from "@/lib/supabase/server";
import MainComponent from "../MainComponent";

export default async function MainFeedTimeline({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: tweetsAuthorsParents, error: tweetFetchError } = await supabase
    .from("tweets_with_authors_and_parents")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 100);

  if (tweetFetchError || !tweetsAuthorsParents) {
    console.error("Error fetching tweests:", tweetFetchError);
    return null;
  }

  const tweetIds = tweetsAuthorsParents.map((t) => t.id);

  const [
    { data: likeCounts, error: likeCountError },
    { data: clientLikes, error: clientLikesError },
    { data: replyCounts, error: replyCountError },
  ] = await Promise.all([
    supabase.rpc("get_like_counts", { tweet_ids: tweetIds }),
    supabase
      .from("likes")
      .select("tweet_id")
      .eq("user_id", userId)
      .in("tweet_id", tweetIds),
    supabase.rpc("get_reply_counts", { tweet_ids: tweetIds }),
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

  return await MainComponent(
    tweetsAuthorsParents,
    clientLikes ?? [],
    likeMap,
    commentCountMap
  );
}
