import { createClient } from "@/lib/supabase/server";
import ComposeTweetForm from "../client-components/compose-tweet-form";

const ComposeTweet = () => {
  async function submitTweet(formData: FormData) {
    "use server";

    const tweet = formData.get("tweet");

    if (!tweet) return;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.from("tweets").insert({
      text: tweet,
      user_id: user?.id,
      author: user?.user_metadata.display_name,
    });

    if (error) {
      console.error("Error inserting tweet:", error);
      return;
    }
  }

  return <ComposeTweetForm submitTweet={submitTweet} />;
};

export default ComposeTweet;
