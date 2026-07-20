# koreai Repository Analysis

> Source: `/Users/varun/koreai` — a hackathon Streamlit app for Korean-style seasonal color analysis.
> Purpose of this document: understand every feature and data flow before porting the AI pipeline into the myntra-colorAnalysis backend (FastAPI) and building a new React frontend. **The koreai UI is not being copied.**

## 1. Repository layout

```
koreai/
├── model.py                      # Entire app: Streamlit UI + CV pipeline + ML inference (515 lines)
├── models/
│   ├── undertone_classifier.pkl  # kNN (k=5) — USED IN PRODUCTION
│   ├── season_classifier.pkl     # kNN (k=5) — USED IN PRODUCTION
│   ├── *_classifier2.pkl         # MLP variants (unused)
│   └── *_classifier3.pkl         # LogisticRegression variants (unused)
├── csv/
│   ├── training_celebs.csv       # 100-celebrity training dataset (labels + RGB features)
│   └── {av,sp,vk,dd}-features.csv# Per-frame capture logs from team test sessions
├── notebooks/
│   ├── notebook.ipynb            # Model training + experimental color generator
│   └── colors.ipynb              # Celebrity feature-extraction + color-gen prototypes
├── requirements.txt              # opencv-python-headless, mediapipe, streamlit, sklearn, ...
├── runtime.txt                   # python-3.10
└── packages.txt                  # libgl1 (for OpenCV on Streamlit Cloud)
```

**Architecture note:** koreai is a monolith — there is no backend/frontend split and no HTTP API. Streamlit renders the UI, and the same Python process runs OpenCV, MediaPipe, and sklearn inference. "What the backend returns" therefore means "what the inference functions return", and "what the frontend displays" means "what the Streamlit screens render".

## 2. End-to-end AI pipeline

```
Webcam (cv2.VideoCapture(0), 5-second loop)
   │  BGR frame
   ▼
MediaPipe FaceMesh (max_num_faces=1, refine_landmarks=True,
                    min_detection_confidence=0.5, min_tracking_confidence=0.5)
   │  478 normalized landmarks (refine_landmarks adds 10 iris points, 468–477)
   ▼
Landmark → pixel sampling (4 fixed landmark indices)
   ├─ Eye   = landmark 468  (left iris center — available only with refine_landmarks)
   ├─ Lips  = landmark 13   (inner upper-lip center; code comment says "lower lip")
   ├─ Cheek = landmark 205  (left cheek)
   └─ Hair  = landmark 295  (right eyebrow — used as a PROXY for hair color)
   │  For each: average BGR over a 12×12 px patch centered on the landmark
   │  (sample_feature_color, region_size=6; returns None if patch is empty/out of frame)
   ▼
feature_colors dict  {'Eye': [B,G,R], 'Lips': [B,G,R], 'Cheek': [B,G,R], 'Hair': [B,G,R]}
   │  prepare_feature_data() → 1-row pandas DataFrame, 12 columns (RGB order):
   │  Eye_R, Eye_G, Eye_B, Lips_R, Lips_G, Lips_B,
   │  Cheek_R, Cheek_G, Cheek_B, Hair_R, Hair_G, Hair_B   (ints 0–255)
   ▼
Two sklearn Pipelines loaded at import time via joblib:
   ├─ undertone_classifier.pkl → Pipeline[KNeighborsClassifier(k=5)]
   │    classes: ['Cool', 'Neutral', 'Warm']
   └─ season_classifier.pkl    → Pipeline[KNeighborsClassifier(k=5)]
        classes: ['Autumn', 'Spring', 'Summer', 'Winter']
   │  No scaler/preprocessing step — raw 0–255 RGB in, Euclidean kNN (kd_tree)
   ▼
predict_undertone(df) → ['Cool']      (capitalized, as stored in training labels)
predict_season(df)    → ['autumn']    (explicitly lowercased by the function)
   ▼
Recommendation layers (pure Python, no ML):
   ├─ display_seasonal_palette(season): 6 hard-coded hex colors per season
   └─ generate_clothing_colors(cheek_rgb, season, undertone):
        9 procedurally generated colors from color-harmony math (see §5)
```

### Timing/averaging discrepancy
The README claims RGB values are "averaged across a 5-second span". The code does **not** do this — `st.session_state.feature_colors` is **overwritten every frame**, so predictions use only the **last successfully processed frame**. (The per-frame CSVs in `csv/` show they logged every frame during testing, so averaging was likely intended but never wired in.) For our port, averaging over frames — or median-filtering — is a cheap, real accuracy improvement.

## 3. How MediaPipe is used (exact details)

| Aspect | Value |
|---|---|
| Solution | `mp.solutions.face_mesh.FaceMesh` (legacy Solutions API) |
| Config | `max_num_faces=1`, `refine_landmarks=True`, `min_detection_confidence=0.5`, `min_tracking_confidence=0.5` |
| Input | BGR webcam frame converted to RGB (`cv2.cvtColor`) |
| Output used | `results.multi_face_landmarks[0]` — normalized (0–1) x/y per landmark, scaled by frame width/height to get pixel coords |
| Landmarks sampled | 468 (left iris), 13 (upper inner lip), 205 (left cheek), 295 (right eyebrow → "hair") |
| Landmarks for draping overlay | 152 (chin), 234 (left face edge), 454 (right face edge) |
| Visualization | `mp_drawing.draw_landmarks` with `FACEMESH_TESSELATION`, purple `DrawingSpec(color=(250,17,219), thickness=1, circle_radius=1)` |

Sampling function (`sample_feature_color`): converts normalized landmark → pixel (x, y), slices `frame[y-6:y+6, x-6:x+6]`, averages over both axes to a single BGR triple. No bounds clamping — a landmark near the frame edge can produce a truncated (or empty → `None`) patch.

**Porting consideration:** the same feature extraction can run either (a) server-side in Python on an uploaded image/frame, or (b) client-side with MediaPipe's JS/WASM Tasks API (`@mediapipe/tasks-vision`, FaceLandmarker returns the same 478-landmark topology) with only the 12 RGB numbers sent to the API. Landmark indices are identical across both.

## 4. Data structures produced

### 4.1 `feature_colors` (per-session capture result)
```python
{
  'Eye':   np.array([B, G, R]),   # float64 averages, OpenCV BGR order!
  'Lips':  np.array([B, G, R]),
  'Cheek': np.array([B, G, R]),
  'Hair':  np.array([B, G, R]),
}
```

### 4.2 Model input DataFrame (1 row, 12 int columns, RGB order)
```
Eye_R Eye_G Eye_B | Lips_R Lips_G Lips_B | Cheek_R Cheek_G Cheek_B | Hair_R Hair_G Hair_B
```
Column names matter — the pickled pipelines were fit on named DataFrames.

### 4.3 Prediction outputs
- `predict_undertone` → `list[str]`, one of `'Cool' | 'Neutral' | 'Warm'` (capitalized)
- `predict_season` → `list[str]`, one of `'autumn' | 'spring' | 'summer' | 'winter'` (lowercased)
- Both pipelines also support `predict_proba` (verified) — koreai never uses it, but our API can return confidence scores for free.

### 4.4 Standard seasonal palettes (hard-coded, 6 hex colors per season)
```python
{
  "winter": ["#8b1f60", "#0a6c70", "#c4e9fc", "#c1c8e4", "#ed819b", "#742872"],
  "summer": ["#A7C7E7", "#C8A2C8", "#E6E6FA", "#FFB6C1", "#98FF98", "#F0FFF0"],
  "autumn": ["#2a635f", "#d08465", "#9d222d", "#f5ece4", "#bf6766", "#6c724c"],
  "spring": ["#FFD700", "#FFA07A", "#98FB98", "#87CEFA", "#FF69B4", "#FFFACD"],
}
```
(Duplicated in two functions: `display_seasonal_palette` and `display_palette_for_overlay`.)

### 4.5 Custom color output
`generate_clothing_colors` → `np.ndarray` shape (9, 3), float values intended as RGB 0–255, randomly permuted.

### 4.6 Training dataset (`csv/training_celebs.csv`, 100 rows)
```
name, season, undertone, Eye_R/G/B, Eye_Hex, Lips_R/G/B, Lips_Hex,
Cheek_R/G/B, Cheek_Hex, Hair_R/G/B, Hair_Hex
```
Labels (`season` capitalized, `undertone` capitalized) were manually collected from stylist/expert analyses; RGB features extracted from celebrity photos with the same MediaPipe sampling code (`colors.ipynb`).

## 5. Custom color generation algorithm (`generate_clothing_colors`)

Input: cheek RGB (used as skin tone), season, undertone.

1. Normalize RGB to 0–1, convert to HLS via `colorsys.rgb_to_hls`.
2. Build 9 harmony hues from the skin hue (degrees): analogous (±30°), complementary-range (+150°, +180°, +210°), triadic (+120°, +240°).
3. Pick per-season (lightness, saturation) targets — saturation scaled by `(1 - skin_saturation)`:
   - summer (0.75, 0.55·(1−s)), autumn (0.35, 0.95·(1−s)), winter (0.40, 0.90·(1−s)), spring (0.50, 0.85·(1−s))
4. Convert each hue back to RGB (`hls_to_rgb`), scale ×255.
5. Add an undertone shift vector — warm: +45 R, neutral: +20 G, cool: +45 B — plus a lightness-based transform `[45·(1−l), 0, 45·l]`.
6. `% 360` and randomly permute the 9 colors.

**Known defects to fix when porting (do not copy verbatim):**
- `% 360` is wrong for RGB (valid range 0–255); values in 256–359 wrap oddly or clip. Should be `clip(0, 255)`.
- `colorsys.rgb_to_hls` returns **(h, l, s)** — the code unpacks it correctly, but step 3's tuple is (lightness, saturation) fed as `hls_to_rgb(hue, L, S)`; the notebook prototype had them swapped, so treat the constants as tuned-by-eye, not principled.
- Output is float ndarray, not ints/hex — callers convert per-value.
- Random permutation makes results non-deterministic between calls (results screen and explore screen generate different palettes for the same person).

## 6. Feature inventory (koreai user-facing behavior)

Four Streamlit "screens" driven by `st.session_state.current_screen`:

1. **Welcome** — explains the analysis (captures eye/lip/cheek/hair colors, determines undertone, identifies season, shows complementary colors). Button → camera.
2. **Camera capture** — 5-second live webcam loop with countdown:
   - Purple face-mesh tessellation drawn over the face in real time.
   - White dots on the 4 sampled landmarks + a live 40×20 px color swatch next to each.
   - "Stop early" button; error paths for camera failure / interruption (Try again / Back to welcome).
   - On completion: releases camera, stores the last annotated frame, → results.
3. **Results** —
   - Captured (annotated) frame displayed.
   - "Captured colors": swatch + `RGB(r, g, b)` + hex for each of the 4 features.
   - **Undertone** (Cool/Warm/Neutral) with hard-coded advice text (jewelry metal, tone families).
   - **Season** + the 6-color standard seasonal palette with hex captions + generic tips.
   - **Personalized palette**: 9 generated colors as swatches with hex captions.
   - Buttons: "Analyze again" (→ camera), "Explore more" (→ explore).
4. **Explore (virtual draping)** — live webcam again:
   - Radio toggle: custom colors vs. standard seasonal colors.
   - Current color drawn as a large filled rectangle anchored under the chin (landmark 152), width = 3× face width (landmarks 234↔454), simulating the fabric drape used in Korean color-analysis studios.
   - "Next color" cycles through the palette; shows "Color i/n: #HEX"; "Back to results".

## 7. Models on disk

| File | Estimator | Status |
|---|---|---|
| `undertone_classifier.pkl` | Pipeline → KNeighborsClassifier(k=5), kd_tree, no scaler | **loaded by model.py** |
| `season_classifier.pkl` | Pipeline → KNeighborsClassifier(k=5), kd_tree, no scaler | **loaded by model.py** |
| `*_classifier2.pkl` | Pipeline → MLPClassifier (+LabelEncoder artifacts) | unused experiment |
| `*_classifier3.pkl` | Pipeline → LogisticRegression | unused experiment (trained in notebook.ipynb) |

Self-reported accuracy (README): **45% undertone, 35% season** — kNN chosen because RGB proximity ≈ perceptual similarity; RF/logistic overfit the 100-row dataset.

### Compatibility (verified on this machine)
Loading `undertone_classifier.pkl` + `season_classifier.pkl` with **Python 3.14 / current scikit-learn** in the myntra-colorAnalysis backend venv: `predict()` and `predict_proba()` **work** (sample input → `Cool`, `Autumn`). Caveats:
- `InconsistentVersionWarning` on load (pickles built on an older sklearn); `repr()` of the pipeline crashes on a missing `transform_input` attribute, but inference is unaffected.
- Long-term fix: re-fit the pipelines from `training_celebs.csv` (100 rows, seconds to train) and re-pickle with our sklearn version. Everything needed to retrain ships in the repo.

## 8. Implications for myntra-colorAnalysis (proposed mapping — not yet implemented)

What ports cleanly to the FastAPI backend (`app/services/`):
- The 12-feature schema, the two kNN pipelines (or retrained equivalents), `prepare_feature_data`, palette tables, and a **fixed** version of `generate_clothing_colors`.
- New API surface can expose: feature extraction from an uploaded image (MediaPipe server-side), prediction from raw RGB features, palettes, and `predict_proba` confidences.

What must be rebuilt rather than ported:
- All UI (Streamlit → React; explicitly not copying koreai's UI).
- Camera capture: browser `getUserMedia` instead of server-side `cv2.VideoCapture(0)` (a server cannot open the user's webcam). Either send frames/images to the backend, or run MediaPipe Tasks (JS/WASM) client-side and send only the 12 RGB numbers.
- Multi-frame averaging (fixing the README/code discrepancy), bounds-clamped patch sampling, deterministic color generation, RGB clipping.
