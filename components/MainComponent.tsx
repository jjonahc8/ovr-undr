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
      <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
        <div className="backdrop-blur-xl backdrop-brightness-50 sticky top-0">
          <h1 className="text-xl font-bold ml-6 mt-5 mb-4">Home</h1>
        </div>
        <div className="border-t-[0.5px] border-b-[0.5px] px-4 flex items-stretch py-4 border-gray-600 relative">
          <div className="w-11 h-11 rounded-full flex-none mt-3">
            {!avatar_link && (
              <div className="w-11 h-11 bg-slate-400 rounded-full" />
            )}
            {avatar_link && (
              <img className="w-11 h-11 rounded-full" src={avatar_link} />
            )}
          </div>
          <ComposeTweet />
        </div>
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
      </main>
    );
  }
};

export default MainComponent;
