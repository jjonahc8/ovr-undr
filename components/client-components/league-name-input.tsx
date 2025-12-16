"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LabeledSlider from "./labeled-slider";
import { getNFLWeek } from "../utilities/generateNFLWeek";
import { createLeague } from "@/app/api/actions/create-league";

export default function LeagueInput() {
  const router = useRouter();

  const [leagueName, setLeagueName] = useState("");
  const [minLastWeek, setMinLastWeek] = useState<number>(1);

  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [lastWeek, setLastWeek] = useState<number>(17);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxChars = 20;

  useEffect(() => {
    const wk = getNFLWeek(new Date(), 2025) ?? 1;
    setMinLastWeek(wk);
    setLastWeek(17);
  }, []);

  const handleCreate = async () => {
    setError(null);
    setLoading(true);

    const res = await createLeague({
      name: leagueName,
      maxPlayers,
      lastWeek,
      season: 2025,
    });

    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    // If you have a league page route, push to it:
    // router.push(`/league/${res.league.id}`);
    router.push("/protected"); // or wherever you want after creating
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Insert League Name..."
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
          maxLength={maxChars}
          className="text-center text-3xl font-bold text-white bg-transparent focus:outline-none w-3/4 placeholder-gray-500"
        />
        <span className="mt-2 text-sm text-gray-500">
          {leagueName.length}/{maxChars}
        </span>
      </div>

      <div className="flex flex-col font-semibold mt-4 mx-6 gap-4">
        <LabeledSlider
          label="How many players?"
          min={2}
          max={12}
          defaultValue={4}
          onChange={(v: number) => setMaxPlayers(v)}
        />

        <LabeledSlider
          label="Last week of league?"
          min={minLastWeek}
          max={17}
          defaultValue={17}
          onChange={(v: number) => setLastWeek(v)}
        />
      </div>

      {error && (
        <div className="text-center mt-4 text-red-400 font-medium">{error}</div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={handleCreate}
          disabled={loading || leagueName.trim().length === 0}
          className="text-2xl font-semibold rounded-full border-[0.5px] border-white hover:bg-white hover:text-black transition duration-200 px-4 py-2 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white"
        >
          {loading ? "Creating..." : "Create League"}
        </button>
      </div>
    </div>
  );
}
