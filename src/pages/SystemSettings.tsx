import { useState } from "react";
import {
  Building2, Globe, Bell, Shield, Database,
  ChevronRight, ToggleLeft, ToggleRight, ArrowLeft,
  Save, Clock, Mail, Smartphone, Monitor,
} from "lucide-react";
import type { Module, ShowToast } from "../App";

interface Props { navigate: (m: Module) => void; showToast: ShowToast; }

const TABS = [
  { id: "general",       label: "General",       Icon: Building2 },
  { id: "notifications", label: "Notifications",  Icon: Bell },
  { id: "security",      label: "Security",       Icon: Shield },
  { id: "appearance",    label: "Appearance",     Icon: Monitor },
  { id: "data",          label: "Data & Privacy", Icon: Database },
] as const;

type Tab = typeof TABS[number]["id"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 12 }}>{title}</div>
      <div className="card" style={{ overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, sub, children, last }: { label: string; sub?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 18px", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
      {on
        ? <ToggleRight size={26} style={{ color: "var(--green)" }} />
        : <ToggleLeft  size={26} style={{ color: "var(--text-4)" }} />}
    </button>
  );
}

function SettingInput({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width: 220, height: 34, fontSize: 12, textAlign: "right" }}
    />
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: 200, height: 34, fontSize: 12 }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

export default function SystemSettings({ navigate, showToast }: Props) {
  const [tab, setTab]     = useState<Tab>("general");
  const [dirty, setDirty] = useState(false);

  /* General */
  const [hospitalName, setHospitalName] = useState("MedCore Regional Hospital");
  const [address, setAddress]           = useState("14 Health Avenue, Accra");
  const [phone, setPhone]               = useState("+233 30 222 4567");
  const [timezone, setTimezone]         = useState("Africa/Accra (GMT+0)");
  const [language, setLanguage]         = useState("English");
  const [dateFormat, setDateFormat]     = useState("DD/MM/YYYY");

  /* Notifications */
  const [emailAlerts, setEmailAlerts]         = useState(true);
  const [smsAlerts, setSmsAlerts]             = useState(false);
  const [criticalPush, setCriticalPush]       = useState(true);
  const [labResults, setLabResults]           = useState(true);
  const [appointRemind, setAppointRemind]     = useState(true);
  const [systemUpdates, setSystemUpdates]     = useState(false);

  /* Security */
  const [sessionTimeout, setSessionTimeout]   = useState("30 minutes");
  const [twoFactor, setTwoFactor]             = useState(false);
  const [auditLog, setAuditLog]               = useState(true);
  const [ipRestrict, setIpRestrict]           = useState(false);

  /* Appearance */
  const [fontSize, setFontSize]               = useState("Medium (13px)");
  const [density, setDensity]                 = useState("Comfortable");

  /* Data */
  const [retentionPeriod, setRetentionPeriod] = useState("7 years");
  const [autoBackup, setAutoBackup]           = useState(true);

  const mark = () => setDirty(true);
  const save = () => { setDirty(false); showToast("Settings saved successfully"); };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn-icon" onClick={() => navigate("dashboard")} title="Back"><ArrowLeft size={15} /></button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>System Settings</h1>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>MedCore HMS v2.4 · System Administrator</p>
          </div>
        </div>
        <button className="btn btn-primary" style={{ gap: 6, opacity: dirty ? 1 : 0.45 }} onClick={save}>
          <Save size={13} /> Save Changes
        </button>
      </div>

      <div className="settings-layout" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "start" }}>

        {/* Side nav */}
        <div className="card settings-nav" style={{ padding: 6 }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "9px 12px", borderRadius: 8,
              background: tab === id ? "var(--green-soft)" : "none",
              border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              marginBottom: 2,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Icon size={14} style={{ color: tab === id ? "var(--green)" : "var(--text-3)" }} />
                <span style={{ fontSize: 13, fontWeight: tab === id ? 600 : 400, color: tab === id ? "var(--green)" : "var(--text-2)" }}>{label}</span>
              </div>
              {tab === id && <ChevronRight size={12} style={{ color: "var(--green)" }} />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {tab === "general" && (
            <>
              <Section title="Hospital Information">
                <Row label="Hospital Name" sub="Displayed across all reports and documents"><SettingInput value={hospitalName} onChange={v => { setHospitalName(v); mark(); }} /></Row>
                <Row label="Address" sub="Physical location of the facility"><SettingInput value={address} onChange={v => { setAddress(v); mark(); }} /></Row>
                <Row label="Contact Phone" last><SettingInput value={phone} onChange={v => { setPhone(v); mark(); }} type="tel" /></Row>
              </Section>
              <Section title="Regional">
                <Row label="Timezone"><SelectInput value={timezone} onChange={v => { setTimezone(v); mark(); }} options={["Africa/Accra (GMT+0)", "Africa/Lagos (GMT+1)", "Europe/London (GMT+0)", "America/New_York (GMT-5)"]} /></Row>
                <Row label="Language"><SelectInput value={language} onChange={v => { setLanguage(v); mark(); }} options={["English", "French", "Twi"]} /></Row>
                <Row label="Date Format" last><SelectInput value={dateFormat} onChange={v => { setDateFormat(v); mark(); }} options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} /></Row>
              </Section>
            </>
          )}

          {tab === "notifications" && (
            <>
              <Section title="Delivery Channels">
                <Row label="Email Alerts" sub="Send notifications to administrator email">
                  <Toggle on={emailAlerts} onToggle={() => { setEmailAlerts(!emailAlerts); mark(); }} />
                </Row>
                <Row label="SMS Alerts" sub="Requires SMS gateway configuration" last>
                  <Toggle on={smsAlerts} onToggle={() => { setSmsAlerts(!smsAlerts); mark(); }} />
                </Row>
              </Section>
              <Section title="Alert Types">
                <Row label="Critical Lab Results" sub="Immediate push for critical flags">
                  <Toggle on={criticalPush} onToggle={() => { setCriticalPush(!criticalPush); mark(); }} />
                </Row>
                <Row label="Lab Results Ready" sub="Notify when results are available">
                  <Toggle on={labResults} onToggle={() => { setLabResults(!labResults); mark(); }} />
                </Row>
                <Row label="Appointment Reminders" sub="30 minutes before scheduled time">
                  <Toggle on={appointRemind} onToggle={() => { setAppointRemind(!appointRemind); mark(); }} />
                </Row>
                <Row label="System Updates" sub="Maintenance and version releases" last>
                  <Toggle on={systemUpdates} onToggle={() => { setSystemUpdates(!systemUpdates); mark(); }} />
                </Row>
              </Section>
              <Section title="Channels Overview">
                <Row label="Email" sub="admin@medcore.gh"><Mail size={14} style={{ color: emailAlerts ? "var(--green)" : "var(--text-4)" }} /></Row>
                <Row label="SMS" sub="Not configured" last><Smartphone size={14} style={{ color: smsAlerts ? "var(--green)" : "var(--text-4)" }} /></Row>
              </Section>
            </>
          )}

          {tab === "security" && (
            <>
              <Section title="Session">
                <Row label="Session Timeout" sub="Automatically log out after inactivity">
                  <SelectInput value={sessionTimeout} onChange={v => { setSessionTimeout(v); mark(); }} options={["15 minutes", "30 minutes", "1 hour", "4 hours", "Never"]} />
                </Row>
                <Row label="Two-Factor Authentication" sub="Require OTP on login" last>
                  <Toggle on={twoFactor} onToggle={() => { setTwoFactor(!twoFactor); mark(); }} />
                </Row>
              </Section>
              <Section title="Audit & Access">
                <Row label="Audit Log" sub="Record all user actions in the system">
                  <Toggle on={auditLog} onToggle={() => { setAuditLog(!auditLog); mark(); }} />
                </Row>
                <Row label="IP Restriction" sub="Restrict access to approved IPs only" last>
                  <Toggle on={ipRestrict} onToggle={() => { setIpRestrict(!ipRestrict); mark(); }} />
                </Row>
              </Section>
              <Section title="Active Sessions">
                {[
                  { device: "Chrome · macOS", location: "Accra, Ghana", time: "Now", current: true },
                  { device: "Firefox · Windows", location: "Accra, Ghana", time: "2 hr ago", current: false },
                ].map((s, i) => (
                  <Row key={i} label={s.device} sub={`${s.location} · ${s.time}`} last={i === 1}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {s.current
                        ? <span className="badge bg-green">Current</span>
                        : <button className="btn btn-ghost" style={{ fontSize: 11, padding: "3px 10px", color: "var(--red)" }} onClick={() => showToast("Session revoked")}>Revoke</button>}
                    </div>
                  </Row>
                ))}
              </Section>
            </>
          )}

          {tab === "appearance" && (
            <>
              <Section title="Display">
                <Row label="Font Size" sub="Base text size across the interface">
                  <SelectInput value={fontSize} onChange={v => { setFontSize(v); mark(); }} options={["Small (12px)", "Medium (13px)", "Large (14px)"]} />
                </Row>
                <Row label="Layout Density" sub="Controls spacing between elements" last>
                  <SelectInput value={density} onChange={v => { setDensity(v); mark(); }} options={["Compact", "Comfortable", "Spacious"]} />
                </Row>
              </Section>
              <Section title="Theme">
                <Row label="Theme Mode" sub="Toggle from the top-right moon/sun icon" last>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={13} style={{ color: "var(--text-3)" }} />
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>Controlled via TopBar</span>
                  </div>
                </Row>
              </Section>
            </>
          )}

          {tab === "data" && (
            <>
              <Section title="Retention">
                <Row label="Patient Record Retention" sub="Minimum period required by law">
                  <SelectInput value={retentionPeriod} onChange={v => { setRetentionPeriod(v); mark(); }} options={["5 years", "7 years", "10 years", "Indefinite"]} />
                </Row>
                <Row label="Automatic Backup" sub="Daily encrypted backup to secure storage" last>
                  <Toggle on={autoBackup} onToggle={() => { setAutoBackup(!autoBackup); mark(); }} />
                </Row>
              </Section>
              <Section title="Data Management">
                <Row label="Export All Data" sub="Download full system data as CSV">
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => showToast("Export started — check your email", "info")}>Export</button>
                </Row>
                <Row label="System Logs" sub="Last 90 days of audit activity" last>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => showToast("Logs downloaded", "info")}>Download</button>
                </Row>
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
