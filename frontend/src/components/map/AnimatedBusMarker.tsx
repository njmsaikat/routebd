"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";

interface AnimatedBusMarkerProps {
  points: [number, number][];
  color?: string;
  durationMs?: number;
}

const busIcon = (color: string) =>
  L.divIcon({
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.4);font-size:12px;">🚌</div>`,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

function interpolate(points: [number, number][], t: number): [number, number] {
  if (points.length === 1) return points[0];
  const segment = t * (points.length - 1);
  const i = Math.min(Math.floor(segment), points.length - 2);
  const frac = segment - i;
  const [lat1, lng1] = points[i];
  const [lat2, lng2] = points[i + 1];
  return [lat1 + (lat2 - lat1) * frac, lng1 + (lng2 - lng1) * frac];
}

export function AnimatedBusMarker({ points, color = "#2563eb", durationMs = 6000 }: AnimatedBusMarkerProps) {
  const [position, setPosition] = useState<[number, number]>(points[0]);

  useEffect(() => {
    if (points.length < 2) return;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const elapsed = (now - start) % durationMs;
      const t = elapsed / durationMs;
      setPosition(interpolate(points, t));
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [points, durationMs]);

  return <Marker position={position} icon={busIcon(color)} />;
}
