import { LayoutDashboard, Users, Siren, CalendarDays, MoreHorizontal } from "lucide-react";
import type { Module } from "../App";

interface Props {
  active: Module;
  setActive: (m: Module) => void;
  onMore: () => void;
}

const PRIMARY_ITEMS = [
  { id: "dashboard",    label: "Home",       Icon: LayoutDashboard },
  { id: "patients",     label: "Patients",   Icon: Users },
  { id: "emergency",    label: "Emergency",  Icon: Siren, alert: true },
  { id: "appointments", label: "Schedule",   Icon: CalendarDays },
] as const;

export default function BottomNav({ active, setActive, onMore }: Props) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      height: 60,
      background: "var(--surface)",
      borderTop: "1px solid var(--border)",
      display: "flex", alignItems: "stretch",
      zIndex: 400,
      boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {PRIMARY_ITEMS.map(({ id, label, Icon, alert }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id as Module)}
            style={{
              flex: 1,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 4,
              background: "none", border: "none", cursor: "pointer",
              position: "relative",
              fontFamily: "inherit",
            }}
          >
            {/* Active indicator bar at top */}
            {isActive && (
              <span style={{
                position: "absolute", top: 0, left: "25%", right: "25%",
                height: 2, borderRadius: "0 0 2px 2px",
                background: id === "emergency" ? "var(--red)" : "var(--green)",
              }} />
            )}
            <Icon
              size={20}
              strokeWidth={isActive ? 2.2 : 1.7}
              style={{
                color: isActive
                  ? (id === "emergency" ? "var(--red)" : "var(--green)")
                  : "var(--text-3)",
              }}
            />
            {alert && !isActive && (
              <span style={{
                position: "absolute", top: 8, left: "calc(50% + 4px)",
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--red)",
                border: "2px solid var(--surface)",
              }} />
            )}
            <span style={{
              fontSize: 10, fontWeight: isActive ? 700 : 500,
              color: isActive
                ? (id === "emergency" ? "var(--red)" : "var(--green)")
                : "var(--text-4)",
              letterSpacing: "0.01em",
            }}>
              {label}
            </span>
          </button>
        );
      })}

      {/* More — opens sidebar drawer */}
      <button
        onClick={onMore}
        style={{
          flex: 1,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 4,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <MoreHorizontal size={20} strokeWidth={1.7} style={{ color: "var(--text-3)" }} />
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-4)" }}>More</span>
      </button>
    </nav>
  );
}
