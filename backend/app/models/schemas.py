"""Response schemas for the color-analysis API.

Field names intentionally match the frontend's mock JSON
(frontend/src/mock/colorAnalysis.json) so the UI needs zero changes.
"""

from pydantic import BaseModel


class FeatureColor(BaseModel):
    hex: str
    rgb: list[int]


class CapturedFeatures(BaseModel):
    eye: FeatureColor
    hair: FeatureColor
    skin: FeatureColor
    lips: FeatureColor


class Confidence(BaseModel):
    season: float
    undertone: float


class PaletteColor(BaseModel):
    name: str
    hex: str


class FacePosition(BaseModel):
    """Normalized (0-1) draping geometry, independent of image resolution."""

    chinY: float
    faceWidth: float


class AnalysisResponse(BaseModel):
    season: str
    undertone: str
    confidence: Confidence
    features: CapturedFeatures
    facePosition: FacePosition
    seasonalPalette: list[PaletteColor]
    personalizedPalette: list[PaletteColor]
    outfitColors: list[PaletteColor]
