import { useEffect, useMemo, useState } from "react";
import { FIELD_NOTES, MANUAL_STEPS, SCALE_BANDS, TABS } from "./content";

const P = {
  night: "#04060d",
  deep: "#0a1020",
  panel: "rgba(12, 18, 34, 0.84)",
  border: "#27324b",
  text: "#dde7f4",
  dim: "#95a6bf",
  white: "#f8fbff",
  blue: "#4ea7ff",
  indigo: "#6877ff",
  violet: "#9365ff",
  green: "#41d99b",
  gold: "#f3c257",
  orange: "#ff9654",
  red: "#ff6a7a",
};

const FONT = "'Courier New', 'Lucida Console', monospace";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function bandForExponent(exponent) {
  return SCALE_BANDS.find((band) => exponent >= band.min && exponent <= band.max) ?? SCALE_BANDS[3];
}

function range(value, min, max) {
  return (value - min) / (max - min);
}

function Shell({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(78,167,255,0.12), transparent 24%), radial-gradient(circle at top right, rgba(147,101,255,0.16), transparent 28%), radial-gradient(circle at bottom left, rgba(243,194,87,0.1), transparent 24%), linear-gradient(180deg, #070b16 0%, #04060d 100%)",
        color: P.text,
        fontFamily: FONT,
      }}
    >
      <style>{`
        @keyframes zoraPulse {
          0% { transform: scale(0.988) rotate(0deg); opacity: 0.84; filter: hue-rotate(0deg) saturate(1.02) brightness(0.95); }
          50% { transform: scale(1.04) rotate(84deg); opacity: 0.98; filter: hue-rotate(180deg) saturate(1.12) brightness(1.06); }
          100% { transform: scale(0.988) rotate(168deg); opacity: 0.84; filter: hue-rotate(360deg) saturate(1.02) brightness(0.95); }
        }
        @keyframes zoraHalo {
          0% { opacity: 0.2; transform: scale(0.996); }
          50% { opacity: 0.38; transform: scale(1.02); }
          100% { opacity: 0.2; transform: scale(0.996); }
        }
      `}</style>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 18px 56px" }}>{children}</div>
    </div>
  );
}

function Panel({ title, subtitle, children, accent = P.blue, style }) {
  return (
    <section
      style={{
        background: P.panel,
        border: `1px solid ${P.border}`,
        borderTop: `2px solid ${accent}55`,
        borderRadius: 22,
        padding: 20,
        boxShadow: `0 20px 48px ${accent}14`,
        ...style,
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: P.white, fontSize: 22, fontWeight: 700, fontFamily: "'Georgia', serif", marginBottom: 4 }}>{title}</div>
        {subtitle ? <div style={{ color: P.dim, fontSize: 13, lineHeight: 1.6 }}>{subtitle}</div> : null}
      </div>
      {children}
    </section>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1px solid ${active ? P.gold : P.border}`,
        background: active ? "rgba(243,194,87,0.14)" : "rgba(12,18,34,0.88)",
        color: active ? P.white : P.dim,
        borderRadius: 999,
        padding: "10px 14px",
        fontFamily: FONT,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function Control({ label, value, min, max, step, onChange }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={{ color: P.text }}>{label}</span>
        <span style={{ color: P.gold }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Metric({ label, value, note, accent }) {
  return (
    <div style={{ background: `${accent}10`, border: `1px solid ${accent}30`, borderRadius: 16, padding: 16 }}>
      <div style={{ color: P.dim, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ color: P.white, fontSize: 24, fontWeight: 700 }}>{value}</div>
      <div style={{ color: P.dim, fontSize: 12, lineHeight: 1.6, marginTop: 8 }}>{note}</div>
    </div>
  );
}

function ZoraPattern({ focusExponent, geometry, drift, bloom }) {
  const norm = range(focusExponent, -122, 122);
  const baseRadius = 68 + norm * 48;
  const spread = 76 + geometry * 28;
  const haloOpacity = 0.16 + bloom * 0.2;
  const strokeWidth = 2.2 + bloom * 1.4;

  const rings = useMemo(() => {
    const points = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0.5, 0.866],
      [-0.5, 0.866],
      [0.5, -0.866],
      [-0.5, -0.866],
      [2, 0],
      [-2, 0],
      [1.5, 0.866],
      [-1.5, 0.866],
      [1.5, -0.866],
      [-1.5, -0.866],
      [0, 1.732],
      [0, -1.732],
    ];

    return points.map(([x, y], index) => (
      <circle
        key={`${x}-${y}-${index}`}
        cx={340 + x * spread}
        cy={340 + y * spread}
        r={baseRadius}
        fill="none"
        stroke="url(#zora-spectrum)"
        strokeWidth={strokeWidth}
        opacity={index < 7 ? 0.92 : 0.72}
      />
    ));
  }, [baseRadius, spread, strokeWidth]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: 760,
        overflow: "hidden",
        borderRadius: 28,
        border: `1px solid ${P.border}`,
        background:
          "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 18%), radial-gradient(circle at center, rgba(104,119,255,0.12), transparent 50%), linear-gradient(180deg, rgba(8,12,22,0.98), rgba(4,6,13,1))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 38%, rgba(255,255,255,${haloOpacity}), transparent 16%), radial-gradient(circle at 65% 42%, rgba(243,194,87,0.16), transparent 18%), radial-gradient(circle at 35% 42%, rgba(147,101,255,0.16), transparent 18%), radial-gradient(circle at 50% 66%, rgba(65,217,155,0.14), transparent 20%)`,
          animation: "zoraHalo 18s ease-in-out infinite",
        }}
      />
      <svg
        viewBox="0 0 680 680"
        style={{
          width: "100%",
          maxWidth: 920,
          display: "block",
          margin: "0 auto",
          animation: "zoraPulse 18s linear infinite",
        }}
      >
        <defs>
          <linearGradient id="zora-spectrum" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="12%" stopColor="#4ea7ff" />
            <stop offset="24%" stopColor="#6877ff" />
            <stop offset="38%" stopColor="#9365ff" />
            <stop offset="54%" stopColor="#41d99b" />
            <stop offset="68%" stopColor="#f3c257" />
            <stop offset="84%" stopColor="#ff9654" />
            <stop offset="94%" stopColor="#ff6a7a" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <g transform={`rotate(${drift} 340 340)`}>{rings}</g>
      </svg>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 24 }}>
        <div style={{ color: P.gold, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 11, marginBottom: 8 }}>
          Zora Pattern
        </div>
        <div style={{ color: P.white, fontSize: 28, fontWeight: 700, fontFamily: "'Georgia', serif", marginBottom: 8 }}>
          Natural Coherence Breath
        </div>
        <div style={{ color: P.text, lineHeight: 1.8, maxWidth: 760 }}>
          The pattern now moves as one natural breath while coherence vibrates through the field. It is designed as a visual form explorer, not as a forceful sensory override.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Pattern");
  const [focusExponent, setFocusExponent] = useState(10);
  const [geometry, setGeometry] = useState(0.58);
  const [drift, setDrift] = useState(24);
  const [bloom, setBloom] = useState(0.42);
  const [sequenceState, setSequenceState] = useState("READY");
  const [displayExponent, setDisplayExponent] = useState(10);

  useEffect(() => {
    if (sequenceState !== "READY") {
      return;
    }
    setDisplayExponent(focusExponent);
  }, [focusExponent, sequenceState]);

  useEffect(() => {
    if (sequenceState !== "SWEEP") {
      return;
    }

    let current = -122;
    setDisplayExponent(current);

    const intervalId = window.setInterval(() => {
      current = Math.min(122, current + 4);
      setDisplayExponent(current);
      if (current >= 122) {
        window.clearInterval(intervalId);
        setSequenceState("WHITEOUT");
      }
    }, 55);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [sequenceState]);

  useEffect(() => {
    if (sequenceState !== "ARRIVED") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSequenceState("READY");
    }, 1100);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [sequenceState]);

  useEffect(() => {
    if (sequenceState !== "WHITEOUT") {
      return;
    }

    function handleKey(event) {
      if (event.key === "Escape") {
        setSequenceState("ARRIVED");
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [sequenceState]);

  const activeExponent = sequenceState === "READY" ? focusExponent : displayExponent;
  const currentBand = bandForExponent(activeExponent);
  const scaleValue = `10^${focusExponent}`;
  const coherenceIndex = clamp(0.72 + geometry * 0.18 + bloom * 0.12, 0, 1);

  function handleEngage() {
    if (sequenceState !== "READY") {
      return;
    }
    setSequenceState("SWEEP");
  }

  function handleArrive() {
    if (sequenceState !== "WHITEOUT") {
      return;
    }
    setSequenceState("ARRIVED");
  }

  return (
    <Shell>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: P.gold, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 8 }}>Pattern Portal</div>
        <h1 style={{ margin: 0, color: P.white, fontSize: 46, lineHeight: 1.04, fontFamily: "'Georgia', serif" }}>Zora Discovery</h1>
        <div style={{ marginTop: 12, color: P.text, maxWidth: 860, lineHeight: 1.8 }}>
          Zora Discovery is a visual form explorer organized around the Zora Pattern: a layered toroidal field, a wide conceptual scale keyboard, and one natural coherence breath.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {TABS.map((tab) => (
          <TabButton key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.7fr) minmax(320px, 0.9fr)", gap: 18, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 18 }}>
          <ZoraPattern focusExponent={activeExponent} geometry={geometry} drift={drift} bloom={bloom} />

          {activeTab === "Scale" ? (
            <Panel title="Scale Keyboard" subtitle="The visual keyboard spans conceptual exponents from 10^-122 through 10^122." accent={P.violet}>
              <div style={{ display: "grid", gap: 14 }}>
                {SCALE_BANDS.map((band) => (
                  <div
                    key={band.name}
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      border: `1px solid ${currentBand.name === band.name ? P.gold : P.border}`,
                      background: currentBand.name === band.name ? "rgba(243,194,87,0.10)" : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <div style={{ color: P.white, fontWeight: 700, marginBottom: 6 }}>
                      {band.name} <span style={{ color: P.dim, fontWeight: 400 }}>({band.min} to {band.max})</span>
                    </div>
                    <div style={{ color: P.text, lineHeight: 1.7 }}>{band.note}</div>
                  </div>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "Field" ? (
            <Panel title="Field Notes" subtitle="Interpretive mappings for the current build." accent={P.green}>
              <div style={{ display: "grid", gap: 14 }}>
                {FIELD_NOTES.map((note) => (
                  <div key={note.label} style={{ paddingBottom: 12, borderBottom: `1px solid ${P.border}` }}>
                    <div style={{ color: P.white, fontWeight: 700, marginBottom: 6 }}>{note.label}</div>
                    <div style={{ color: P.text, lineHeight: 1.7 }}>{note.body}</div>
                  </div>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "Manual" ? (
            <Panel title="Manual" subtitle="How to use the pattern surface without losing clarity." accent={P.orange}>
              <ol style={{ margin: 0, paddingLeft: 20, color: P.text, lineHeight: 1.9 }}>
                {MANUAL_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </Panel>
          ) : null}

          {activeTab === "Pattern" ? (
            <Panel title="Pattern Logic" subtitle="The default view keeps the form itself in focus." accent={P.blue}>
              <div style={{ color: P.text, lineHeight: 1.8 }}>
                The current field is built from overlapping circles arranged in a toroidal rhythm. Geometry changes the spread of the lattice, drift changes the rotational bias, and bloom changes the halo intensity while keeping the same natural-breath cadence.
              </div>
            </Panel>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <Panel title="Controls" subtitle="Manual control only. The pattern does not self-amplify." accent={P.gold}>
            <div style={{ display: "grid", gap: 16 }}>
              <button
                type="button"
                onClick={handleEngage}
                style={{
                  border: `1px solid ${sequenceState === "READY" ? P.gold : P.border}`,
                  background: sequenceState === "READY" ? "rgba(243,194,87,0.14)" : "rgba(255,255,255,0.04)",
                  color: P.white,
                  borderRadius: 14,
                  padding: "14px 16px",
                  fontFamily: FONT,
                  fontSize: 14,
                  cursor: sequenceState === "READY" ? "pointer" : "default",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {sequenceState === "READY" ? "Engage" : sequenceState === "SWEEP" ? "Sweep In Progress" : sequenceState === "WHITEOUT" ? "Warp Holding" : "Arrived"}
              </button>
              <Control label="Focus Exponent" value={focusExponent} min={-122} max={122} step={1} onChange={setFocusExponent} />
              <Control label="Geometry" value={geometry} min={0.2} max={1} step={0.01} onChange={setGeometry} />
              <Control label="Drift" value={drift} min={0} max={180} step={1} onChange={setDrift} />
              <Control label="Bloom" value={bloom} min={0} max={0.8} step={0.01} onChange={setBloom} />
            </div>
          </Panel>

          <div style={{ display: "grid", gap: 14 }}>
            <Metric label="Current Scale" value={`10^${activeExponent}`} note={currentBand.note} accent={P.blue} />
            <Metric label="Scale Band" value={currentBand.name} note="The active conceptual region on the visual keyboard." accent={P.violet} />
            <Metric
              label="Pattern Coherence"
              value={`${Math.round(coherenceIndex * 100)}%`}
              note="A local visual index based on geometry and bloom settings."
              accent={P.green}
            />
          </div>
        </div>
      </div>

      {sequenceState === "WHITEOUT" ? (
        <button
          type="button"
          onClick={handleArrive}
          style={{
            position: "fixed",
            inset: 0,
            border: "none",
            background: "#ffffff",
            color: "#101828",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
            padding: 24,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Warp</div>
            <div style={{ fontSize: 16, lineHeight: 1.7 }}>Press anywhere or hit Esc when ready to arrive.</div>
          </div>
        </button>
      ) : null}

      {sequenceState === "ARRIVED" ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#ffffff",
            color: "#111827",
            display: "grid",
            placeItems: "center",
            zIndex: 101,
            textAlign: "center",
            padding: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Arrived</div>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}
