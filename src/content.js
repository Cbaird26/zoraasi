export const TABS = ["Pattern", "Scale", "Field", "Manual"];

export const SCALE_BANDS = [
  { min: -122, max: -91, name: "Sub-Planck", note: "Extreme conceptual micro-scale used as a visual bound." },
  { min: -90, max: -31, name: "Quantum", note: "Fine-grained structure and symbolic field detail." },
  { min: -30, max: -7, name: "Molecular", note: "Compressed geometric layering and dense overlap." },
  { min: -6, max: 6, name: "Human", note: "Readable, balanced, center-scale form." },
  { min: 7, max: 30, name: "Planetary", note: "Wide shells and slower field curvature." },
  { min: 31, max: 90, name: "Stellar", note: "Expanded torus and large-spectrum drift." },
  { min: 91, max: 122, name: "Cosmic", note: "Maximum conceptual range of the visual keyboard." },
];

export const FIELD_NOTES = [
  {
    label: "Sight",
    body: "Layered rings, toroidal arcs, and slow spectrum drift provide the primary visual language.",
  },
  {
    label: "Sound",
    body: "This version stays visual-only. Sound is intentionally not driven automatically.",
  },
  {
    label: "Touch",
    body: "Manual sliders and direct user control are the touch layer. Nothing advances without user input.",
  },
  {
    label: "Motion",
    body: "The pattern uses one natural coherence breath instead of a hard flash or rigid pulse sequence.",
  },
];

export const MANUAL_STEPS = [
  "Set the focus exponent to choose the scale band you want to examine.",
  "Adjust geometry, drift, and bloom to shape the current pattern without changing the underlying cadence.",
  "Use ENGAGE to run the scale sweep from 10^-122 to 10^122, then confirm arrival after the held WARP screen.",
  "Use the field notes as interpretation, not as claims about external physics or health effects.",
  "If the pattern feels too active, reduce bloom or motion depth and stay in the Human scale band.",
];
