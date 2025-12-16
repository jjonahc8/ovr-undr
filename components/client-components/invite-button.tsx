"use client";

import { useState } from "react";
import { createLeagueInvite } from "@/components/server-components/create-league-invite";

export default function InviteButton({ leagueId }: { leagueId: string }) {
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    setLoading(true);

    const res = await createLeagueInvite(leagueId);

    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setInviteUrl(res.url);

    try {
      await navigator.clipboard.writeText(res.url);
    } catch {}
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
  };

  const handleShare = async () => {
    if (!inviteUrl) return;
    // mobile share sheet if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const navAny = navigator as any;
    if (navAny.share) {
      await navAny.share({ title: "League Invite", url: inviteUrl });
    } else {
      await handleCopy();
    }
  };

  return (
    <div className="px-4 py-4 border-b-[0.5px] border-gray-600">
      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full py-2 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
      >
        {loading ? "Creating invite..." : "Create Invite Link"}
      </button>

      {inviteUrl && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="text-xs text-gray-400 break-all">{inviteUrl}</div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition"
            >
              Copy
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition"
            >
              Share
            </button>
          </div>
        </div>
      )}

      {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
    </div>
  );
}
