import json
from decimal import Decimal

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.buses.models import Bus
from apps.companies.models import Company
from apps.fares.models import FareRule
from apps.routes.models import Route, RouteGroup, RouteStop
from apps.stops.models import Area, City, Stop

SEED_FILE = settings.BASE_DIR / "seed_data" / "dhaka_routes.json"


class Command(BaseCommand):
    help = "Load the hand-curated Dhaka seed dataset (idempotent, safe to re-run)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            default=str(SEED_FILE),
            help="Path to the seed JSON file (defaults to seed_data/dhaka_routes.json).",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        with open(options["file"], encoding="utf-8") as f:
            data = json.load(f)

        city = self._load_city(data["city"])
        areas = self._load_areas(data["areas"], city)
        self._load_stops(data["stops"], city, areas)
        companies = self._load_companies(data["companies"])
        buses = self._load_buses(data["buses"], companies)
        self._load_route_groups(data["route_groups"], buses)
        self._load_fare_rules(data["fare_rules"])

        self.stdout.write(self.style.SUCCESS("Seed data loaded successfully."))

    def _load_city(self, entry):
        city, _ = City.objects.update_or_create(
            slug=entry["slug"], defaults={"name": entry["name"], "is_active": True}
        )
        self.stdout.write(f"City: {city.name}")
        return city

    def _load_areas(self, entries, city):
        areas = {}
        for entry in entries:
            area, _ = Area.objects.update_or_create(
                city=city,
                slug=entry["slug"],
                defaults={
                    "name": entry["name"],
                    "latitude": entry["latitude"],
                    "longitude": entry["longitude"],
                },
            )
            areas[entry["slug"]] = area
        self.stdout.write(f"Areas: {len(areas)}")
        return areas

    def _load_stops(self, entries, city, areas):
        count = 0
        for entry in entries:
            area = areas.get(entry["area_slug"]) if entry.get("area_slug") else None
            Stop.objects.update_or_create(
                city=city,
                slug=entry["slug"],
                defaults={
                    "name": entry["name"],
                    "area": area,
                    "latitude": entry["latitude"],
                    "longitude": entry["longitude"],
                    "is_active": True,
                },
            )
            count += 1
        self.stdout.write(f"Stops: {count}")

    def _load_companies(self, entries):
        companies = {}
        for entry in entries:
            company, _ = Company.objects.update_or_create(
                slug=entry["slug"], defaults={"name": entry["name"], "is_active": True}
            )
            companies[entry["slug"]] = company
        self.stdout.write(f"Companies: {len(companies)}")
        return companies

    def _load_buses(self, entries, companies):
        buses = {}
        for entry in entries:
            bus, _ = Bus.objects.update_or_create(
                slug=entry["slug"],
                defaults={
                    "name": entry["name"],
                    "company": companies[entry["company_slug"]],
                    "bus_type": entry["bus_type"],
                    "color_hex": entry["color_hex"],
                    "is_active": True,
                },
            )
            buses[entry["slug"]] = bus
        self.stdout.write(f"Buses: {len(buses)}")
        return buses

    def _load_route_groups(self, entries, buses):
        stops_by_slug = {s.slug: s for s in Stop.objects.all()}
        group_count = 0
        route_count = 0

        for entry in entries:
            group, _ = RouteGroup.objects.update_or_create(
                slug=entry["slug"],
                defaults={"name": entry["name"], "bus": buses[entry["bus_slug"]]},
            )
            group_count += 1

            outbound_stops = entry["stops"]
            total_distance = Decimal(str(outbound_stops[-1]["distance_from_start_km"]))

            route_count += self._load_direction(
                group,
                direction=Route.Direction.OUTBOUND,
                origin_label=entry["origin_label"],
                destination_label=entry["destination_label"],
                distance_km=total_distance,
                avg_speed_kmph=entry["avg_speed_kmph"],
                stop_entries=outbound_stops,
                stops_by_slug=stops_by_slug,
            )

            inbound_stops = [
                {
                    "stop_slug": s["stop_slug"],
                    "distance_from_start_km": total_distance
                    - Decimal(str(s["distance_from_start_km"])),
                }
                for s in reversed(outbound_stops)
            ]
            route_count += self._load_direction(
                group,
                direction=Route.Direction.INBOUND,
                origin_label=entry["destination_label"],
                destination_label=entry["origin_label"],
                distance_km=total_distance,
                avg_speed_kmph=entry["avg_speed_kmph"],
                stop_entries=inbound_stops,
                stops_by_slug=stops_by_slug,
            )

        self.stdout.write(f"Route groups: {group_count}, Routes: {route_count}")

    def _load_direction(
        self,
        group,
        direction,
        origin_label,
        destination_label,
        distance_km,
        avg_speed_kmph,
        stop_entries,
        stops_by_slug,
    ):
        route, _ = Route.objects.update_or_create(
            route_group=group,
            direction=direction,
            defaults={
                "origin_label": origin_label,
                "destination_label": destination_label,
                "distance_km": distance_km,
                "avg_speed_kmph": avg_speed_kmph,
                "is_active": True,
            },
        )
        route.route_stops.all().delete()
        RouteStop.objects.bulk_create(
            [
                RouteStop(
                    route=route,
                    stop=stops_by_slug[s["stop_slug"]],
                    sequence=i + 1,
                    distance_from_start_km=s["distance_from_start_km"],
                )
                for i, s in enumerate(stop_entries)
            ]
        )
        return 1

    def _load_fare_rules(self, entries):
        count = 0
        for entry in entries:
            FareRule.objects.update_or_create(
                route_group=None,
                bus_type=entry["bus_type"],
                defaults={
                    "base_fare": entry["base_fare"],
                    "per_km_rate": entry["per_km_rate"],
                    "min_fare": entry["min_fare"],
                    "rounding_step": entry["rounding_step"],
                },
            )
            count += 1
        self.stdout.write(f"Fare rules: {count}")
