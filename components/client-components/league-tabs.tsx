"use client";

import { useState } from "react";

export default function LeagueTabs() {
  const [activeTab, setActiveTab] = useState<"matchup" | "leaderboard">(
    "matchup"
  );

  return (
    <div className="flex flex-col">
      {/* Tab selector */}
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

      {/* Tab content */}
      <div className="p-4">
        {activeTab === "matchup" && (
          <div>
            <h2 className="text-xl font-bold mb-2">
              Your Name vs. Opponent Name
            </h2>
            <div>
              {/* Replace with real matchup data */}
              Matchup details go here...
            </div>
          </div>
        )}

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
                  {/* Example static rows, replace with Supabase query */}
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
