"use client";

import { useState } from "react";

export default function LeagueNameInput() {
  const [leagueName, setLeagueName] = useState("");
  const maxChars = 20;

  return (
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
  );
}
