"use server";

import { createClient } from "@/lib/supabase/server";

type LeaveLeagueResult = { ok: true } | { ok: false; message: string };

export default async function leaveLeague(
  leagueId: string
): Promise<LeaveLeagueResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "You must be logged in to leave a league." };
  }

  // Fetch league (for admin check)
  const { data: league, error: leagueError } = await supabase
    .from("leagues")
    .select("id, admin_id")
    .eq("id", leagueId)
    .single();

  if (leagueError || !league) {
    return { ok: false, message: "League not found." };
  }

  const isAdmin = league.admin_id === user.id;

  // Count members
  const { count: memberCount, error: countError } = await supabase
    .from("league_members")
    .select("id", { count: "exact", head: true })
    .eq("league_id", leagueId);

  if (countError) {
    return { ok: false, message: "Could not verify league members." };
  }

  const count = memberCount ?? 0;

  // If you're the last member AND the admin: delete the league (and your membership)
  if (count <= 1) {
    if (!isAdmin) {
      return {
        ok: false,
        message:
          "You can’t leave because you’re the last member. Ask the manager to delete the league or invite someone first.",
      };
    }

    // delete membership row first (in case no ON DELETE CASCADE)
    const { error: memberDeleteError } = await supabase
      .from("league_members")
      .delete()
      .eq("league_id", leagueId)
      .eq("player_id", user.id);

    if (memberDeleteError) {
      return { ok: false, message: "Failed to remove your membership." };
    }

    const { error: leagueDeleteError } = await supabase
      .from("leagues")
      .delete()
      .eq("id", leagueId)
      .eq("admin_id", user.id); // safety: only admin can delete

    if (leagueDeleteError) {
      return { ok: false, message: "Failed to delete the league." };
    }

    return { ok: true };
  }

  // If admin is leaving (and not last member), transfer admin to another member first
  if (isAdmin) {
    const { data: nextAdminRow, error: nextAdminError } = await supabase
      .from("league_members")
      .select("player_id")
      .eq("league_id", leagueId)
      .neq("player_id", user.id)
      .limit(1)
      .maybeSingle();

    if (nextAdminError || !nextAdminRow?.player_id) {
      return {
        ok: false,
        message:
          "You can’t leave as admin unless another member exists to transfer ownership.",
      };
    }

    const { error: transferError } = await supabase
      .from("leagues")
      .update({ admin_id: nextAdminRow.player_id })
      .eq("id", leagueId);

    if (transferError) {
      return { ok: false, message: "Failed to transfer league ownership." };
    }
  }

  // Remove membership
  const { error: deleteError } = await supabase
    .from("league_members")
    .delete()
    .eq("league_id", leagueId)
    .eq("player_id", user.id);

  if (deleteError) {
    return { ok: false, message: "Failed to leave league. Please try again." };
  }

  return { ok: true };
}
