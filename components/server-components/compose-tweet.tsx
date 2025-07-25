import { createClient } from "@/lib/supabase/server";

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
  }

  return (
    <form action={submitTweet} className="flex flex-col w-full h-full">
      <input
        type="text"
        name="tweet"
        className="w-full h-full text-2xl placeholder:text-gray-600 bg-transparent border-b-[0.5px] border-gray-600 p-4 
          outline-none border-none"
        placeholder="What's the plot?"
      />
      <div className="w-full justify-between items-center flex">
        <div></div>
        <div className="w-full max-w-[100px]">
          <button
            type="submit"
            className="rounded-full bg-blue-500 px-4 py-2 w-full text-lg text-center hover:bg-blue-500/70 
            transition duration-200 font-bold"
          >
            Tweet
          </button>
        </div>
      </div>
    </form>
  );
};

export default ComposeTweet;
