import { useState } from "react";
import {
  Bell, FlaskConical, Siren, AlertCircle, CalendarDays, CheckCircle,
  ArrowLeft, CheckCheck, Trash2,
} from "lucide-react";
import { INITIAL_NOTIFICATIONS } from "../data/notifications";
import type { Module, ShowToast } from "../App";

interface Props {
  navigate: (m: Module) => void;
  showToast: ShowToast;
  setNotifCount: (n: number) => void;
}

const TYPE_CONFIG: Record<string, { Icon: React.ElementType; color: string; bg: string; label: string }> = {
  critical:    { Icon: FlaskConical, color: "var(--red)",   bg: "var(--red-soft)",    label: "Critical" },
  emergency:   { Icon: Siren,        color: "var(--red)",   bg: "var(--red-soft)",    label: "Emergency" },
  lab:         { Icon: AlertCircle,  color: "var(--amber)", bg: "var(--amber-soft)",  label: "Lab" },
  appointment: { Icon: CalendarDays, color: "var(--blue)",  bg: "var(--blue-soft)",   label: "Appointment" },
  info:        { Icon: CheckCircle,  color: "var(--green)", bg: "var(--green-soft)",  label: "Info" },
};

const FILTERS = ["All", "Unread", "Critical", "Emergency", "Lab", "Appointment", "Info"] as const;

export default function Notifications({ navigate, showToast, setNotifCount }: Props) {
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");

  const markAllRead = () => {
    setItems(ns => ns.map(n => ({ ...n, read: true })));
    setNotifCount(0);
    showToast("All notifications marked as read");
  };

  const markRead = (id: number) => {
    setItems(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
    const wasUnread = items.find(n => n.id === id)?.read === false;
    if (wasUnread) setNotifCount(Math.max(0, items.filter(n => !n.read).length - 1));
  };

  const dismiss = (id: number) => {
    const wasUnread = items.find(n => n.id === id)?.read === false;
    setItems(ns => ns.filter(n => n.id !== id));
    if (wasUnread) setNotifCount(Math.max(0, items.filter(n => !n.read).length - 1));
    showToast("Notification dismissed");
  };

  const filtered = items.filter(n => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    return TYPE_CONFIG[n.type]?.label === filter;
  });

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn-icon"
            onClick={() => navigate("dashboard")}
            title="Back to Dashboard"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span style={{
                  background: "var(--red)", color: "#fff",
                  fontSize: 10, fontWeight: 700,
                  borderRadius: 999, padding: "1px 7px",
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
              {items.length} total · {unreadCount} unread
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button className="btn btn-ghost" style={{ gap: 6 }} onClick={markAllRead}>
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pill ${filter === f ? "on" : ""}`}
          >
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span style={{ marginLeft: 5, background: "var(--red)", color: "#fff", borderRadius: 999, fontSize: 9, fontWeight: 700, padding: "1px 5px" }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
            <Bell size={32} style={{ color: "var(--text-4)", margin: "0 auto 12px", display: "block" }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>No notifications</div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>
              {filter === "Unread" ? "You are all caught up." : `No ${filter.toLowerCase()} notifications.`}
            </div>
          </div>
        ) : (
          filtered.map(n => {
            const { Icon, color, bg } = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.info;
            return (
              <div
                key={n.id}
                className="card"
                style={{
                  padding: "16px 18px",
                  background: n.read ? "var(--surface)" : "var(--green-soft)",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onClick={() => { markRead(n.id); navigate(n.module); }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  {/* Icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: bg, border: `1px solid var(--border)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={16} style={{ color }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{n.title}</span>
                        {!n.read && (
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", flexShrink: 0, display: "inline-block" }} />
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: "var(--text-4)", whiteSpace: "nowrap" }}>{n.time}</span>
                        <span className="badge bg-muted" style={{ fontSize: 10 }}>{n.category}</span>
                        <button
                          className="btn-icon"
                          style={{ width: 24, height: 24, border: "none", color: "var(--text-4)", flexShrink: 0 }}
                          onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                          title="Dismiss"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.55, margin: 0 }}>{n.body}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 11, padding: "4px 10px" }}
                        onClick={e => { e.stopPropagation(); navigate(n.module); }}
                      >
                        Go to {n.category} →
                      </button>
                      {!n.read && (
                        <button
                          style={{ fontSize: 11, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                          onClick={e => { e.stopPropagation(); markRead(n.id); showToast("Marked as read"); }}
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
