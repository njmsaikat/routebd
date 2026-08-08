from decimal import Decimal

import pytest

from .models import FareRule
from .services import calculate_fare


@pytest.mark.django_db
def test_calculate_fare_rounds_up_to_step_and_floors_at_minimum():
    FareRule.objects.create(
        route_group=None,
        bus_type="local",
        base_fare=Decimal("10"),
        per_km_rate=Decimal("2.20"),
        min_fare=Decimal("10"),
        rounding_step=Decimal("1"),
    )

    fare = calculate_fare(Decimal("5"), "local")

    assert fare == Decimal("21")


@pytest.mark.django_db
def test_calculate_fare_never_goes_below_minimum():
    FareRule.objects.create(
        route_group=None,
        bus_type="ac",
        base_fare=Decimal("30"),
        per_km_rate=Decimal("4.00"),
        min_fare=Decimal("35"),
        rounding_step=Decimal("5"),
    )

    fare = calculate_fare(Decimal("0.5"), "ac")

    assert fare == Decimal("35")
