import ComposeTweet from "./server-components/compose-tweet";
import { createClient } from "@/lib/supabase/server";
import TweetCard from "./client-components/tweet-card";

const MainComponent = async function () {
  const supabase = await createClient();

  let { data: tweets, error: tweetFetchError } = await supabase
    .from("tweets")
    .select("*")
    .range(0, 100);

  if (tweetFetchError) {
    console.error("Tweet Fetch Error:", tweetFetchError);
    return;
  }

  const timelineLength = tweets?.length;

  // need to include case where there are no tweets available
  if (timelineLength) {
    return (
      <main className="sticky top-0 flex min-w-[45%] max-w-[45%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
        <div className="backdrop-blur-xl backdrop-brightness-50 sticky top-0">
          <h1 className="text-xl font-bold ml-6 mt-5 mb-4">Home</h1>
        </div>
        <div
          className="border-t-[0.5px] px-4 border-b-[0.5px] flex items-stretch py-4 border-gray-600
    relative"
        >
          <div className="w-11 h-11 bg-slate-400 rounded-full flex-none mt-3"></div>
          <ComposeTweet />
        </div>
        <div className="flex flex-col">
          {tweets
            .slice()
            .reverse()
            .map((tweet, i) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
        </div>
      </main>
    );
  }
};

export default MainComponent;
