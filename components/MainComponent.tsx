import ComposeTweet from "./server-components/compose-tweet";
import { createClient } from "@/lib/supabase/server";
import { parseISO } from "date-fns";
import TweetCard from "./TweetCard";

const MainComponent = async function () {
  const supabase = await createClient();

  let { data: tweets, error } = await supabase
    .from("tweets")
    .select("*")
    .range(0, 100);

  if (error) {
    return error;
  }

  const timelineLength = tweets?.length;

  function generateDate(supabaseDate: any): any {
    const nowDate: Date = new Date();
    const postDate: Date = parseISO(supabaseDate);
    const timeDifferenceInMilliseconds: number =
      nowDate.getTime() - postDate.getTime();

    const seconds = Math.floor(timeDifferenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (days < 30) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (months < 12) {
      return `${months} month${months === 1 ? "" : "s"} ago`;
    } else {
      return `${years} year${years === 1 ? "" : "s"} ago`;
    }
  }

  // need to include case where there are no tweets available
  if (timelineLength) {
    return (
      <main className="sticky top-0 flex w-[55%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
        <h1 className="text-xl font-bold p-6 backdrop-blur bg-black/10 sticky top-0">
          Home
        </h1>
        <div
          className="border-t-[0.5px] px-4 border-b-[0.5px] flex items-stretch py-4 space-x-2 border-gray-600
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
