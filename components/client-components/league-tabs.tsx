"use client";

import { useState } from "react";

type MarketKey = string;

type BetSlipItem = {
  player_id: string | number;
  market_key: MarketKey;
  player_name: string;
  home_team: string;
  away_team: string;
  point: number;
};

export default function LeagueTabs({ betSlips }: { betSlips: BetSlipItem[] }) {
  const [activeTab, setActiveTab] = useState<"matchup" | "leaderboard">(
    "matchup"
  );

  const [selections, setSelections] = useState<
    Record<string, "over" | "under" | null>
  >({});

  const [locked, setLocked] = useState(false);

  const handleSelect = (key: string, value: "over" | "under") => {
    setLocked(false);

    setSelections((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const handleLockIn = () => {
    setLocked(true);
  };

  const allSelected =
    betSlips.length > 0 &&
    betSlips.every((item) => {
      const key = `${item.player_id}-${item.market_key}`;
      return selections[key] === "over" || selections[key] === "under";
    });

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-around text-lg font-semibold border-b-[0.5px] border-gray-600">
        <button
          onClick={() => setActiveTab("matchup")}
          className={`w-1/2 py-3 transition ${
            activeTab === "matchup"
              ? "border-b-2 border-white"
              : "hover:bg-white/10"
          }`}
        >
          Matchup
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`w-1/2 py-3 transition ${
            activeTab === "leaderboard"
              ? "border-b-2 border-white"
              : "hover:bg-white/10"
          }`}
        >
          Leaderboard
        </button>
      </div>

      <div className="p-4">
        {activeTab === "matchup" && (
          <div className="flex flex-col gap-4">
            {allSelected && !locked && (
              <button
                onClick={handleLockIn}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-lg shadow-md hover:bg-green-700"
              >
                Lock In Picks
              </button>
            )}

            {locked && (
              <button
                onClick={() => setLocked(false)}
                className="w-full py-3 rounded-xl bg-gray-700 text-white font-semibold text-lg shadow-md hover:bg-gray-600"
              >
                Deselect / Unlock Picks
              </button>
            )}

            <div
              className={
                "grid grid-cols-2 gap-4 transition " +
                (locked ? "opacity-40 pointer-events-none" : "")
              }
            >
              {betSlips.map((item) => {
                const slipKey = `${item.player_id}-${item.market_key}`;
                const selected = selections[slipKey];

                return (
                  <div
                    key={slipKey}
                    className="rounded-2xl bg-[#0f0f0f] border border-[#1d1d1d] p-4 pt-10 text-center text-white"
                  >
                    <div className="text-lg font-semibold">
                      {item.player_name}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {item.home_team} vs {item.away_team}
                    </div>

                    <div className="flex flex-col items-center mt-3 text-3xl font-bold leading-tight">
                      {item.point}
                      <span className="text-sm font-light">
                        {item.market_key.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 divide-x divide-[#1d1d1d] border border-[#1d1d1d] rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleSelect(slipKey, "over")}
                        className={
                          "py-2 text-base transition " +
                          (selected === "over"
                            ? "bg-purple-600 text-white"
                            : "hover:bg-[#1a1a1a] text-purple-600")
                        }
                      >
                        Ovr
                      </button>

                      <button
                        onClick={() => handleSelect(slipKey, "under")}
                        className={
                          "py-2 text-base transition " +
                          (selected === "under"
                            ? "bg-red-600 text-white"
                            : "hover:bg-[#1a1a1a] text-red-600")
                        }
                      >
                        Undr
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === "leaderboard" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-600 rounded-lg">
                <thead>
                  <tr className="bg-gray-800 text-left">
                    <th className="px-4 py-2 border-b border-gray-600">Rank</th>
                    <th className="px-4 py-2 border-b border-gray-600">
                      Player
                    </th>
                    <th className="px-4 py-2 border-b border-gray-600">Wins</th>
                    <th className="px-4 py-2 border-b border-gray-600">
                      Losses
                    </th>
                    <th className="px-4 py-2 border-b border-gray-600">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-700">1</td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      Alice
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">5</td>
                    <td className="px-4 py-2 border-b border-gray-700">0</td>
                    <td className="px-4 py-2 border-b border-gray-700">120</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-700">2</td>
                    <td className="px-4 py-2 border-b border-gray-700">Bob</td>
                    <td className="px-4 py-2 border-b border-gray-700">3</td>
                    <td className="px-4 py-2 border-b border-gray-700">2</td>
                    <td className="px-4 py-2 border-b border-gray-700">95</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-700">3</td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      Charlie
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">1</td>
                    <td className="px-4 py-2 border-b border-gray-700">4</td>
                    <td className="px-4 py-2 border-b border-gray-700">60</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
