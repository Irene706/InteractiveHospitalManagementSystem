import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import type { Module, ShowToast } from "../App";

interface Props { navigate: (m: Module) => void; showToast: ShowToast; }

function strength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: "",         color: "var(--border)" };
  let s = 0;
  if (pw.length >= 8)                        s++;
  if (/[A-Z]/.test(pw))                      s++;
  if (/[0-9]/.test(pw))                      s++;
  if (/[^A-Za-z0-9]/.test(pw))              s++;
  const map = [
    { score: 0, label: "",          color: "var(--border)"  },
    { score: 1, label: "Weak",      color: "var(--red)"     },
    { score: 2, label: "Fair",      color: "var(--amber)"   },
    { score: 3, label: "Good",      color: "var(--blue)"    },
    { score: 4, label: "Strong",    color: "var(--green)"   },
  ];
  return map[s] ?? map[0];
}

function PasswordField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••••"}
          style={{ paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex", padding: 2 }}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword({ navigate, showToast }: Props) {
  const [current, setCurrent]   = useState("");
  const [next, setNext]         = useState("");
  const [confirm, setConfirm]   = useState("");
  const [submitted, setSubmitted] = useState(false);

  const str = strength(next);
  const match = next.length > 0 && confirm.length > 0 && next === confirm;
  const mismatch = confirm.length > 0 && next !== confirm;
  const valid = current.length > 0 && next.length >= 8 && match;

  const handleSubmit = () => {
    if (!valid) return;
    setSubmitted(true);
    showToast("Password changed successfully");
    setTimeout(() => navigate("dashboard"), 1800);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 440, margin: "60px auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-green)" }}>
          <ShieldCheck size={24} style={{ color: "var(--green)" }} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Password Updated</div>
          <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Redirecting to dashboard…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn-icon" onClick={() => navigate("dashboard")} title="Back"><ArrowLeft size={15} /></button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Change Password</h1>
          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Update your administrator account password</p>
        </div>
      </div>

      {/* Profile chip */}
      <div className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format"
          alt="Dr. Frimpong"
          style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border-green)" }}
        />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Dr. Frimpong</div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>System Administrator · admin@medcore.gh</div>
        </div>
        <KeyRound size={16} style={{ color: "var(--text-4)", marginLeft: "auto" }} />
      </div>

      {/* Form */}
      <div className="card" style={{ padding: "24px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        <PasswordField label="Current Password" value={current} onChange={setCurrent} placeholder="Enter current password" />

        <div style={{ height: 1, background: "var(--border)" }} />

        <PasswordField label="New Password" value={next} onChange={setNext} placeholder="Minimum 8 characters" />

        {/* Strength meter */}
        {next.length > 0 && (
          <div style={{ marginTop: -12 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= str.score ? str.color : "var(--border)", transition: "background 0.2s" }} />
              ))}
            </div>
            {str.label && (
              <div style={{ fontSize: 11, color: str.color, fontWeight: 600 }}>{str.label}</div>
            )}
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4, lineHeight: 1.5 }}>
              Use 8+ characters · uppercase · numbers · symbols
            </div>
          </div>
        )}

        <PasswordField label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />

        {mismatch && (
          <div style={{ fontSize: 11, color: "var(--red)", marginTop: -12 }}>Passwords do not match</div>
        )}
        {match && (
          <div style={{ fontSize: 11, color: "var(--green)", marginTop: -12, fontWeight: 600 }}>Passwords match</div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: "center", opacity: valid ? 1 : 0.45 }}
            onClick={handleSubmit}
          >
            Update Password
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("dashboard")}>
            Cancel
          </button>
        </div>
      </div>

      {/* Security tip */}
      <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Security Tips</div>
        {["Never share your password with anyone, including IT staff.", "Use a unique password not used on other systems.", "Change your password every 90 days as per policy."].map(tip => (
          <div key={tip} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "var(--text-4)", flexShrink: 0, marginTop: 1 }}>·</span>
            <span style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
