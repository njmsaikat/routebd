import L from "leaflet";
import { CircleMarker, Popup } from "react-leaflet";

interface StopMarkerProps {
  lat: number;
  lng: number;
  name: string;
  color?: string;
}

export function StopMarker({ lat, lng, name, color = "#2563eb" }: StopMarkerProps) {
  return (
    <CircleMarker
      center={[lat, lng] as L.LatLngExpression}
      radius={6}
      pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 2 }}
    >
      <Popup>{name}</Popup>
    </CircleMarker>
  );
}
