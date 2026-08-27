import { useState, useRef, useEffect } from "react";
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown,
  User, Settings, LogOut, KeyRound,
  AlertCircle, FlaskConical, CalendarDays, Siren, CheckCircle,
  Users, Stethoscope, X,
} from "lucide-react";
import type { Module } from "../App";
import { patients, doctors, appointments } from "../data/mock";
import { INITIAL_NOTIFICATIONS } from "../data/notifications";

interface Props {
  module: Module;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  navigate: (m: Module) => void;
  notifCount: number;
  setNotifCount: (n: number) => void;
}

const meta: Record<Module, { title: string; sub: string }> = {
  notifications: { title: "Notifications",      sub: "Activity log & system alerts" },
  settings:      { title: "System Settings",    sub: "Hospital configuration & preferences" },
  password:      { title: "Change Password",    sub: "Update your account credentials" },
  signout:       { title: "Sign Out",           sub: "End your current session" },
  dashboard:    { title: "Dashboard",          sub: "Live hospital overview & analytics" },
  patients:     { title: "Patient Management", sub: "Registry, records & admissions" },
  doctors:      { title: "Doctors",            sub: "Medical staff & schedules" },
  appointments: { title: "Appointments",       sub: "Calendar, scheduling & queue" },
  emr:          { title: "Medical Records",    sub: "Electronic health records" },
  pharmacy:     { title: "Pharmacy",           sub: "Inventory, stock & dispensing" },
  laboratory:   { title: "Laboratory",         sub: "Tests, samples & results" },
  billing:      { title: "Billing & Finance",  sub: "Invoices, payments & insurance" },
  staff:        { title: "HR & Staff",         sub: "Employees, shifts & payroll" },
  emergency:    { title: "Emergency",          sub: "Live ER triage & patient tracking" },
  "patient-record":    { title: "Patient Record",   sub: "Full electronic health record view" },
  "book-appointment":  { title: "Book Appointment", sub: "Schedule an appointment with a practitioner" },
};

/* ── Notification type → icon + color ── */

/* ── Search index — flatten all searchable records ── */
type SearchHit = { label: string; sub: string; module: Module; icon: React.ReactNode };

function buildSearchIndex(): SearchHit[] {
  const hits: SearchHit[] = [];
  patients.forEach(p => hits.push({ label: p.name, sub: `Patient · ${p.diagnosis}`, module: "patients",     icon: <Users size={13} style={{ color: "var(--green)" }} /> }));
  doctors.forEach(d  => hits.push({ label: d.name, sub: `Doctor · ${d.specialty}`,  module: "doctors",      icon: <Stethoscope size={13} style={{ color: "var(--blue)" }} /> }));
  appointments.forEach(a => hits.push({ label: a.patient, sub: `Appt · ${a.date} ${a.time}`, module: "appointments", icon: <CalendarDays size={13} style={{ color: "var(--amber)" }} /> }));
  return hits;
}

const SEARCH_INDEX = buildSearchIndex();

/* Shared dropdown shell */
function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 8px)", right: 0,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      boxShadow: "var(--sh-lg)",
      zIndex: 200,
      animation: "fadeIn 0.15s ease-out",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* Hook — close panel when clicking outside */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

const NOTIF_ICON: Record<string, { Icon: React.ElementType; color: string }> = {
  critical:    { Icon: FlaskConical, color: "var(--red)" },
  emergency:   { Icon: Siren,        color: "var(--red)" },
  lab:         { Icon: AlertCircle,  color: "var(--amber)" },
  appointment: { Icon: CalendarDays, color: "var(--blue)" },
  info:        { Icon: CheckCircle,  color: "var(--green)" },
};

export default function TopBar({ module, sidebarOpen, setSidebarOpen, dark, setDark, navigate, notifCount, setNotifCount }: Props) {
  const [search, setSearch]         = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const [notifications, setNotifications] = useState(() => INITIAL_NOTIFICATIONS.slice(0, 5));

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);
  const userRef   = useRef<HTMLDivElement>(null);

  useClickOutside(searchRef, () => setSearchOpen(false));
  useClickOutside(notifRef,  () => setNotifOpen(false));
  useClickOutside(userRef,   () => setUserOpen(false));

  const unread = notifCount;

  const searchResults = search.trim().length > 0
    ? SEARCH_INDEX.filter(h =>
        h.label.toLowerCase().includes(search.toLowerCase()) ||
        h.sub.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 7)
    : [];

  const markAllRead = () => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
    setNotifCount(0);
  };

  const { title, sub } = meta[module];

  return (
    <header style={{
      height: 60, background: "var(--header-bg)",
      borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", gap: 12,
      padding: "0 20px",
      position: "sticky", top: 0, zIndex: 50, flexShrink: 0,
      transition: "background 0.25s, border-color 0.25s",
    }}>
      {/* Sidebar toggle */}
      <button className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle sidebar">
        <Menu size={15} />
      </button>

      {/* Title */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{sub}</div>
      </div>

      <div style={{ flex: 1 }} />

      {/* ── Global Search ── */}
      <div ref={searchRef} className="topbar-search" style={{ position: "relative", width: 220, flexShrink: 0 }}>
        <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)", pointerEvents: "none" }} />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setSearchOpen(true); setNotifOpen(false); setUserOpen(false); }}
          onFocus={() => { setSearchOpen(true); setNotifOpen(false); setUserOpen(false); }}
          placeholder="Search patients, doctors…"
          style={{ paddingLeft: 30, paddingRight: search ? 28 : 11, height: 34, fontSize: 12 }}
        />
        {search && (
          <button onClick={() => { setSearch(""); setSearchOpen(false); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-4)", display: "flex", padding: 2 }}>
            <X size={12} />
          </button>
        )}

        {/* Search dropdown */}
        {searchOpen && search.trim().length > 0 && (
          <Panel style={{ width: 340, right: 0 }}>
            {searchResults.length > 0 ? (
              <>
                <div style={{ padding: "10px 14px 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)" }}>
                  Results for "{search}"
                </div>
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => { navigate(r.module); setSearch(""); setSearchOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "9px 14px",
                    background: "none", border: "none", cursor: "pointer",
                    borderTop: i === 0 ? "none" : "1px solid var(--border)",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <span style={{ flexShrink: 0 }}>{r.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{r.sub}</div>
                    </div>
                  </button>
                ))}
                <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                  <button onClick={() => { navigate("patients"); setSearch(""); setSearchOpen(false); }} style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                    View all in Patients →
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: "18px 14px", textAlign: "center", color: "var(--text-3)", fontSize: 12 }}>
                No results for "{search}"
              </div>
            )}
          </Panel>
        )}
      </div>

      {/* ── Notifications ── */}
      <div ref={notifRef} style={{ position: "relative", flexShrink: 0 }}>
        <button className="btn-icon" onClick={() => { setNotifOpen(o => !o); setUserOpen(false); setSearchOpen(false); }}>
          <Bell size={15} />
        </button>
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 3, right: 3,
            width: 14, height: 14, borderRadius: "50%",
            background: "var(--red)", color: "#fff",
            fontSize: 8, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--header-bg)",
            pointerEvents: "none",
          }}>{unread}</span>
        )}

        {notifOpen && (
          <Panel style={{ width: 340, right: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Notifications</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {unread > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: 11, color: "var(--green)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                    Mark all read
                  </button>
                )}
                <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex", padding: 2 }}>
                  <X size={13} />
                </button>
              </div>
            </div>
            <div style={{ maxHeight: 340, overflowY: "auto" }}>
              {notifications.map((n, i) => {
                const { Icon, color } = NOTIF_ICON[n.type] ?? NOTIF_ICON.info;
                return (
                  <button key={n.id}
                    onClick={() => {
                      navigate(n.module);
                      setNotifOpen(false);
                      setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x));
                      setNotifCount(Math.max(0, notifCount - (n.read ? 0 : 1)));
                    }}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 11,
                      width: "100%", padding: "11px 16px",
                      background: n.read ? "none" : "var(--green-soft)",
                      border: "none", borderTop: i === 0 ? "none" : "1px solid var(--border)",
                      cursor: "pointer", textAlign: "left",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                    onMouseLeave={e => (e.currentTarget.style.background = n.read ? "none" : "var(--green-soft)")}
                  >
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--border)" }}>
                      <Icon size={13} style={{ color }} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</span>
                        {!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0, display: "inline-block" }} />}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-2)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.body}</div>
                      <div style={{ fontSize: 10, color: "var(--text-4)" }}>{n.time}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
              <button
                onClick={() => { navigate("notifications"); setNotifOpen(false); }}
                style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
              >
                View all activity →
              </button>
            </div>
          </Panel>
        )}
      </div>

      {/* Live pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "4px 11px", borderRadius: "999px",
        background: "var(--green-soft)", border: "1px solid var(--border-green)",
        flexShrink: 0,
      }}>
        <span className="dot" style={{ width: 6, height: 6, background: "var(--green)" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--green)" }}>Live</span>
      </div>

      {/* Dark mode toggle */}
      <button className="btn-icon" onClick={() => setDark(!dark)} title={dark ? "Light mode" : "Dark mode"} style={{ flexShrink: 0 }}>
        {dark ? <Sun size={15} style={{ color: "var(--amber)" }} /> : <Moon size={15} />}
      </button>

      {/* ── User / Admin dropdown ── */}
      <div ref={userRef} style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => { setUserOpen(o => !o); setNotifOpen(false); setSearchOpen(false); }}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "4px 10px 4px 5px",
            borderRadius: "999px",
            border: "1px solid var(--border)",
            background: "var(--bg)",
            cursor: "pointer",
            transition: "background 0.13s",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--bg)")}
        >
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format"
            alt="Dr. Frimpong"
            style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--border-green)" }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Dr. Frimpong</span>
          <ChevronDown size={12} style={{ color: "var(--text-3)", transform: userOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.18s" }} />
        </button>

        {userOpen && (
          <Panel style={{ width: 220, right: 0 }}>
            {/* Profile header */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format"
                  alt="Dr. Frimpong"
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border-green)" }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Dr. Frimpong</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>System Administrator</div>
                </div>
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>Online · MedCore HMS v2.4</span>
              </div>
            </div>

            {/* Menu items */}
            {[
              { Icon: User,     label: "My Profile",       action: () => { navigate("staff");    setUserOpen(false); } },
              { Icon: Settings, label: "System Settings",  action: () => { navigate("settings");  setUserOpen(false); } },
              { Icon: KeyRound, label: "Change Password",  action: () => { navigate("password");  setUserOpen(false); } },
            ].map(({ Icon, label, action }) => (
              <button key={label} onClick={action} style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "10px 16px",
                background: "none", border: "none", borderTop: "1px solid var(--border)",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                fontSize: 13, color: "var(--text-2)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <Icon size={14} style={{ color: "var(--text-3)", flexShrink: 0 }} />
                {label}
              </button>
            ))}

            {/* Logout */}
            <button onClick={() => { navigate("signout"); setUserOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "10px 16px",
              background: "none", border: "none", borderTop: "1px solid var(--border)",
              cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              fontSize: 13, color: "var(--red)",
              borderRadius: "0 0 12px 12px",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--red-soft)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <LogOut size={14} style={{ flexShrink: 0 }} />
              Sign Out
            </button>
          </Panel>
        )}
      </div>
    </header>
  );
}
