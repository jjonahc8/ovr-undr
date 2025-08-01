import ComposeTweet from "./server-components/compose-tweet";
import TweetCard from "./client-components/tweet-card";

const MainComponent = async function (
  avatar_link: string | null,
  tweets: any[] | null,
  parents: any[] | null,
  tweetAuthors: any[] | null
) {
  const timelineLength = tweets?.length;

  const parentMap = new Map(parents?.map((parent) => [parent.id, parent]));

  if (timelineLength) {
    return (
      <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
        <div className="backdrop-blur-xl backdrop-brightness-50 sticky top-0">
          <h1 className="text-xl font-bold ml-6 mt-5 mb-4">Home</h1>
        </div>
        <div className="border-t-[0.5px] px-4 flex items-stretch py-4 border-gray-600 relative">
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
          {tweets
            .slice()
            .reverse()
            .map((tweet) => (
              <TweetCard
                key={tweet.id}
                tweet={tweet}
                parent={parentMap.get(tweet.parent_id) ?? null}
                tweetAuthors={tweetAuthors}
              />
            ))}
        </div>
      </main>
    );
  }
};

export default MainComponent;
