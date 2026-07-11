"use client";

import { useState } from "react";

type HighlightColorFieldProps = {
  defaultValue?: string | null;
};

const fallbackColor = "#55d3e8";
const hexPattern = "^#[0-9A-Fa-f]{6}$";

export function HighlightColorField({
  defaultValue,
}: HighlightColorFieldProps) {
  const [color, setColor] = useState(defaultValue ?? "");
  const pickerColor = hexPatternMatches(color) ? color : fallbackColor;

  return (
    <label className="grid gap-2 text-sm">
      <span className="font-lilita">Name Highlight Marker Color</span>
      <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <input
          type="color"
          value={pickerColor}
          onChange={(event) => setColor(event.target.value)}
          className="h-11 w-16 cursor-pointer rounded-full border border-black/15 bg-white p-1"
          aria-label="Pick highlight marker color"
        />
        <input
          name="highlight_marker_color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          pattern={hexPattern}
          placeholder="#55d3e8"
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none focus:border-black"
        />
        <button
          type="button"
          onClick={() => setColor("")}
          className="font-lilita h-11 rounded-full border border-black/15 bg-white px-4 transition hover:border-black"
        >
          Clear
        </button>
      </div>
      <span className="text-xs leading-5 text-black/45">
        Optional. Leave empty to show the console name without a marker line.
      </span>
    </label>
  );
}

function hexPatternMatches(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}
