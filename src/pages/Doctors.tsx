import { useState } from "react";
import { Search, Star, Users, Plus, X, Stethoscope, Clock, Building2, Award } from "lucide-react";
import { doctors as SEED } from "../data/mock";
import type { ShowToast } from "../App";

type Doctor = typeof SEED[0];

interface Props { showToast: ShowToast; }

const SPECIALTIES = [
  "Cardiology", "Endocrinology", "OB/GYN", "Surgery", "Neurology",
  "Pediatrics", "Orthopedics", "Emergency Medicine", "Internal Medicine",
  "Radiology", "Psychiatry", "Dermatology", "Ophthalmology", "ENT",
];

const DEPARTMENTS = [
  "Cardiology", "Internal Medicine", "Maternity", "Emergency", "Neurology",
  "Pediatrics", "Orthopedics", "Radiology", "Psychiatry", "General",
];

const BLANK: Omit<Doctor, "id" | "patients" | "rating"> = {
  name: "", specialty: "Cardiology", dept: "General",
  status: "On Duty", exp: "", img: "",
};

function Field({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", display: "block", marginBottom: 5 }}>{label}</label>
      {children}
      {err && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{err}</div>}
    </div>
  );
}

function Initials({ name, size = 48 }: { name: string; size?: number }) {
  const letters = name.trim().split(" ").map(n => n[0] ?? "").join("").slice(0, 2).toUpperCase() || "DR";
  return (
    <div style={{
      width: size, height: size, borderRadius: size < 40 ? 10 : 12,
      background: "var(--green-soft)", border: "1.5px solid var(--border-green)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 800, color: "var(--green)", flexShrink: 0,
    }}>
      {letters}
    </div>
  );
}

export default function Doctors({ showToast }: Props) {
  const [list, setList]         = useState<Doctor[]>(SEED);
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState(BLANK);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const filtered = list.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase()) ||
    d.dept.toLowerCase().includes(search.toLowerCase())
  );

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())      e.name      = "Full name is required";
    if (!form.exp.trim())       e.exp       = "Years of experience is required";
    return e;
  }

  function handleAdd() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const maxNum = Math.max(...list.map(d => parseInt(d.id.replace("D-", ""), 10)));
    const newDoc: Doctor = {
      id:       `D-${String(maxNum + 1).padStart(3, "0")}`,
      name:     form.name.trim().startsWith("Dr.") ? form.name.trim() : `Dr. ${form.name.trim()}`,
      specialty: form.specialty,
      dept:      form.dept,
      status:    form.status as Doctor["status"],
      exp:       form.exp.trim().match(/\d/) ? `${form.exp.trim().replace(/\D/g, "")} yrs` : form.exp.trim(),
      img:       form.img.trim(),
      patients:  0,
      rating:    0,
    };
    setList(prev => [newDoc, ...prev]);
    setShowAdd(false);
    setForm(BLANK);
    setErrors({});
    showToast(`${newDoc.name} added to the directory`);
  }

  function closeAdd() { setShowAdd(false); setForm(BLANK); setErrors({}); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1300, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Doctor Directory</h1>
          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>{list.filter(d => d.status === "On Duty").length} on duty</span>
            {" "}&bull; {list.length} total
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={13} /> Add Doctor
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 280 }}>
        <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)", pointerEvents: "none" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, specialty, dept…" style={{ paddingLeft: 30, height: 34, fontSize: 12 }} />
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {filtered.map(d => (
          <div key={d.id} className="card-hover" onClick={() => setSelected(d)} style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                {d.img
                  ? <img src={d.img} alt={d.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", border: "1.5px solid var(--border)", display: "block" }} />
                  : <Initials name={d.name} size={48} />
                }
                <span style={{ position: "absolute", bottom: -1, right: -1, width: 11, height: 11, borderRadius: "50%", background: d.status === "On Duty" ? "var(--green)" : "var(--red)", border: "2px solid var(--surface)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, marginTop: 1 }}>{d.specialty}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{d.dept} &bull; {d.exp || "—"}</div>
              </div>
              <span className={`badge ${d.status === "On Duty" ? "bg-green" : "bg-red"}`} style={{ flexShrink: 0 }}>{d.status}</span>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Users size={12} style={{ color: "var(--text-3)" }} />
                <span style={{ fontSize: 11, color: "var(--text-2)" }}>{d.patients} patients</span>
              </div>
              {d.rating > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={12} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  <span style={{ fontSize: 11, color: "var(--text-2)" }}>{d.rating}</span>
                </div>
              )}
              <span className="mono" style={{ fontSize: 10, color: "var(--text-4)", marginLeft: "auto" }}>{d.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.3)", zIndex: 99 }} onClick={() => setSelected(null)} />
          <div className="slide-right panel-right" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 320, background: "var(--surface)", borderLeft: "1px solid var(--border)", zIndex: 100, display: "flex", flexDirection: "column", boxShadow: "var(--sh-lg)" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Doctor Profile</span>
              <button className="btn-icon" onClick={() => setSelected(null)}><X size={14} /></button>
            </div>
            <div style={{ padding: 20, background: "var(--green-soft)", borderBottom: "1px solid var(--border-green)", textAlign: "center" }}>
              {selected.img
                ? <img src={selected.img} alt={selected.name} style={{ width: 66, height: 66, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--surface)", boxShadow: "var(--sh-md)", margin: "0 auto 10px", display: "block" }} />
                : <div style={{ margin: "0 auto 10px" }}><Initials name={selected.name} size={66} /></div>
              }
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, marginTop: 3 }}>{selected.specialty}</div>
              <span className={`badge ${selected.status === "On Duty" ? "bg-green" : "bg-red"}`} style={{ marginTop: 8, display: "inline-flex" }}>{selected.status}</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Dept", selected.dept], ["Exp", selected.exp || "—"], ["Patients", selected.patients.toString()], ["Rating", selected.rating > 0 ? `${selected.rating}/5.0` : "—"]].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--bg)", borderRadius: 9, padding: "10px 12px", border: "1px solid var(--border)" }}>
                    <div className="lbl" style={{ marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>Schedule</button>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Patients</button>
            </div>
          </div>
        </>
      )}

      {/* ── Add Doctor Modal ── */}
      {showAdd && (
        <div className="overlay">
          <div className="modal" style={{ maxWidth: 540, width: "100%" }}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--green-soft)", border: "1px solid var(--border-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Stethoscope size={18} style={{ color: "var(--green)" }} />
                </div>
                <div>
                  <div className="modal-title">Add New Doctor</div>
                  <div className="modal-sub">Complete the form to register a practitioner</div>
                </div>
              </div>
              <button className="btn-icon" onClick={closeAdd}><X size={14} /></button>
            </div>

            {/* Preview strip */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 20 }}>
              <Initials name={form.name || "New Doctor"} size={44} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                  {form.name.trim() ? (form.name.trim().startsWith("Dr.") ? form.name.trim() : `Dr. ${form.name.trim()}`) : "Dr. Full Name"}
                </div>
                <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, marginTop: 2 }}>{form.specialty}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{form.dept} &bull; {form.exp || "Experience"}</div>
              </div>
              <span className={`badge ${form.status === "On Duty" ? "bg-green" : "bg-red"}`} style={{ marginLeft: "auto" }}>{form.status}</span>
            </div>

            {/* Form fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Full Name *" err={errors.name}>
                <div style={{ gridColumn: "1/-1" }}>
                  <input
                    type="text"
                    placeholder="e.g. Kwame Mensah (Dr. added automatically)"
                    value={form.name}
                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
                    style={{ borderColor: errors.name ? "var(--red)" : undefined }}
                  />
                </div>
              </Field>

              <Field label="Specialty *">
                <select value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="Department">
                <select value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>

              <Field label="Experience *" err={errors.exp}>
                <div style={{ position: "relative" }}>
                  <Clock size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)", pointerEvents: "none" }} />
                  <input
                    type="text"
                    placeholder="e.g. 8"
                    value={form.exp}
                    onChange={e => { setForm(f => ({ ...f, exp: e.target.value })); setErrors(er => ({ ...er, exp: "" })); }}
                    style={{ paddingLeft: 30, borderColor: errors.exp ? "var(--red)" : undefined }}
                  />
                </div>
              </Field>

              <Field label="Duty Status">
                <div style={{ display: "flex", gap: 8 }}>
                  {(["On Duty", "Off Duty"] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, status: s }))}
                      style={{
                        flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        border: `1.5px solid ${form.status === s ? (s === "On Duty" ? "var(--green)" : "var(--red)") : "var(--border)"}`,
                        background: form.status === s ? (s === "On Duty" ? "var(--green-soft)" : "var(--red-soft)") : "transparent",
                        color: form.status === s ? (s === "On Duty" ? "var(--green)" : "var(--red)") : "var(--text-3)",
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.13s",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Photo URL">
                <div style={{ position: "relative" }}>
                  <Award size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)", pointerEvents: "none" }} />
                  <input
                    type="text"
                    placeholder="https://… (optional)"
                    value={form.img}
                    onChange={e => setForm(f => ({ ...f, img: e.target.value }))}
                    style={{ paddingLeft: 30 }}
                  />
                </div>
              </Field>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                <Building2 size={12} style={{ color: "var(--text-4)" }} />
                <span style={{ fontSize: 11, color: "var(--text-4)" }}>Doctor will be assigned ID automatically</span>
              </div>
              <button className="btn btn-ghost" onClick={closeAdd}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>
                <Plus size={13} /> Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
