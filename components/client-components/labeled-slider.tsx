"use client";

import { useState } from "react";

interface LabeledSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
}

export default function LabeledSlider({
  label,
  min,
  max,
  step = 1,
  defaultValue = min,
}: LabeledSliderProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="w-full">
      <label htmlFor={label} className="block mb-2">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <input
          id={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-white"
        />
        <span className="text-lg font-bold">{value}</span>
      </div>
    </div>
  );
}
