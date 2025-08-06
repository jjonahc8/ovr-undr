"use server";

import { createClient } from "@/lib/supabase/server";

export async function followUser(
  followerId: string,
  followeeId: string
): Promise<"followed" | "unfollowed" | "error"> {
  const supabase = await createClient();

  const { data: existingFollow, error: followCheckError } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId)
    .single();

  if (followCheckError && followCheckError.code !== "PGRST116") {
    console.error("Error checking follow:", followCheckError);
    return "error";
  }

  if (existingFollow) {
    const { error: unfollowError } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("followee_id", followeeId);

    if (unfollowError) {
      console.error("Error unfollowing:", unfollowError);
      return "error";
    }

    return "unfollowed";
  } else {
    const { error: followError } = await supabase
      .from("follows")
      .insert({ follower_id: followerId, followee_id: followeeId });

    if (followError) {
      console.error("Error following:", followError);
      return "error";
    }

    return "followed";
  }
}
