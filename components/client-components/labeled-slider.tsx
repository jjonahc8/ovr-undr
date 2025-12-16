"use client";

import { useEffect, useState } from "react";

interface LabeledSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export default function LabeledSlider({
  label,
  min,
  max,
  step = 1,
  defaultValue = min,
  onChange,
}: LabeledSliderProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const [value, setValue] = useState(() => clamp(defaultValue));

  // Keep slider value valid if min/max/defaultValue changes after mount
  useEffect(() => {
    const next = clamp(defaultValue);
    setValue(next);
    onChange?.(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, defaultValue]);

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
          onChange={(e) => {
            const next = Number(e.target.value);
            setValue(next);
            onChange?.(next);
          }}
          className="w-full accent-white"
        />
        <span className="text-lg font-bold">{value}</span>
      </div>
    </div>
  );
}
