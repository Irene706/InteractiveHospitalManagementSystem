import { useState } from "react";
import {
  ArrowLeft, CalendarDays, Phone, User, Droplets, Activity,
  Pill, FlaskConical, FileText, BookOpen, CalendarPlus,
} from "lucide-react";
import { labTests, appointments, doctors } from "../data/mock";
import type { Module, ShowToast, PatientCtx } from "../App";

interface Props {
  patient: PatientCtx | null;
  navigate: (m: Module) => void;
  onBookAppt: () => void;
  showToast: ShowToast;
}

const TABS = [
  { id: "overview",    label: "Overview",     Icon: BookOpen },
  { id: "vitals",      label: "Vitals",        Icon: Activity },
  { id: "medications", label: "Medications",   Icon: Pill },
  { id: "labs",        label: "Lab Results",   Icon: FlaskConical },
  { id: "history",     label: "History",       Icon: CalendarDays },
  { id: "notes",       label: "Notes",         Icon: FileText },
] as const;
type Tab = typeof TABS[number]["id"];

function getVitals(status: string) {
  if (status === "Critical")   return { bp: "168/104", hr: 112, temp: 38.9, spo2: 91 };
  if (status === "Admitted")   return { bp: "138/88",  hr: 94,  temp: 37.4, spo2: 96 };
  if (status === "Outpatient") return { bp: "122/78",  hr: 76,  temp: 36.8, spo2: 99 };
  return                              { bp: "118/74",  hr: 72,  temp: 36.6, spo2: 99 };
}

function vColor(key: string, val: string | number): string {
  if (key === "bp") {
    const sys = parseInt(val as string);
    return sys > 140 ? "var(--red)" : sys > 120 ? "var(--amber)" : "var(--green)";
  }
  if (key === "hr") return (val as number) > 100 ? "var(--red)" : (val as number) > 90 ? "var(--amber)" : "var(--green)";
  if (key === "temp") return (val as number) > 38 ? "var(--red)" : (val as number) > 37.5 ? "var(--amber)" : "var(--green)";
  if (key === "spo2") return (val as number) < 94 ? "var(--red)" : (val as number) < 97 ? "var(--amber)" : "var(--green)";
  return "var(--green)";
}

function vLabel(key: string, val: string | number): string {
  if (key === "bp")   { const s = parseInt(val as string); return s > 140 ? "High" : s > 120 ? "Elevated" : "Normal"; }
  if (key === "hr")   return (val as number) > 100 ? "Tachycardia" : (val as number) > 90 ? "Elevated" : "Normal";
  if (key === "temp") return (val as number) > 38 ? "Fever" : (val as number) > 37.5 ? "Low-grade" : "Normal";
  if (key === "spo2") return (val as number) < 94 ? "Low" : (val as number) < 97 ? "Borderline" : "Normal";
  return "Normal";
}

const MOCK_MEDS = [
  "Amlodipine 5mg · Once daily · Morning",
  "Lisinopril 10mg · Once daily · Morning",
  "Paracetamol 500mg · Three times daily · With food",
  "Metformin 500mg · Twice daily · With meals",
];

export default function PatientRecord({ patient, navigate, onBookAppt, showToast }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [note, setNote] = useState("");

  if (!patient) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 60, color: "var(--text-3)" }}>
        <FileText size={36} />
        <div style={{ fontSize: 14 }}>No patient selected. Go back to Patients.</div>
        <button className="btn btn-primary" onClick={() => navigate("patients")}>Back to Patients</button>
      </div>
    );
  }

  const vitals = getVitals(patient.status);
  const patientLabs = labTests.filter(l => l.patient === patient.name);
  const patientAppts = appointments.filter(a => a.patient === patient.name);
  const lastName = patient.doctor.replace("Dr. ", "").trim();
  const attendingDoctor = doctors.find(d => d.name.includes(lastName));

  const initials = patient.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn-icon" onClick={() => navigate("patients")} title="Back to Patients">
            <ArrowLeft size={15} />
          </button>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--green-soft)", border: "2px solid var(--border-green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--green)", flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{patient.name}</h1>
              <span className={`badge ${patient.status === "Critical" ? "bg-red" : patient.status === "Admitted" ? "bg-blue" : patient.status === "Discharged" ? "bg-muted" : "bg-green"}`}>{patient.status}</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
              <span className="mono">{patient.id}</span> &bull; {patient.age}y {patient.gender === "F" ? "Female" : "Male"} &bull; {patient.ward}
            </p>
          </div>
        </div>
        <button className="btn btn-primary" style={{ gap: 6 }} onClick={onBookAppt}>
          <CalendarPlus size={13} /> Book Appointment
        </button>
      </div>

      {/* Tab strip */}
      <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 2 }}>
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 8, whiteSpace: "nowrap",
            background: tab === id ? "var(--surface)" : "transparent",
            border: tab === id ? "1px solid var(--border)" : "1px solid transparent",
            boxShadow: tab === id ? "var(--sh-sm)" : "none",
            color: tab === id ? "var(--green)" : "var(--text-3)",
            fontWeight: tab === id ? 600 : 400, fontSize: 12,
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.13s",
          }}>
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="g-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Demographics */}
            <div className="card" style={{ padding: 18 }}>
              <div className="lbl" style={{ marginBottom: 12 }}>Demographics</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Full Name",   value: patient.name,         Icon: User },
                  { label: "Blood Type",  value: patient.blood,        Icon: Droplets },
                  { label: "Phone",       value: patient.phone,        Icon: Phone },
                  { label: "Admitted",    value: patient.date,         Icon: CalendarDays },
                ].map(({ label, value, Icon }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={12} style={{ color: "var(--text-3)" }} />
                    </div>
                    <div>
                      <div className="lbl" style={{ marginBottom: 1 }}>{label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attending physician */}
            <div className="card" style={{ padding: 18 }}>
              <div className="lbl" style={{ marginBottom: 12 }}>Attending Physician</div>
              {attendingDoctor ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <img src={attendingDoctor.img} alt={attendingDoctor.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{attendingDoctor.name}</div>
                      <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>{attendingDoctor.specialty}</div>
                      <span className={`badge ${attendingDoctor.status === "On Duty" ? "bg-green" : "bg-muted"}`} style={{ marginTop: 4, display: "inline-flex" }}>{attendingDoctor.status}</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[["Dept", attendingDoctor.dept], ["Exp", attendingDoctor.exp]].map(([k, v]) => (
                      <div key={k} style={{ background: "var(--bg)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
                        <div className="lbl" style={{ marginBottom: 2 }}>{k}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ padding: "12px 0", color: "var(--text-3)", fontSize: 12 }}>No attending physician assigned.</div>
              )}
            </div>
          </div>

          {/* Diagnosis */}
          <div className="card" style={{ padding: 18 }}>
            <div className="lbl" style={{ marginBottom: 8 }}>Primary Diagnosis</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{patient.diagnosis}</div>
            <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.65 }}>
              Patient presenting with {patient.diagnosis.toLowerCase()}. Currently under observation in {patient.ward} ward.
              Treatment protocol in progress. Follow-up assessments scheduled per attending physician's order.
            </div>
          </div>
        </div>
      )}

      {/* ── Vitals ── */}
      {tab === "vitals" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="g-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Blood Pressure", key: "bp",   value: vitals.bp,   unit: "mmHg" },
              { label: "Heart Rate",     key: "hr",   value: vitals.hr,   unit: "bpm" },
              { label: "Temperature",    key: "temp", value: vitals.temp, unit: "°C" },
              { label: "SpO₂",           key: "spo2", value: vitals.spo2, unit: "%" },
            ].map(({ label, key, value, unit }) => {
              const color = vColor(key, value);
              const status = vLabel(key, value);
              return (
                <div key={key} className="card" style={{ padding: 18, boxShadow: `inset 4px 0 0 ${color}, var(--sh-sm)` }}>
                  <div className="lbl" style={{ marginBottom: 8 }}>{label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 8 }}>
                    <span className="mono" style={{ fontSize: 26, fontWeight: 800, color }}>{value}</span>
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>{unit}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color, background: `color-mix(in srgb, ${color} 10%, transparent)`, padding: "2px 8px", borderRadius: 999 }}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="lbl" style={{ marginBottom: 6 }}>Last Recorded</div>
            <div style={{ fontSize: 12, color: "var(--text-2)" }}>Today at 08:00 · Recorded by Nurse Esi Adjei</div>
          </div>
        </div>
      )}

      {/* ── Medications ── */}
      {tab === "medications" && (
        <div className="card" style={{ padding: 18 }}>
          <div className="lbl" style={{ marginBottom: 14 }}>Active Prescriptions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MOCK_MEDS.map((med, i) => {
              const [name, freq, timing] = med.split(" · ");
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green-soft)", border: "1px solid var(--border-green)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Pill size={14} style={{ color: "var(--green)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{freq} &bull; {timing}</div>
                  </div>
                  <span className="badge bg-green">Active</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Lab Results ── */}
      {tab === "labs" && (
        <div className="card t-scroll">
          {patientLabs.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>No lab results for this patient.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Test</th><th>Ordered By</th><th>Date</th><th>Status</th><th>Result</th><th>Flag</th></tr>
              </thead>
              <tbody>
                {patientLabs.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{l.test}</td>
                    <td style={{ fontSize: 12, color: "var(--text-3)" }}>{l.ordered}</td>
                    <td><span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{l.date}</span></td>
                    <td><span className={`badge ${l.status === "Complete" ? "bg-green" : l.status === "Pending" ? "bg-amber" : "bg-blue"}`}>{l.status}</span></td>
                    <td><span className="mono" style={{ fontSize: 12, fontWeight: 600, color: l.flag === "Critical" ? "var(--red)" : "var(--text)" }}>{l.result}</span></td>
                    <td><span className={`badge ${l.flag === "Critical" ? "bg-red" : l.flag === "Normal" ? "bg-green" : "bg-amber"}`}>{l.flag}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Appointment History ── */}
      {tab === "history" && (
        <div className="card t-scroll">
          {patientAppts.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
              No appointment history for this patient.
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary" style={{ gap: 6 }} onClick={onBookAppt}>
                  <CalendarPlus size={13} /> Book First Appointment
                </button>
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr><th>ID</th><th>Doctor</th><th>Dept</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr>
              </thead>
              <tbody>
                {patientAppts.map(a => (
                  <tr key={a.id}>
                    <td><span className="mono" style={{ fontSize: 11, color: "var(--text-4)" }}>{a.id}</span></td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{a.doctor}</td>
                    <td style={{ fontSize: 12, color: "var(--text-3)" }}>{a.dept}</td>
                    <td><span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{a.date}</span></td>
                    <td><span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{a.time}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text-2)" }}>{a.type}</td>
                    <td><span className={`badge ${a.status === "Confirmed" ? "bg-green" : a.status === "In Progress" ? "bg-blue" : a.status === "Pending" ? "bg-amber" : "bg-muted"}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Notes ── */}
      {tab === "notes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="lbl" style={{ marginBottom: 8 }}>Latest Clinical Note</div>
            <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 12, padding: "12px 14px", background: "var(--bg)", borderRadius: 9, border: "1px solid var(--border)" }}>
              Patient seen in {patient.ward} ward. Vitals recorded and reviewed.
              Current treatment plan maintained per attending physician's instructions.
              Patient is {patient.status === "Critical" ? "in critical condition — continuous monitoring required" : "stable and responding to treatment"}.
              Next assessment scheduled in 6 hours.
            </div>
            <div style={{ fontSize: 11, color: "var(--text-4)" }}>Recorded by {patient.doctor} · Today 08:00</div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", display: "block", marginBottom: 8 }}>Add Clinical Note</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={4}
              placeholder="Enter clinical observations, treatment updates, or notes…"
              style={{ resize: "none", fontSize: 13 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button
                className="btn btn-primary"
                style={{ opacity: note.trim() ? 1 : 0.45 }}
                onClick={() => { if (note.trim()) { showToast("Note saved"); setNote(""); } }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
