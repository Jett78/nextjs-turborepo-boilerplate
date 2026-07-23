"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HslColorPickerProps {
  value?: string;
  onChange: (hsl: string) => void;
  label?: string;
}

function parseHsl(hsl?: string): { h: number; s: number; l: number } {
  if (!hsl) return { h: 221, s: 83, l: 53 };
  const parts = hsl.replace(/%/g, "").split(" ");
  return {
    h: parseFloat(parts[0]) || 0,
    s: parseFloat(parts[1]) || 0,
    l: parseFloat(parts[2]) || 0,
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function HslColorPicker({ value, onChange, label }: HslColorPickerProps) {
  const parsed = parseHsl(value);
  const [hexInput, setHexInput] = useState(() => hslToHex(parsed.h, parsed.s, parsed.l));

  const handleSliderChange = useCallback(
    (channel: "h" | "s" | "l", val: number) => {
      const current = parseHsl(value);
      current[channel] = val;
      const hsl = `${current.h} ${current.s}% ${current.l}%`;
      const hex = hslToHex(current.h, current.s, current.l);
      setHexInput(hex);
      onChange(hsl);
    },
    [value, onChange]
  );

  const handleHexChange = (hex: string) => {
    setHexInput(hex);
    if (/^#?[0-9a-fA-F]{6}$/.test(hex)) {
      const hsl = hexToHsl(hex);
      onChange(`${hsl.h} ${hsl.s}% ${hsl.l}%`);
    }
  };


  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-md border shrink-0"
          style={{ backgroundColor: `hsl(${parsed.h}, ${parsed.s}%, ${parsed.l}%)` }}
        />
        <Input
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#000000"
          className="w-28 font-mono text-sm"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {Math.round(parsed.h)}° {parsed.s}% {parsed.l}%
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="w-8 text-xs">H</Label>
          <input
            type="range"
            min={0}
            max={360}
            value={parsed.h}
            onChange={(e) => handleSliderChange("h", Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                hsl(0,${parsed.s}%,${parsed.l}%), 
                hsl(60,${parsed.s}%,${parsed.l}%), 
                hsl(120,${parsed.s}%,${parsed.l}%), 
                hsl(180,${parsed.s}%,${parsed.l}%), 
                hsl(240,${parsed.s}%,${parsed.l}%), 
                hsl(300,${parsed.s}%,${parsed.l}%), 
                hsl(360,${parsed.s}%,${parsed.l}%))`,
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="w-8 text-xs">S</Label>
          <input
            type="range"
            min={0}
            max={100}
            value={parsed.s}
            onChange={(e) => handleSliderChange("s", Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                hsl(${parsed.h},0%,${parsed.l}%), 
                hsl(${parsed.h},100%,${parsed.l}%))`,
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="w-8 text-xs">L</Label>
          <input
            type="range"
            min={0}
            max={100}
            value={parsed.l}
            onChange={(e) => handleSliderChange("l", Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                hsl(${parsed.h},${parsed.s}%,0%), 
                hsl(${parsed.h},${parsed.s}%,50%), 
                hsl(${parsed.h},${parsed.s}%,100%))`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
