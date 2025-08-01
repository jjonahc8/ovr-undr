"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LeftSidebar from "@/components/LeftSidebar";
import MainComponent from "@/components/MainComponent";
import RightSection from "@/components/RightSection";
import React from "react";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { data: authProfileData, error: authProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.claims.sub);

  if (authProfileError) {
    console.error("Error fetching auth user's profile:", authProfileError);
    return;
  }

  const authProfile = authProfileData?.[0];

  const avatar_link: string | null = authProfile.pfp_link;
  const username: string | null = authProfile.username;

  let { data: tweets, error: tweetFetchError } = await supabase
    .from("tweets")
    .select("*")
    .range(0, 100);

  if (tweetFetchError) {
    console.error("Tweet Fetch Error:", tweetFetchError);
    return;
  }

  const parentIds = [
    ...new Set((tweets ?? []).map((tweet) => tweet.parent_id).filter(Boolean)),
  ];

  let { data: parents, error: parentFetchError } = await supabase
    .from("tweets")
    .select("*")
    .in("id", parentIds);

  if (parentFetchError) {
    console.error("Parent Fetch Error:", parentFetchError);
    return;
  }

  let authorIds = [...new Set((tweets ?? []).map((tweet) => tweet.user_id))];

  let combinedSet = new Set([...parentIds, ...authorIds]);

  authorIds = [...combinedSet];

  let { data: tweetAuthors, error: tweetAuthorError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", authorIds);

  if (tweetAuthorError) {
    console.error("Avatar Fetch Error:", tweetAuthorError);
  }

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[90vw] w-full h-full flex relative">
        <LeftSidebar avatar_link={avatar_link} username={username} />
        {(async () => {
          const mainComponentResult = await MainComponent(
            avatar_link,
            tweets,
            parents,
            tweetAuthors
          );
          if (React.isValidElement(mainComponentResult)) {
            return mainComponentResult;
          }
          return <div>Error loading timeline</div>;
        })()}
        <RightSection />
      </div>
    </div>
  );
}
