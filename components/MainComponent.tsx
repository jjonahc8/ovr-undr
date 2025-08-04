import ComposeTweet from "./server-components/compose-tweet";
import TweetCard from "./client-components/tweet-card";

const MainComponent = async function (
  avatar_link: string | null,
  tweetsAuthorsParents: any[] | null,
  clientLikes: any[] | null,
  likeMap: Map<string, number>
) {
  const timelineLength = tweetsAuthorsParents?.length;

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

  if (timelineLength) {
    return (
      <div className="flex flex-col">
        {tweetsAuthorsParents
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
    );
  }
};

export default MainComponent;
