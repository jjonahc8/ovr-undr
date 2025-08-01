"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LeftSidebar from "@/components/LeftSidebar";
import MainComponent from "@/components/MainComponent";
import RightSection from "@/components/RightSection";
import React from "react";

export default async function ProtectedPage() {
  const supabase = await createClient();

  // AUTH CHECK
  const { data: authClaims, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !authClaims?.claims) {
    redirect("/auth/login");
  }

  const userId = authClaims.claims.sub;

  // GET USER PROFILE
  const { data: authProfileData, error: authProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (authProfileError || !authProfileData) {
    console.error("Error fetching auth user's profile:", authProfileError);
    return;
  }

  const avatar_link = authProfileData.pfp_link ?? null;
  const username = authProfileData.username ?? null;

  // FETCH TWEETS WITH AUTHORS AND PARENTS FROM VIEW
  const { data: tweetsAuthorsParents, error: tweetFetchError } = await supabase
    .from("tweets_with_authors_and_parents")
    .select("*")
    .range(0, 100);

  if (tweetFetchError || !tweetsAuthorsParents) {
    console.error("Error fetching tweets with parents:", tweetFetchError);
    return;
  }

  // Extract tweet IDs for likes fetching
  const tweetIds = tweetsAuthorsParents.map((t) => t.id);

  // FETCH LIKES & LIKE COUNTS IN PARALLEL
  const [
    { data: likeCounts, error: likeCountError },
    { data: clientLikes, error: clientLikesError },
  ] = await Promise.all([
    supabase.rpc("get_like_counts", { tweet_ids: tweetIds }),
    supabase
      .from("likes")
      .select("tweet_id")
      .eq("user_id", userId)
      .in("tweet_id", tweetIds),
  ]);

  if (likeCountError) console.error("Like Count Error:", likeCountError);
  if (clientLikesError) console.error("Client Likes Error:", clientLikesError);

  // Create a Map for like counts keyed by tweet_id
  const likeMap = new Map<string, number>();
  likeCounts?.forEach((row: any) => {
    likeMap.set(row.tweet_id, Number(row.count) ?? 0);
  });

  // PAGE RENDER
  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[90vw] w-full h-full flex relative">
        <LeftSidebar avatar_link={avatar_link} username={username} />
        {(await MainComponent(
          avatar_link,
          tweetsAuthorsParents,
          clientLikes ?? [],
          likeMap
        )) ?? <div>Error loading timeline</div>}
        <RightSection />
      </div>
    </div>
  );
}
