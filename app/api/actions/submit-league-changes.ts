import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitLeagueChanges(
  leagueId: string,
  formData: FormData
) {
  "use server";

  const supabase = await createClient();

  const { data: viewerRes, error: viewerError } = await supabase.auth.getUser();
  if (viewerError || !viewerRes?.user) redirect("/auth/login");
  const viewer = viewerRes.user;

  // Fetch league + verify admin
  const { data: league, error: leagueError } = await supabase
    .from("leagues")
    .select("id, admin_id")
    .eq("id", leagueId)
    .single();

  if (leagueError || !league) {
    console.error("Error fetching league:", leagueError);
    return;
  }

  if (league.admin_id !== viewer.id) {
    // Admins only
    redirect(`/league/${leagueId}`);
  }

  const banner = formData.get("banner") as File | null;

  if (banner) {
    const bannerID = uuidv4();
    const objectPath = `${leagueId}/${bannerID}`;

    const { error: uploadError } = await supabase.storage
      .from("league_banner")
      .upload(objectPath, banner, {
        upsert: true,
        contentType: banner.type || undefined,
      });

    if (uploadError) {
      console.error("League banner upload error:", uploadError);
      return;
    }

    // If your bucket is PRIVATE, you should use createSignedUrl instead.
    // This assumes PUBLIC bucket URLs:
    const banner_link = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/league_banner/${objectPath}`;

    const { error: updateError } = await supabase
      .from("leagues")
      .update({ banner_link })
      .eq("id", leagueId);

    if (updateError) {
      console.error("Error updating league banner_link:", updateError);
      return;
    }
  }
}
