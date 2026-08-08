"use client";

import type { LatLngBoundsExpression } from "leaflet";
import { Fragment } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

import type { GeometryPoint } from "@/lib/types";

import { AnimatedBusMarker } from "./AnimatedBusMarker";
import { StopMarker } from "./StopMarker";

export interface MapLeg {
  geometry: GeometryPoint[];
  color: string;
}

interface RouteMapProps {
  legs: MapLeg[];
  heightClassName?: string;
}

const DHAKA_CENTER: [number, number] = [23.78, 90.39];

export function RouteMap({ legs, heightClassName = "h-96" }: RouteMapProps) {
  const allPoints = legs.flatMap((leg) => leg.geometry.map((p) => [p.lat, p.lng] as [number, number]));
  const bounds: LatLngBoundsExpression | undefined = allPoints.length > 1 ? allPoints : undefined;

  return (
    <div className={`${heightClassName} w-full overflow-hidden rounded-2xl`}>
      <MapContainer
        center={allPoints[0] ?? DHAKA_CENTER}
        zoom={13}
        bounds={bounds}
        boundsOptions={{ padding: [30, 30] }}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {legs.map((leg, legIndex) => (
          <Fragment key={legIndex}>
            <Polyline
              positions={leg.geometry.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: leg.color, weight: 4 }}
            />
            {leg.geometry.map((point) => (
              <StopMarker
                key={point.stop_id}
                lat={point.lat}
                lng={point.lng}
                name={point.name}
                color={leg.color}
              />
            ))}
            {leg.geometry.length > 1 && (
              <AnimatedBusMarker
                points={leg.geometry.map((p) => [p.lat, p.lng])}
                color={leg.color}
              />
            )}
          </Fragment>
        ))}
      </MapContainer>
    </div>
  );
}
