"""Undertone/season prediction — ported unchanged from koreai's model.py.

Uses the original pickled kNN pipelines (no retraining). The DataFrame
column names and order must match what the pipelines were fit on.
"""

from functools import lru_cache

import joblib
import pandas as pd

from app.core.config import get_settings


@lru_cache
def _pipelines():
    models_dir = get_settings().ml_models_dir
    undertone = joblib.load(models_dir / "undertone_classifier.pkl")
    season = joblib.load(models_dir / "season_classifier.pkl")
    return undertone, season


def prepare_feature_data(feature_colors: dict) -> pd.DataFrame:
    """BGR feature colors -> the 12-column RGB DataFrame the models expect."""
    data = {
        "Eye_R": [int(feature_colors["Eye"][2])],
        "Eye_G": [int(feature_colors["Eye"][1])],
        "Eye_B": [int(feature_colors["Eye"][0])],
        "Lips_R": [int(feature_colors["Lips"][2])],
        "Lips_G": [int(feature_colors["Lips"][1])],
        "Lips_B": [int(feature_colors["Lips"][0])],
        "Cheek_R": [int(feature_colors["Cheek"][2])],
        "Cheek_G": [int(feature_colors["Cheek"][1])],
        "Cheek_B": [int(feature_colors["Cheek"][0])],
        "Hair_R": [int(feature_colors["Hair"][2])],
        "Hair_G": [int(feature_colors["Hair"][1])],
        "Hair_B": [int(feature_colors["Hair"][0])],
    }
    return pd.DataFrame(data)


def predict_undertone(features_df: pd.DataFrame) -> tuple[str, float]:
    """Returns (lowercase label, confidence) e.g. ('warm', 0.6)."""
    pipeline, _ = _pipelines()
    label = pipeline.predict(features_df)[0]
    confidence = float(pipeline.predict_proba(features_df)[0].max())
    return label.lower(), confidence


def predict_season(features_df: pd.DataFrame) -> tuple[str, float]:
    """Returns (lowercase label, confidence) e.g. ('autumn', 0.4)."""
    _, pipeline = _pipelines()
    label = pipeline.predict(features_df)[0]
    confidence = float(pipeline.predict_proba(features_df)[0].max())
    return label.lower(), confidence
