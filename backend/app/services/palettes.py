"""Palette generation — ported from koreai's model.py.

`generate_clothing_colors` keeps koreai's harmony math (analogous /
complementary / triadic hues with per-season lightness & saturation and an
undertone shift). Two deliberate fixes vs. the original:
- results are clipped to the valid 0-255 RGB range (the original applied
  `% 360`, which wraps channel values above 255 to wrong colors), and
- the random permutation is removed so responses are deterministic.
"""

import colorsys

import numpy as np

# koreai's seasonal palettes, with display names added for the UI.
SEASONAL_PALETTES = {
    "winter": [
        ("Berry", "#8B1F60"), ("Deep Teal", "#0A6C70"), ("Ice Blue", "#C4E9FC"),
        ("Periwinkle", "#C1C8E4"), ("Rose Pink", "#ED819B"), ("Plum", "#742872"),
    ],
    "summer": [
        ("Powder Blue", "#A7C7E7"), ("Lilac", "#C8A2C8"), ("Lavender", "#E6E6FA"),
        ("Blush", "#FFB6C1"), ("Mint", "#98FF98"), ("Honeydew", "#F0FFF0"),
    ],
    "autumn": [
        ("Deep Teal", "#2A635F"), ("Terracotta", "#D08465"), ("Crimson", "#9D222D"),
        ("Warm Ivory", "#F5ECE4"), ("Rosewood", "#BF6766"), ("Olive", "#6C724C"),
    ],
    "spring": [
        ("Golden", "#FFD700"), ("Salmon", "#FFA07A"), ("Pale Green", "#98FB98"),
        ("Sky Blue", "#87CEFA"), ("Hot Pink", "#FF69B4"), ("Lemon", "#FFFACD"),
    ],
}

OUTFIT_COLORS = {
    "winter": [
        ("Black", "#1A1A1A"), ("Pure White", "#F8F8F8"), ("Emerald", "#0F6B4F"),
        ("Sapphire", "#1F4E9C"), ("Fuchsia", "#B5338A"), ("True Red", "#C0182B"),
        ("Charcoal", "#3C3F46"), ("Plum", "#5C2A5E"),
    ],
    "summer": [
        ("Dusty Rose", "#C48B9F"), ("Powder Blue", "#8FB3D9"), ("Sage", "#9CAF88"),
        ("Lavender", "#9B8AB8"), ("Soft White", "#F2F0EB"), ("Grey Mist", "#AEB4BD"),
        ("Mauve", "#996E7E"), ("Denim", "#5876A3"),
    ],
    "autumn": [
        ("Rust", "#A84C32"), ("Mustard", "#C99425"), ("Olive", "#6B722F"),
        ("Chocolate", "#5A3A28"), ("Cream", "#F2E5D0"), ("Teal", "#2A635F"),
        ("Burgundy", "#6E2231"), ("Camel", "#B98A5C"),
    ],
    "spring": [
        ("Coral", "#F0704F"), ("Golden Yellow", "#E8B33C"), ("Fresh Green", "#7CB65C"),
        ("Turquoise", "#3BAFBF"), ("Peach", "#F5A47E"), ("Ivory", "#F7F0DE"),
        ("Warm Pink", "#EF6E92"), ("Tan", "#C89B6C"),
    ],
}

# (lightness, saturation) targets per season — koreai's tuning.
_SEASON_OPTIONS = {
    "summer": lambda s: (0.75, 0.55 * (1 - s)),
    "autumn": lambda s: (0.35, 0.95 * (1 - s)),
    "winter": lambda s: (0.40, 0.90 * (1 - s)),
    "spring": lambda s: (0.50, 0.85 * (1 - s)),
}

_UNDERTONE_SHIFT = {
    "warm": np.array([45, 0, 0]),
    "neutral": np.array([0, 20, 0]),
    "cool": np.array([0, 0, 45]),
}

_HUE_NAMES = [
    (15, "Rose"), (40, "Coral"), (60, "Amber"), (75, "Gold"),
    (100, "Lime"), (140, "Jade"), (170, "Olive"), (195, "Teal"),
    (215, "Cyan"), (235, "Azure"), (255, "Sky"), (275, "Indigo"),
    (295, "Violet"), (320, "Plum"), (345, "Orchid"), (360, "Rose"),
]


def _name_for(rgb: np.ndarray) -> str:
    r, g, b = (float(c) / 255.0 for c in rgb)
    h, l, _ = colorsys.rgb_to_hls(r, g, b)
    hue_deg = h * 360
    base = next(name for limit, name in _HUE_NAMES if hue_deg <= limit)
    tone = "Deep" if l < 0.35 else "Soft" if l > 0.65 else "Rich"
    return f"{tone} {base}"


def rgb_to_hex(rgb) -> str:
    r, g, b = (int(c) for c in rgb)
    return f"#{r:02X}{g:02X}{b:02X}"


def generate_clothing_colors(skin_rgb, season: str, undertone: str) -> list[dict]:
    """koreai's personalized palette: 9 colors from the skin tone's harmonies."""
    r, g, b = (x / 255.0 for x in skin_rgb)
    h, l, s = colorsys.rgb_to_hls(r, g, b)

    hue_deg = h * 360
    analogous = [(hue_deg + 30) % 360, (hue_deg - 30) % 360]
    complementary = [(hue_deg + 150) % 360, (hue_deg + 180) % 360, (hue_deg + 210) % 360]
    triadic = [(hue_deg + 120) % 360, (hue_deg + 240) % 360]
    # koreai used the 7 hues above; ±60° split-analogous added to reach the
    # 9-color palette the product spec asks for.
    split_analogous = [(hue_deg + 60) % 360, (hue_deg - 60) % 360]
    all_hues = analogous + complementary + triadic + split_analogous

    lightness, saturation = _SEASON_OPTIONS[season](s)
    transformation = np.array([45 * (1 - l), 0, 45 * l])

    results = [
        colorsys.hls_to_rgb(hue / 360, lightness, saturation) for hue in all_hues
    ]
    colors = np.clip(
        np.array(results) * 255 + _UNDERTONE_SHIFT[undertone] + transformation,
        0,
        255,
    ).astype(int)

    return [{"name": _name_for(c), "hex": rgb_to_hex(c)} for c in colors]


def seasonal_palette(season: str) -> list[dict]:
    return [{"name": name, "hex": hex_} for name, hex_ in SEASONAL_PALETTES[season]]


def outfit_colors(season: str) -> list[dict]:
    return [{"name": name, "hex": hex_} for name, hex_ in OUTFIT_COLORS[season]]
