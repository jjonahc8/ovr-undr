import { createClient } from "@/lib/supabase/server";
import TweetCard from "../client-components/tweet-card";

export default async function ProfileFeedTimeline({
  authProfile,
  profileUser,
}: {
  authProfile: any;
  profileUser: any;
}) {
  const supabase = await createClient();

  let { data: tweetsAuthorsParents, error: tweetFetchError } = await supabase
    .from("tweets_with_authors_and_parents")
    .select("*")
    .eq("user_id", profileUser.id)
    .range(0, 100);

  if (tweetFetchError) {
    console.error("Tweet Fetch Error:", tweetFetchError);
    return;
  }

  const tweetIds = (tweetsAuthorsParents ?? []).map((t) => t.id);

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

  const parentMap = new Map(
    tweetsAuthorsParents?.map((tAP) => [
      tAP.parent_tweet_id,
      {
        id: tAP.parent_tweet_id,
        text: tAP.parent_text,
        created_at: tAP.parent_created_at,
        user_id: tAP.parent_user_id,
        author: tAP.parent_author_username,
        file_link: tAP.parent_file_link,
      },
    ])
  );
  return (
    <div className="flex flex-col">
      {(tweetsAuthorsParents ?? []).reverse().map((tAP) => (
        <TweetCard
          key={tAP.id}
          tweet={{
            id: tAP.id,
            text: tAP.text,
            created_at: tAP.created_at,
            user_id: tAP.user_id,
            parent_id: tAP.parent_id,
            author: tAP.author_username,
            file_link: tAP.file_link,
          }}
          parent={tAP.parent_id ? parentMap.get(tAP.parent_id) : null}
          tweetsAuthorsParents={tweetsAuthorsParents}
          clientLikes={clientLikes}
          likeMap={likeMap}
          commentCountMap={commentCountMap}
        />
      ))}
    </div>
  );
}
