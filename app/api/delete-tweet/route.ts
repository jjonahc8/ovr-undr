import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });

  const supabase = await createClient();
  
  // Check authentication
  const { data: authUserData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authUserData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = authUserData.claims.sub;

  // Check if the tweet exists and belongs to the current user
  const { data: tweet, error: fetchError } = await supabase
    .from("tweets")
    .select("user_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }

  if (tweet.user_id !== userId) {
    return NextResponse.json({ error: "You can only delete your own tweets" }, { status: 403 });
  }

  // Check if this tweet has replies
  const { data: replies, error: repliesError } = await supabase
    .from("tweets")
    .select("id")
    .eq("parent_id", id);

  if (repliesError) {
    return NextResponse.json({ error: "Error checking replies" }, { status: 500 });
  }

  // If tweet has replies, soft delete by updating text to [DELETED] and removing file
  if (replies && replies.length > 0) {
    const { error: updateError } = await supabase
      .from("tweets")
      .update({ 
        text: "[DELETED]",
        file_link: null 
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  } else {
    // Hard delete if no replies
    const { error: deleteError } = await supabase
      .from("tweets")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
