"""Registry of the legacy result-CSV mappings.

Ordered so that a full run loads the small, simple modules first: if something
is wrong with the environment it surfaces on a 2,700-row table rather than
after 8,000 laboratory inserts.
"""

from __future__ import annotations

from common import ModuleSpec

from . import (
    hiv,
    immunology,
    landbase,
    laboratory,
    mlc,
    panama,
    psychology,
    seabase,
    ultrasound,
    xray,
)

REGISTRY: dict[str, ModuleSpec] = {
    spec.name: spec
    for spec in (
        xray.SPEC,
        ultrasound.SPEC,
        hiv.SPEC,
        immunology.SPEC,
        psychology.SPEC,
        laboratory.SPEC,
        mlc.SPEC,
        landbase.SPEC,
        seabase.SPEC,
        panama.SPEC,
    )
}

ALL_MODULES = list(REGISTRY)
