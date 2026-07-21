"""Editorial + rule-based styling recommendations.

Moves the season/undertone copy and fashion tips server-side. Two of the four
tips are genuinely computed from the user's own analysis (undertone-driven
jewellery, photo-derived contrast, and their generated palette) rather than
looked up — so the advice is "recommended by the backend", not static text.
"""

# --- Static editorial profiles (ported from the old frontend seasonContent) ---

SEASON_PROFILES = {
    "spring": {
        "title": "Spring",
        "tagline": "Fresh, warm and luminous",
        "description": (
            "Your coloring is bright and warm, like the first weeks of spring. "
            "Clear, sunlit shades bring out your natural glow, while heavy dark "
            "tones can overpower you."
        ),
        "leadTip": {
            "title": "Lead with light, warm brights",
            "text": "Coral, peach, golden yellow and fresh greens mirror your natural warmth.",
        },
    },
    "summer": {
        "title": "Summer",
        "tagline": "Soft, cool and elegant",
        "description": (
            "Your coloring is cool and delicate, like a hazy summer sky. Muted, "
            "powdery shades harmonise with you, while loud saturated colors "
            "compete with your softness."
        ),
        "leadTip": {
            "title": "Stay soft and muted",
            "text": "Powder blue, lavender, dusty rose and sage keep you luminous.",
        },
    },
    "autumn": {
        "title": "Autumn",
        "tagline": "Rich, warm and earthy",
        "description": (
            "Your coloring is warm and deep, like autumn foliage. Earthy, spiced "
            "shades make your skin glow, while icy pastels and stark black can "
            "wash you out."
        ),
        "leadTip": {
            "title": "Embrace earth tones",
            "text": "Rust, olive, camel and chocolate are your power colors for everyday wear.",
        },
    },
    "winter": {
        "title": "Winter",
        "tagline": "Bold, cool and striking",
        "description": (
            "Your coloring is cool with high contrast, like a crisp winter night. "
            "Jewel tones and sharp neutrals make you striking, while dusty earth "
            "tones dull your natural drama."
        ),
        "leadTip": {
            "title": "Own the jewel tones",
            "text": "Emerald, sapphire, fuchsia and true red were made for you.",
        },
    },
}

UNDERTONE_PROFILES = {
    "warm": {
        "title": "Warm",
        "descriptor": "Golden & peachy",
        "note": (
            "Your skin carries golden, peachy hues — gold jewellery and "
            "earth-toned colors harmonise with you naturally."
        ),
        "jewelryTip": {
            "title": "Reach for gold",
            "text": "Gold and warm metallic jewellery flatter your golden undertone far more than silver.",
        },
    },
    "cool": {
        "title": "Cool",
        "descriptor": "Pink & blue",
        "note": (
            "Your skin carries pink and blue hues — silver jewellery, jewel "
            "tones and cool pastels suit you best."
        ),
        "jewelryTip": {
            "title": "Reach for silver",
            "text": "Silver and white-gold jewellery echo your cool undertone; skip yellow gold near your face.",
        },
    },
    "neutral": {
        "title": "Neutral",
        "descriptor": "Balanced",
        "note": (
            "Your skin balances warm and cool — both gold and silver work, and "
            "you can wear an unusually wide color range."
        ),
        "jewelryTip": {
            "title": "Both metals work",
            "text": "Your balanced undertone lets you wear gold and silver freely — even mixed together.",
        },
    },
}

# Luminance gap above which hair/skin read as high-contrast.
_CONTRAST_THRESHOLD = 55


def _luminance(rgb) -> float:
    r, g, b = rgb
    return 0.299 * r + 0.587 * g + 0.114 * b


def _contrast_tip(skin_rgb, hair_rgb) -> dict:
    """Tip derived from the hair-vs-skin luminance gap in the user's photo."""
    gap = abs(_luminance(hair_rgb) - _luminance(skin_rgb))
    if gap >= _CONTRAST_THRESHOLD:
        return {
            "title": "Play up your natural contrast",
            "text": (
                "Your hair and skin differ strongly in depth, so high-contrast "
                "outfits — a deep shade against a crisp light one — echo your "
                "natural drama."
            ),
        }
    return {
        "title": "Keep it tonal",
        "text": (
            "Your hair and skin sit close in depth, so soft tonal outfits in "
            "related shades flatter you more than stark black-and-white."
        ),
    }


def _palette_tip(personalized_colors) -> dict:
    """Tip that references the user's own generated palette colors."""
    names = [c["name"] for c in personalized_colors[:2]] or ["your palette"]
    joined = " and ".join(names)
    return {
        "title": f"Build around {joined}",
        "text": (
            f"Your personalized palette leans into shades like {joined} — anchor "
            "an outfit with one and accent with the other."
        ),
    }


def build_recommendations(
    season: str,
    undertone: str,
    skin_rgb,
    hair_rgb,
    personalized_colors,
) -> dict:
    """Compose season/undertone profiles and four fashion tips."""
    season_profile = SEASON_PROFILES[season]
    undertone_profile = UNDERTONE_PROFILES[undertone]

    fashion_tips = [
        season_profile["leadTip"],       # season-specific (static)
        undertone_profile["jewelryTip"],  # undertone-driven
        _contrast_tip(skin_rgb, hair_rgb),  # computed from the photo
        _palette_tip(personalized_colors),  # from the user's generated palette
    ]

    return {
        "seasonProfile": {
            "title": season_profile["title"],
            "tagline": season_profile["tagline"],
            "description": season_profile["description"],
        },
        "undertoneProfile": {
            "title": undertone_profile["title"],
            "descriptor": undertone_profile["descriptor"],
            "note": undertone_profile["note"],
        },
        "fashionTips": fashion_tips,
    }
