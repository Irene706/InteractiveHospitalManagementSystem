import { useState } from "react";
import { ArrowLeft, CheckCircle, CalendarDays, Clock, User, ChevronDown, Star } from "lucide-react";
import { doctors } from "../data/mock";
import type { Module, ShowToast, PatientCtx } from "../App";

interface Props {
  patient: PatientCtx | null;
  navigate: (m: Module) => void;
  showToast: ShowToast;
}

const APPOINTMENT_TYPES = ["Consultation", "Follow-up", "Procedure", "Prenatal", "Emergency", "Post-op", "New Patient"];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];

function matchDoctor(patientDoctor: string) {
  const lastName = patientDoctor.replace("Dr. ", "").trim();
  return doctors.find(d => d.name.includes(lastName));
}

export default function BookAppointment({ patient, navigate, showToast }: Props) {
  const preselected = patient ? matchDoctor(patient.doctor) : null;

  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(preselected ?? null);
  const [date, setDate]           = useState("");
  const [time, setTime]           = useState("");
  const [type, setType]           = useState("Consultation");
  const [notes, setNotes]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const canSubmit = selectedDoctor && date && time;

  function handleSubmit() {
    if (!canSubmit || !patient) return;
    setSubmitted(true);
    showToast(`Appointment confirmed · ${selectedDoctor.name} has been notified`, "success");
    setTimeout(() => navigate("patients"), 3200);
  }

  if (!patient) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 60, color: "var(--text-3)" }}>
        <CalendarDays size={36} />
        <div style={{ fontSize: 14 }}>No patient selected.</div>
        <button className="btn btn-primary" onClick={() => navigate("patients")}>Back to Patients</button>
      </div>
    );
  }

  /* ── Confirmation screen ── */
  if (submitted) {
    return (
      <div style={{ maxWidth: 520, margin: "60px auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--green-soft)", border: "2px solid var(--border-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CheckCircle size={34} style={{ color: "var(--green)" }} />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>Appointment Booked</h2>
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--text)" }}>{patient.name}</strong> is booked with{" "}
            <strong style={{ color: "var(--text)" }}>{selectedDoctor?.name}</strong><br />
            on <strong style={{ color: "var(--text)" }}>{date}</strong> at{" "}
            <strong style={{ color: "var(--text)" }}>{time}</strong> &bull; {type}
          </p>
        </div>
        <div className="card" style={{ padding: "14px 18px", width: "100%", fontSize: 12, color: "var(--text-2)" }}>
          A notification has been sent to <strong style={{ color: "var(--text)" }}>{selectedDoctor?.name}</strong> ({selectedDoctor?.dept} dept).
          The appointment will appear in the Appointments module.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate("appointments")}>View Appointments</button>
          <button className="btn btn-primary" onClick={() => navigate("patients")}>Back to Patients</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn-icon" onClick={() => navigate("patients")} title="Back">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Book Appointment</h1>
          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Schedule a new appointment for this patient</p>
        </div>
      </div>

      {/* Patient summary */}
      <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--green-soft)", border: "2px solid var(--border-green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--green)", flexShrink: 0 }}>
          {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{patient.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
            <span className="mono">{patient.id}</span> &bull; {patient.age}y {patient.gender === "F" ? "Female" : "Male"} &bull; {patient.ward}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 2 }}>Current Diagnosis</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{patient.diagnosis}</div>
        </div>
      </div>

      {/* Select Doctor */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 5 }}>
          <User size={11} /> Select Practitioner <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {doctors.map(d => {
            const isSelected = selectedDoctor?.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDoctor(d)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: isSelected ? "1.5px solid var(--green)" : "1px solid var(--border)",
                  background: isSelected ? "var(--green-soft)" : "var(--surface)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.13s",
                  fontFamily: "inherit",
                  boxShadow: isSelected ? "var(--sh-sm)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img src={d.img} alt={d.name} style={{ width: 36, height: 36, borderRadius: 9, objectFit: "cover", border: `1.5px solid ${isSelected ? "var(--border-green)" : "var(--border)"}`, display: "block" }} />
                    <span style={{ position: "absolute", bottom: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: d.status === "On Duty" ? "var(--green)" : "var(--red)", border: "1.5px solid var(--surface)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? "var(--green)" : "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{d.specialty}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                      <Star size={9} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                      <span style={{ fontSize: 10, color: "var(--text-4)" }}>{d.rating} &bull; {d.exp}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date, Time, Type */}
      <div className="g-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            <CalendarDays size={11} /> Date <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ width: "100%", fontSize: 13 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            <Clock size={11} /> Time Slot <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <select value={time} onChange={e => setTime(e.target.value)} style={{ width: "100%", fontSize: 13, appearance: "none" }}>
              <option value="">Select time…</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)", pointerEvents: "none" }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            Type
          </label>
          <div style={{ position: "relative" }}>
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", fontSize: 13, appearance: "none" }}>
              {APPOINTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)", pointerEvents: "none" }} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", display: "block", marginBottom: 6 }}>Reason / Notes <span style={{ fontWeight: 400, color: "var(--text-4)" }}>(optional)</span></label>
        <textarea
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Brief description of the purpose of this appointment…"
          style={{ resize: "vertical", fontSize: 13 }}
        />
      </div>

      {/* Summary + Submit */}
      {selectedDoctor && date && time && (
        <div className="card" style={{ padding: "14px 18px", background: "var(--green-soft)", border: "1px solid var(--border-green)" }}>
          <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 4 }}>Appointment Summary</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
            {patient.name} &rarr; {selectedDoctor.name} &bull; {date} at {time} &bull; {type}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 4 }}>
        <button className="btn btn-ghost" onClick={() => navigate("patients")}>Cancel</button>
        <button
          className="btn btn-primary"
          style={{ opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? "pointer" : "not-allowed" }}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
