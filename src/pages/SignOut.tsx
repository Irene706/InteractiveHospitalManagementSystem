import { useState } from "react";
import { LogOut, ArrowLeft, Clock, Shield, Monitor } from "lucide-react";
import type { Module, ShowToast } from "../App";

interface Props { navigate: (m: Module) => void; showToast: ShowToast; }

export default function SignOut({ navigate, showToast }: Props) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = () => {
    setSigningOut(true);
    showToast("Signing out…", "info");
    setTimeout(() => {
      showToast("You have been signed out. Session ended.", "success");
      navigate("dashboard");
      setSigningOut(false);
    }, 1800);
  };

  const sessionInfo = [
    { Icon: Clock,   label: "Session started",   value: "Today at 07:14" },
    { Icon: Monitor, label: "Device",             value: "Chrome · macOS" },
    { Icon: Shield,  label: "Security level",     value: "Administrator" },
  ];

  return (
    <div style={{ maxWidth: 440, margin: "40px auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn-icon" onClick={() => navigate("dashboard")} title="Back">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Sign Out</h1>
          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>End your current session securely</p>
        </div>
      </div>

      {/* Profile card */}
      <div className="card" style={{ padding: "24px", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format"
            alt="Dr. Frimpong"
            style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
          />
          <span style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: "var(--green)", border: "2px solid var(--surface)" }} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Dr. Frimpong</div>
        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 3 }}>System Administrator</div>
        <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 2 }}>admin@medcore.gh</div>
      </div>

      {/* Session info */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "10px 18px 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}>
          Current Session
        </div>
        {sessionInfo.map(({ Icon, label, value }, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: i < sessionInfo.length - 1 ? "1px solid var(--border)" : "none" }}>
            <Icon size={14} style={{ color: "var(--text-3)", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{label}</span>
            <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Confirmation message */}
      <div style={{ padding: "14px 18px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, textAlign: "center" }}>
        Signing out will end your current session. Any unsaved changes will be lost. You will need to log in again to access MedCore HMS.
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px 20px", borderRadius: "var(--r-btn)",
            background: signingOut ? "var(--bg)" : "var(--surface)",
            border: "1.5px solid var(--border)",
            color: signingOut ? "var(--text-3)" : "var(--red)",
            fontSize: 14, fontWeight: 600, cursor: signingOut ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "all 0.15s",
          }}
          onMouseEnter={e => { if (!signingOut) e.currentTarget.style.background = "var(--red-soft)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; }}
        >
          <LogOut size={15} />
          {signingOut ? "Signing out…" : "Yes, Sign Me Out"}
        </button>
        <button
          className="btn btn-primary"
          style={{ justifyContent: "center" }}
          onClick={() => navigate("dashboard")}
        >
          Stay Signed In
        </button>
      </div>

    </div>
  );
}
