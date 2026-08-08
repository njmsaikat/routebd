export interface Company {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  phone: string;
  description: string;
  is_active: boolean;
}

export interface Bus {
  id: number;
  name: string;
  slug: string;
  company: Company;
  bus_type: "local" | "sitting" | "ac";
  color_hex: string;
  image_url: string;
  operating_hours_start: string;
  operating_hours_end: string;
  is_active: boolean;
}

export interface Stop {
  id: number;
  name: string;
  slug: string;
  city: number;
  area: number | null;
  area_name: string | null;
  latitude: string;
  longitude: string;
  landmarks_note: string;
  is_active: boolean;
}

export interface NearbyStop extends Stop {
  distance_km: number;
}

export interface RouteStopEntry {
  id: number;
  stop: Stop;
  sequence: number;
  distance_from_start_km: string;
}

export interface RouteDetail {
  id: number;
  direction: "outbound" | "inbound";
  origin_label: string;
  destination_label: string;
  distance_km: string;
  avg_speed_kmph: string;
  is_active: boolean;
  route_stops: RouteStopEntry[];
}

export interface RouteGroup {
  id: number;
  name: string;
  slug: string;
  bus: Bus;
  routes: RouteDetail[];
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface GeometryPoint {
  stop_id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface RouteMetaSummary {
  route_id: number;
  route_group_id: number;
  route_group_name: string;
  direction: "outbound" | "inbound";
  bus_name: string;
  bus_type: "local" | "sitting" | "ac";
  color_hex: string;
  company_name: string;
}

export interface DirectJourneyResult extends RouteMetaSummary {
  distance_km: number;
  stops_count: number;
  duration_min: number;
  fare: number;
  geometry: GeometryPoint[];
  from_stop: { id: number; name: string };
  to_stop: { id: number; name: string };
  walking_from_km: number;
  walking_to_km: number;
}

export interface TransferLeg extends RouteMetaSummary {
  distance_km: number;
  stops_count: number;
  duration_min: number;
  fare: number;
  geometry: GeometryPoint[];
}

export interface TransferJourneyResult {
  transfer_stop_id: number;
  transfer_stop_name: string;
  total_distance_km: number;
  total_duration_min: number;
  total_fare: number;
  leg1: TransferLeg;
  leg2: TransferLeg;
  from_stop: { id: number; name: string };
  to_stop: { id: number; name: string };
  walking_from_km: number;
  walking_to_km: number;
}

export interface JourneySearchResponse {
  resolved: boolean;
  direct: DirectJourneyResult[];
  transfers: TransferJourneyResult[];
  message?: string;
}

export interface AutocompleteResult {
  type: "stop" | "area" | "bus";
  id: number;
  label: string;
  similarity: number;
}

export interface FareCalculationResponse {
  direct: boolean;
  options: (DirectJourneyResult | TransferJourneyResult)[];
  cheapest_fare: number | null;
}
