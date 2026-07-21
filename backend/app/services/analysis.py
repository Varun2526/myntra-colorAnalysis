"""Orchestrates the full koreai pipeline: image bytes -> analysis response."""

from app.models.schemas import AnalysisResponse
from app.services import palettes
from app.services.color_analysis import (
    prepare_feature_data,
    predict_season,
    predict_undertone,
)
from app.services.face_features import extract_face_features
from app.services.recommendations import build_recommendations


def _bgr_to_feature(color_bgr) -> dict:
    rgb = [int(color_bgr[2]), int(color_bgr[1]), int(color_bgr[0])]
    return {"hex": palettes.rgb_to_hex(rgb), "rgb": rgb}


def analyze_image(image_bytes: bytes) -> AnalysisResponse:
    feature_colors, face_position = extract_face_features(image_bytes)
    features_df = prepare_feature_data(feature_colors)

    undertone, undertone_confidence = predict_undertone(features_df)
    season, season_confidence = predict_season(features_df)

    # koreai uses the cheek color as the skin tone for palette generation.
    cheek = feature_colors["Cheek"]
    skin_rgb = [int(cheek[2]), int(cheek[1]), int(cheek[0])]
    hair = feature_colors["Hair"]
    hair_rgb = [int(hair[2]), int(hair[1]), int(hair[0])]

    personalized_palette = palettes.generate_clothing_colors(
        skin_rgb, season, undertone
    )
    recommendations = build_recommendations(
        season, undertone, skin_rgb, hair_rgb, personalized_palette
    )

    return AnalysisResponse(
        season=season,
        undertone=undertone,
        confidence={"season": season_confidence, "undertone": undertone_confidence},
        features={
            "eye": _bgr_to_feature(feature_colors["Eye"]),
            "hair": _bgr_to_feature(feature_colors["Hair"]),
            "skin": _bgr_to_feature(feature_colors["Cheek"]),
            "lips": _bgr_to_feature(feature_colors["Lips"]),
        },
        facePosition=face_position,
        seasonProfile=recommendations["seasonProfile"],
        undertoneProfile=recommendations["undertoneProfile"],
        fashionTips=recommendations["fashionTips"],
        seasonalPalette=palettes.seasonal_palette(season),
        personalizedPalette=personalized_palette,
        outfitColors=palettes.outfit_colors(season),
    )
