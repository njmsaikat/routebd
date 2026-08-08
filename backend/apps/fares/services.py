from decimal import ROUND_UP, Decimal

from .models import FareRule


def get_fare_rule(bus_type: str, route_group=None) -> FareRule | None:
    if route_group is not None:
        rule = FareRule.objects.filter(route_group=route_group, bus_type=bus_type).first()
        if rule:
            return rule
    return FareRule.objects.filter(route_group__isnull=True, bus_type=bus_type).first()


def calculate_fare(distance_km, bus_type: str, route_group=None) -> Decimal:
    rule = get_fare_rule(bus_type, route_group)
    if rule is None:
        return Decimal("0.00")

    distance = Decimal(str(distance_km))
    raw_fare = rule.base_fare + (rule.per_km_rate * distance)

    step = rule.rounding_step or Decimal("1")
    rounded = (raw_fare / step).to_integral_value(rounding=ROUND_UP) * step

    return max(rounded, rule.min_fare)
