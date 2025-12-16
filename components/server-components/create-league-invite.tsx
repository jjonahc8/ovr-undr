"use server";

import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function createLeagueInvite(leagueId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user)
    return { ok: false as const, error: "Not authenticated" };

  // verify admin
  const { data: league, error: leagueErr } = await supabase
    .from("leagues")
    .select("admin_id")
    .eq("id", leagueId)
    .single();

  if (leagueErr || !league)
    return { ok: false as const, error: "League not found" };
  if (league.admin_id !== user.id)
    return { ok: false as const, error: "Not league admin" };

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 24h

  const { error: inviteErr } = await supabase.from("league_invites").insert({
    league_id: leagueId,
    token,
    created_by: user.id,
    expires_at: expiresAt,
    max_uses: 1,
    uses: 0,
  });

  if (inviteErr) return { ok: false as const, error: inviteErr.message };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/invite/${token}`;

  return { ok: true as const, url };
}
