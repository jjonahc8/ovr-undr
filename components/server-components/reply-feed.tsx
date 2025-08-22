import { createClient } from "@/lib/supabase/server";
import TweetCard from "../client-components/tweet-card";

export default async function ReplyFeedTimeline({
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
    .eq("parent_id", params.id);

  if (tweetFetchError) {
    console.error("Error fetching tweets and replies:", tweetFetchError);
    return;
  }

  const replies = tweetsAuthorsParents;

  const tweetIds = replies.map((t) => t.id);

  const [
    { data: likeCounts, error: likeCountError },
    { data: clientLikes, error: clientLikesError },
    { data: replyCounts, error: replyCountError },
  ] = await Promise.all([
    supabase.rpc("get_like_counts", { tweet_ids: tweetIds }),
    supabase
      .from("likes")
      .select("tweet_id")
      .eq("user_id", authProfile.id)
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
  return (
    <div className="flex flex-col border-gray-600">
      {(replies ?? []).reverse().map((reply, i) => (
        <TweetCard
          key={reply.id}
          tweet={{
            id: reply.id,
            text: reply.text,
            created_at: reply.created_at,
            user_id: reply.user_id,
            parent_id: reply.parent_id,
            author: reply.author_username,
            file_link: reply.file_link,
          }}
          tweetsAuthorsParents={tweetsAuthorsParents}
          clientLikes={clientLikes}
          likeMap={likeMap}
          commentCountMap={commentCountMap}
          currentUserId={authProfile.id}
        />
      ))}
    </div>
  );
}
