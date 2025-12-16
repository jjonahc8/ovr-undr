"use server";

import { createClient } from "@/lib/supabase/server";

export type CreateLeagueInput = {
  name: string;
  maxPlayers: number;
  lastWeek: number;
  season: number;
};

type CreateLeagueResult =
  | { ok: true; league: unknown }
  | { ok: false; error: string };

function clampInt(v: number, min: number, max: number) {
  const n = Math.trunc(Number(v));
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export async function createLeague(
  input: CreateLeagueInput
): Promise<CreateLeagueResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return { ok: false, error: "Not authenticated" };
  }

  const name = input.name.trim();
  if (!name) return { ok: false, error: "League name is required" };

  const p_max_players = clampInt(input.maxPlayers, 2, 12);
  const p_last_week = clampInt(input.lastWeek, 1, 17);
  const p_season = clampInt(input.season, 2000, 3000);

  const { data, error } = await supabase.rpc("create_league_and_add_admin", {
    p_name: name,
    p_max_players,
    p_last_week,
    p_season,
    p_team_name: "Admin",
  });

  if (error) {
    console.error("createLeague rpc failed:", {
      message: error.message,
      code: (error as { code?: string }).code,
      userId: user.id,
      input: { name, p_max_players, p_last_week, p_season },
    });

    const msg =
      error.message.toLowerCase().includes("row level security") ||
      error.message.toLowerCase().includes("violates row-level security")
        ? "Blocked by RLS policy (leagues/league_members). Ensure your policies allow inserts for auth.uid()."
        : error.message;

    return { ok: false, error: msg };
  }

  return { ok: true, league: data };
}
