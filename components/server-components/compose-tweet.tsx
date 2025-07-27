import { createClient } from "@/lib/supabase/server";
import ComposeTweetForm from "../client-components/compose-tweet-form";
import { v4 as uuidv4 } from "uuid";

const ComposeTweet = () => {
  async function submitTweet(formData: FormData) {
    "use server";

    const tweet = formData.get("tweet");

    if (!tweet) return;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const file = formData.get("file");

    if (file) {
      const fileID = uuidv4();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(user?.id + "/" + fileID, file);

      if (uploadError) {
        console.error("File upload error:", uploadError);
        return;
      }

      const image_link = `https://qzewmoffplkvyftuarjb.supabase.co/storage/v1/object/public/uploads/${user?.id}/${fileID}`;

      const { data: tweetInsertData, error: tweetInsertError } = await supabase
        .from("tweets")
        .insert({
          text: tweet,
          user_id: user?.id,
          author: user?.user_metadata.display_name,
          file_link: image_link,
        });
      if (tweetInsertError) {
        console.error("Database Tweet Insert Error:", tweetInsertError);
      }
    } else {
      const { data: tweetInsertData, error: tweetInsertError } = await supabase
        .from("tweets")
        .insert({
          text: tweet,
          user_id: user?.id,
          author: user?.user_metadata.display_name,
        });

      if (tweetInsertError) {
        console.error("Database Tweet Insert Error:", tweetInsertError);
        return;
      }
    }
  }

  return <ComposeTweetForm submitTweet={submitTweet} />;
};

export default ComposeTweet;
