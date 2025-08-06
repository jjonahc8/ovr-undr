import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tweetId = searchParams.get("id");
  if (!tweetId) {
    return NextResponse.json(
      { error: "No tweet ID provided" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existingLike, error: likeCheckError } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", user.id)
    .eq("tweet_id", tweetId)
    .single();

  if (likeCheckError && likeCheckError.code !== "PGRST116") {
    return NextResponse.json(
      { error: likeCheckError.message },
      { status: 500 }
    );
  }

  if (existingLike) {
    const { error: unlikeError } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("tweet_id", tweetId);

    if (unlikeError) {
      return NextResponse.json({ error: unlikeError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, liked: false });
  } else {
    const { error: likeError } = await supabase
      .from("likes")
      .insert({ user_id: user.id, tweet_id: tweetId });

    if (likeError) {
      return NextResponse.json({ error: likeError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, liked: true });
  }
}
