import type { Module } from "../App";
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays,
  FileText, Pill, TestTube, Receipt, UserCog, Siren, Activity,
} from "lucide-react";

interface Props {
  active: Module;
  setActive: (m: Module) => void;
  open: boolean;
  isMobile: boolean;
  setOpen: (v: boolean) => void;
}

const groups = [
  { label: "Core", items: [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "emergency", label: "Emergency",  Icon: Siren, alert: true },
  ]},
  { label: "Clinical", items: [
    { id: "patients",     label: "Patients",     Icon: Users },
    { id: "doctors",      label: "Doctors",       Icon: Stethoscope },
    { id: "appointments", label: "Appointments",  Icon: CalendarDays },
    { id: "emr",          label: "Med. Records",  Icon: FileText },
  ]},
  { label: "Services", items: [
    { id: "pharmacy",   label: "Pharmacy",   Icon: Pill },
    { id: "laboratory", label: "Laboratory", Icon: TestTube },
    { id: "billing",    label: "Billing",    Icon: Receipt },
  ]},
  { label: "Admin", items: [
    { id: "staff", label: "HR & Staff", Icon: UserCog },
  ]},
];

export default function Sidebar({ active, setActive, open, isMobile, setOpen }: Props) {
  /* On mobile: hidden (width 0) when closed, overlay (fixed) when open.
     On desktop: narrow icon rail (58px) when closed, full (220px) when open. */
  const mobileClass = isMobile
    ? open ? "sidebar-mobile-open" : "sidebar-mobile-closed"
    : "";

  const width = isMobile ? (open ? 220 : 0) : (open ? 220 : 58);

  const navigate = (id: string) => {
    setActive(id as Module);
    if (isMobile) setOpen(false); // auto-close drawer on mobile after nav
  };

  return (
    <aside
      className={mobileClass}
      style={{
        width,
        background: "var(--sidebar-bg)",
        borderRight: isMobile && !open ? "none" : "1px solid var(--sidebar-border)",
        display: "flex", flexDirection: "column",
        flexShrink: 0, overflow: "hidden",
        transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {/* Logo */}
      <div style={{
        height: 60, display: "flex", alignItems: "center",
        padding: open ? "0 16px" : "0 12px",
        gap: 10, borderBottom: "1px solid var(--sidebar-border)", flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "var(--green)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: "0 3px 10px rgba(22,163,106,0.28)",
        }}>
          <Activity size={16} color="#fff" strokeWidth={2.5} />
        </div>
        {open && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>MedCore</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-4)" }}>HMS v2.4</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "6px 6px" }}>
        {groups.map(g => (
          <div key={g.label}>
            {open ? (
              <span className="sec-label">{g.label}</span>
            ) : (
              <div style={{ height: 10 }} />
            )}
            {g.items.map(({ id, label, Icon, alert }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  title={!open ? label : undefined}
                  style={{ justifyContent: open ? "flex-start" : "center", marginBottom: 1 }}
                >
                  <Icon
                    size={16}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    style={{ color: isActive ? "var(--green)" : alert ? "var(--red)" : "var(--text-3)", flexShrink: 0 }}
                  />
                  {open && (
                    <>
                      <span style={{
                        fontSize: 13, fontWeight: isActive ? 600 : 500, flex: 1,
                        color: isActive ? "var(--green)" : alert ? "var(--red)" : "var(--text-2)",
                      }}>{label}</span>
                      {alert && <span className="dot" style={{ width: 6, height: 6, background: "var(--red)", flexShrink: 0 }} />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div style={{ borderTop: "1px solid var(--sidebar-border)", padding: "12px 10px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: open ? "flex-start" : "center" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format"
              alt="Admin"
              style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--border-green)", display: "block" }}
            />
            <span style={{
              position: "absolute", bottom: 0, right: 0,
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--green)", border: "2px solid var(--sidebar-bg)",
            }} />
          </div>
          {open && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Dr. A. Frimpong</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Administrator</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
