"use server";

import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function createLeagueInvite(leagueId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Verify user is admin
  const { data: league } = await supabase
    .from("leagues")
    .select("admin_id")
    .eq("id", leagueId)
    .single();

  if (!league || league.admin_id !== user.id) {
    throw new Error("Not league admin");
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  await supabase.from("league_invites").insert({
    league_id: leagueId,
    token,
    created_by: user.id,
    expires_at: expiresAt.toISOString(),
    max_uses: 1,
    uses: 0,
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return `${baseUrl}/invite/${token}`;
}
