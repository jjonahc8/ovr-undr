import TweetCard from "./client-components/tweet-card";
import { TweetAuthorParentView } from "./types/tweetsauthorsparents";
import { ClientLike } from "./types/clientlikes";

const MainComponent = async function (
  tweetsAuthorsParents: TweetAuthorParentView[] | null,
  clientLikes: ClientLike[] | null,
  likeMap: Map<string, number>,
  commentCountMap: Map<string, number>,
  currentUserId?: string
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
        parent_id: null,
        author: tAP.parent_author_username,
        file_link: tAP.parent_file_link,
      },
    ])
  );

  if (timelineLength) {
    return (
      <div className="flex flex-col">
        {tweetsAuthorsParents.map((tAP) => (
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
            parent={tAP.parent_id ? parentMap.get(tAP.parent_id) : undefined}
            tweetsAuthorsParents={tweetsAuthorsParents}
            clientLikes={clientLikes}
            likeMap={likeMap}
            commentCountMap={commentCountMap}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    );
  }
};

export default MainComponent;
