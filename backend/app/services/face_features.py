"""Facial feature color extraction — ported from koreai's model.py.

koreai used the legacy `mp.solutions.face_mesh.FaceMesh`; MediaPipe removed
that API in the versions that support modern Python, so this uses the Tasks
`FaceLandmarker` instead. The model topology is identical (478 landmarks,
same indices), so the sampling logic is a direct port.
"""

import threading

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks.python import BaseOptions, vision

from app.core.config import get_settings

# Same landmark indices as koreai (Eye = left iris center, Hair = eyebrow
# used as a hairline proxy, Cheek = skin sample point, Lips = lip center).
FEATURE_LANDMARKS = {
    "Eye": 468,
    "Lips": 13,
    "Cheek": 205,
    "Hair": 295,
}

_landmarker = None
_lock = threading.Lock()


def _get_landmarker() -> vision.FaceLandmarker:
    global _landmarker
    if _landmarker is None:
        options = vision.FaceLandmarkerOptions(
            base_options=BaseOptions(
                model_asset_path=str(get_settings().ml_models_dir / "face_landmarker.task")
            ),
            running_mode=vision.RunningMode.IMAGE,
            num_faces=1,
            min_face_detection_confidence=0.5,
        )
        _landmarker = vision.FaceLandmarker.create_from_options(options)
    return _landmarker


def sample_feature_color(frame, landmarks, idx, region_size=6):
    """Average BGR over a (2*region_size)^2 patch around a landmark.

    Same as koreai's sample_feature_color, plus bounds clamping so
    landmarks near the image edge can't produce an empty patch.
    """
    h, w, _ = frame.shape
    x = int(landmarks[idx].x * w)
    y = int(landmarks[idx].y * h)
    y0, y1 = max(0, y - region_size), min(h, y + region_size)
    x0, x1 = max(0, x - region_size), min(w, x + region_size)
    patch = frame[y0:y1, x0:x1]
    if patch.size == 0:
        return None
    return np.average(np.average(patch, axis=0), axis=0)


class NoFaceDetectedError(Exception):
    """Raised when MediaPipe finds no face in the uploaded image."""


def extract_feature_colors(image_bytes: bytes) -> dict:
    """Decode an uploaded image and return {'Eye'|'Lips'|'Cheek'|'Hair': BGR array}."""
    buffer = np.frombuffer(image_bytes, dtype=np.uint8)
    frame = cv2.imdecode(buffer, cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Could not decode image")

    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)

    with _lock:  # the landmarker is not thread-safe
        result = _get_landmarker().detect(mp_image)

    if not result.face_landmarks:
        raise NoFaceDetectedError("No face detected in the image")

    landmarks = result.face_landmarks[0]
    feature_colors = {}
    for feature, idx in FEATURE_LANDMARKS.items():
        color_bgr = sample_feature_color(frame, landmarks, idx)
        if color_bgr is None:
            raise NoFaceDetectedError(f"Could not sample {feature} color")
        feature_colors[feature] = color_bgr
    return feature_colors
