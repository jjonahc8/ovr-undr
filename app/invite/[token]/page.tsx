import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?redirect=/invite/${token}`);

  const { data: leagueId, error } = await supabase.rpc("accept_league_invite", {
    p_token: token,
  });

  if (error || !leagueId) {
    console.error("accept_league_invite failed:", {
      token,
      message: error?.message,
      code: (error as { code?: string })?.code,
    });

    return (
      <div className="text-white p-8">
        <div className="text-lg font-semibold">Invite error</div>
        <div className="mt-2 text-sm text-gray-400 break-all">
          {error?.message ?? "Unknown error"}
        </div>
      </div>
    );
  }

  redirect(`/league/${leagueId}`);
}
