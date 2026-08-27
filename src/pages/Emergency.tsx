import { useState } from "react";
import { Siren, Plus, Clock, MoreVertical } from "lucide-react";
import { emergencies } from "../data/mock";
import type { ShowToast } from "../App";

const T: Record<string, { color: string; bg: string; border: string; label: string; textSoft: string }> = {
  Red:    { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", label: "Immediate",  textSoft: "#FCA5A5" },
  Orange: { color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA", label: "Urgent",      textSoft: "#FDBA74" },
  Yellow: { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", label: "Semi-urgent", textSoft: "#FCD34D" },
  Green:  { color: "#16A36A", bg: "#EAF8F1", border: "#A7F3D0", label: "Non-urgent",  textSoft: "#6EE7B7" },
};

const FLOOR_PLAN = "https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=600&h=500&fit=crop&auto=format";

/* Beds wired to real emergency data */
const beds = [
  { id: "ER-1",  patient: "Unknown Male",    triage: "Red",    status: "Occupied" },
  { id: "ER-2",  patient: "John Aidoo",      triage: "Red",    status: "Occupied" },
  { id: "ER-3",  patient: "Akosua Mensah",   triage: "Orange", status: "Occupied" },
  { id: "ER-4",  patient: "Free",            triage: null,     status: "Available" },
  { id: "ER-5",  patient: "Yaw Brempon",     triage: "Yellow", status: "Occupied" },
  { id: "ER-6",  patient: "—",               triage: null,     status: "Cleaning" },
  { id: "ER-7",  patient: "Free",            triage: null,     status: "Available" },
  { id: "ER-8",  patient: "Maame Serwaa",    triage: "Orange", status: "Occupied" },
  { id: "ER-9",  patient: "Free",            triage: null,     status: "Available" },
  { id: "ER-10", patient: "Free",            triage: null,     status: "Available" },
];

interface Props { showToast: ShowToast; }

export default function Emergency({ showToast }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const available = beds.filter(b => b.status === "Available").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1300, margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Emergency Room</h1>
            <span className="dot" style={{ width: 8, height: 8, background: "#DC2626" }} />
            <span className="badge bg-red" style={{ fontSize: 10 }}>LIVE</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>
            {emergencies.length} active cases &bull; {available} beds available
          </p>
        </div>
        <button
          className="btn"
          style={{ background: "#DC2626", color: "#fff", gap: 6 }}
          onClick={() => showToast("Emergency case registered")}
        >
          <Siren size={13} /> Register Emergency
        </button>
      </div>

      {/* ── Triage Summary Cards — full soft-color background ── */}
      <div className="g-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {(["Red", "Orange", "Yellow", "Green"] as const).map(triage => {
          const count = emergencies.filter(e => e.triage === triage).length;
          const cfg = T[triage];
          return (
            <div key={triage} style={{
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: "var(--r-card)",
              padding: "18px 20px",
              boxShadow: "var(--sh-sm)",
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: cfg.color }}>
                {triage}
              </div>
              <div style={{ fontSize: 11, color: cfg.color, opacity: 0.65, marginTop: 2, marginBottom: 12 }}>
                {cfg.label}
              </div>
              <div className="mono" style={{ fontSize: 42, fontWeight: 800, color: cfg.color, lineHeight: 1 }}>{count}</div>
              <div style={{ fontSize: 11, color: cfg.color, opacity: 0.55, marginTop: 6 }}>active cases</div>
            </div>
          );
        })}
      </div>

      {/* ── Cases List + Floor Map ── */}
      <div className="er-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>

        {/* ── Active Emergency Cases — white cards, triage badge on RIGHT ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="lbl" style={{ padding: "0 2px", marginBottom: 4 }}>Active Emergency Cases</div>

          {emergencies.map(e => {
            const cfg = T[e.triage];
            const open = expanded === e.id;
            return (
              <div
                key={e.id}
                className="card"
                onClick={() => setExpanded(open ? null : e.id)}
                style={{
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "box-shadow 0.15s, background 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {/* Left: title + patient + doctor/room */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{e.type}</div>
                    <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 3 }}>{e.patient}</div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 11, color: "var(--text-3)" }}>{e.doctor}</span>
                      <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                        Room: <strong style={{ color: "var(--text-2)", fontWeight: 600 }}>{e.room}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right: time + triage badge (bold + colored) + status + three-dot */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={11} style={{ color: "var(--text-4)" }} />
                      <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{e.arrived}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {/* Triage badge — bold, colored, right-aligned */}
                      <span style={{
                        fontSize: 10, fontWeight: 800,
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        color: cfg.color,
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        borderRadius: 999,
                        padding: "2px 8px",
                      }}>
                        {e.triage}
                      </span>
                      {/* Status / action badge */}
                      <span className="badge bg-blue">{e.status}</span>
                    </div>
                    <button
                      className="btn-icon"
                      style={{ width: 24, height: 24, border: "none", color: "var(--text-4)" }}
                      onClick={ev => ev.stopPropagation()}
                    >
                      <MoreVertical size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded actions */}
                {open && (
                  <div className="fade-in" style={{ display: "flex", gap: 7, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <button className="btn btn-primary" style={{ fontSize: 12, padding: "5px 12px" }}
                      onClick={ev => { ev.stopPropagation(); showToast("Bed assigned"); }}>Assign Bed</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }}
                      onClick={ev => { ev.stopPropagation(); showToast("Lab test ordered", "info"); }}>Order Lab</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }}
                      onClick={ev => { ev.stopPropagation(); showToast("Patient admitted"); }}>Admit</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 12px", color: "var(--green)", borderColor: "var(--border-green)" }}
                      onClick={ev => { ev.stopPropagation(); showToast("Patient discharged"); }}>Discharge</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── ER Floor Map ── */}
        <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="lbl">ER Floor Map</div>

          {/* Blurred floor plan with semi-transparent bed grid overlay */}
          <div style={{
            position: "relative",
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid var(--border)",
            flex: 1,
          }}>
            {/* Blurred background */}
            <img
              src={FLOOR_PLAN}
              alt="Hospital floor plan"
              className="floor-img"
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Bed grid — sits on the blurred background */}
            <div style={{
              position: "relative", zIndex: 1,
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 5, padding: 8,
            }}>
              {beds.map(b => {
                const cfg = b.triage ? T[b.triage] : null;
                const isAvail    = b.status === "Available";
                const isCleaning = b.status === "Cleaning";

                /* Cell styling: subtle translucent glass feel against the blurred map */
                const cellBg = isAvail
                  ? "rgba(22,163,106,0.22)"
                  : isCleaning
                    ? "rgba(148,163,184,0.18)"
                    : "rgba(0,0,0,0.22)";
                const cellBorder = isAvail
                  ? "rgba(34,197,94,0.45)"
                  : isCleaning
                    ? "rgba(148,163,184,0.3)"
                    : cfg ? `${cfg.color}55` : "rgba(255,255,255,0.1)";
                const idColor = isAvail
                  ? "#34D399"
                  : isCleaning
                    ? "rgba(255,255,255,0.45)"
                    : cfg?.color ?? "#fff";
                const nameColor = isAvail
                  ? "rgba(255,255,255,0.85)"
                  : isCleaning
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(255,255,255,0.8)";

                return (
                  <div key={b.id} style={{
                    height: 54, borderRadius: 7,
                    background: cellBg,
                    border: `1px solid ${cellBorder}`,
                    backdropFilter: "blur(2px)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.14s",
                  }}>
                    <div className="mono" style={{ fontSize: 11, fontWeight: 700, color: idColor }}>{b.id}</div>
                    <div style={{
                      fontSize: 9, color: nameColor, marginTop: 3,
                      maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      textAlign: "center",
                    }}>
                      {isAvail ? "Free" : isCleaning ? "Cleaning" : b.patient}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { dot: "#16A36A",         label: "Available" },
              { dot: "#DC2626",         label: "Occupied — Immediate" },
              { dot: "#EA580C",         label: "Occupied — Urgent" },
              { dot: "#D97706",         label: "Semi-urgent" },
              { dot: "var(--text-4)",   label: "Cleaning" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: l.dot, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
