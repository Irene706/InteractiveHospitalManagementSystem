import { useState, useRef, useEffect } from "react";
import { Search, Plus, Download, Droplets, ChevronRight, X, Phone, Calendar, User, FileText, Printer, FileSpreadsheet, ChevronDown } from "lucide-react";
import { patients } from "../data/mock";
import type { ShowToast, PatientCtx } from "../App";

const statusBadge: Record<string, string> = {
  Admitted: "bg-blue", Outpatient: "bg-green", Critical: "bg-red", Discharged: "bg-muted",
};

type PatientRow = typeof patients[0];
const SEED: PatientRow[] = patients;

interface Props {
  showToast: ShowToast;
  onOpenRecord: (p: PatientCtx) => void;
  onBookAppt: (p: PatientCtx) => void;
}

const BLANK_FORM = { name: "", dob: "", gender: "Female", blood: "O+", phone: "", diagnosis: "", ward: "General" };

export default function Patients({ showToast, onOpenRecord, onBookAppt }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<PatientRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [list, setList] = useState<PatientRow[]>(SEED);
  const [form, setForm] = useState(BLANK_FORM);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function exportCSV() {
    const headers = ["ID", "Name", "Age", "Gender", "Blood", "Diagnosis", "Ward", "Doctor", "Status", "Date", "Phone"];
    const rows = filtered.map(p => [p.id, p.name, p.age, p.gender === "F" ? "Female" : "Male", p.blood, p.diagnosis, p.ward, p.doctor, p.status, p.date, p.phone]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `patients_${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    setExportOpen(false);
    showToast("Patient list exported as CSV");
  }

  function exportPDF() {
    const win = window.open("", "_blank");
    if (!win) return;
    const rows = filtered.map(p => `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.age}y ${p.gender === "F" ? "F" : "M"}</td><td>${p.blood}</td><td>${p.diagnosis}</td><td>${p.ward}</td><td>${p.doctor}</td><td>${p.status}</td></tr>`).join("");
    win.document.write(`<!DOCTYPE html><html><head><title>Patient Registry</title><style>
      body{font-family:sans-serif;padding:24px;color:#111}
      h2{margin-bottom:4px}p{color:#64748b;font-size:12px;margin-bottom:16px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th{background:#16A36A;color:#fff;padding:8px 10px;text-align:left}
      td{padding:7px 10px;border-bottom:1px solid #e5e7eb}
      tr:nth-child(even) td{background:#f5f7fa}
    </style></head><body>
      <h2>MedCore — Patient Registry</h2>
      <p>Generated ${new Date().toLocaleString()} &bull; ${filtered.length} records</p>
      <table><thead><tr><th>ID</th><th>Name</th><th>Age/Sex</th><th>Blood</th><th>Diagnosis</th><th>Ward</th><th>Doctor</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody></table>
    </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
    setExportOpen(false);
    showToast("PDF report ready to print / save");
  }

  function handlePrint() {
    exportPDF();
  }

  function handleRegister() {
    if (!form.name.trim() || !form.dob) {
      showToast("Full name and date of birth are required", "error");
      return;
    }
    const year = new Date(form.dob).getFullYear();
    const age  = new Date().getFullYear() - year;
    const maxId = Math.max(...list.map(p => parseInt(p.id.replace("P-", ""), 10)));
    const newId = `P-${String(maxId + 1).padStart(5, "0")}`;
    const entry: PatientRow = {
      id: newId,
      name: form.name.trim(),
      age,
      gender: form.gender === "Female" ? "F" : form.gender === "Male" ? "M" : "O",
      blood: form.blood,
      doctor: "Dr. Mensah",
      ward: form.ward || "General",
      status: "Outpatient",
      date: new Date().toISOString().split("T")[0],
      phone: form.phone || "—",
      diagnosis: form.diagnosis || "—",
    };
    setList(prev => [entry, ...prev]);
    setShowAdd(false);
    setForm(BLANK_FORM);
    showToast(`${entry.name} registered successfully`);
  }

  const filtered = list.filter(p => {
    const q = search.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q))
      && (filter === "All" || p.status === filter);
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, maxWidth:1300, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>Patient Registry</h1>
          <p style={{ fontSize:12, color:"var(--text-3)", marginTop:2 }}>
            {list.length} total &bull; {list.filter(p=>p.status==="Admitted").length} admitted &bull; {list.filter(p=>p.status==="Critical").length} critical
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {/* Export dropdown */}
          <div ref={exportRef} style={{ position:"relative" }}>
            <button
              className="btn btn-ghost"
              onClick={() => setExportOpen(o => !o)}
              style={{ gap:6 }}
            >
              <Download size={13}/> Export <ChevronDown size={11} style={{ opacity:0.6, transform: exportOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.15s" }}/>
            </button>
            {exportOpen && (
              <div style={{
                position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:200,
                background:"var(--surface)", border:"1px solid var(--border)",
                borderRadius:10, boxShadow:"var(--sh-lg)", minWidth:190,
                overflow:"hidden", animation:"fadeIn 0.12s ease",
              }}>
                <div style={{ padding:"6px 0" }}>
                  {[
                    { Icon: FileSpreadsheet, label: "Export as CSV",        sub: "Spreadsheet-ready file",    action: exportCSV },
                    { Icon: FileText,        label: "Export as PDF",         sub: "Printable formatted report", action: exportPDF },
                    { Icon: Printer,         label: "Print registry",        sub: "Send directly to printer",  action: handlePrint },
                  ].map(({ Icon, label, sub, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      style={{
                        display:"flex", alignItems:"center", gap:12,
                        width:"100%", padding:"10px 14px",
                        background:"transparent", border:"none", cursor:"pointer",
                        textAlign:"left", fontFamily:"inherit",
                        transition:"background 0.1s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ width:30, height:30, borderRadius:8, background:"var(--green-soft)", border:"1px solid var(--border-green)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon size={13} style={{ color:"var(--green)" }}/>
                      </div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{label}</div>
                        <div style={{ fontSize:11, color:"var(--text-3)", marginTop:1 }}>{sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={()=>setShowAdd(true)}><Plus size={13}/> New Patient</button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:"1 1 200px", maxWidth:280 }}>
          <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-4)", pointerEvents:"none" }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, ID, diagnosis…" style={{ paddingLeft:30, height:34, fontSize:12 }}/>
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {["All","Admitted","Outpatient","Critical","Discharged"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`pill ${filter===f?"on":""}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card t-scroll">
        <div style={{ overflowX:"auto" }}>
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Age/Sex</th><th>Blood</th><th>Diagnosis</th><th>Ward</th><th>Doctor</th><th>Status</th><th/></tr>
            </thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={9} style={{ textAlign:"center", padding:40, color:"var(--text-3)" }}>No patients found</td></tr>
                : filtered.map(p=>(
                  <tr key={p.id} onClick={()=>setSelected(p)} style={{ cursor:"pointer" }}>
                    <td><span className="mono" style={{ fontSize:11, color:"var(--text-3)" }}>{p.id}</span></td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--green-soft)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, fontWeight:700, color:"var(--green)" }}>
                          {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                        </div>
                        <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize:12 }}>{p.age}y · {p.gender}</td>
                    <td><span className="badge bg-red" style={{ fontSize:10 }}><Droplets size={9}/>{p.blood}</span></td>
                    <td style={{ fontSize:12, color:"var(--text-2)" }}>{p.diagnosis}</td>
                    <td style={{ fontSize:12 }}>{p.ward}</td>
                    <td style={{ fontSize:12, color:"var(--text-3)" }}>{p.doctor}</td>
                    <td><span className={`badge ${statusBadge[p.status]}`}>{p.status}</span></td>
                    <td><ChevronRight size={13} style={{ color:"var(--text-4)" }}/></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <>
          <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.3)", zIndex:99 }} onClick={()=>setSelected(null)}/>
          <div className="slide-right panel-right" style={{ position:"fixed", top:0, right:0, bottom:0, width:340, background:"var(--surface)", borderLeft:"1px solid var(--border)", zIndex:100, display:"flex", flexDirection:"column", boxShadow:"var(--sh-lg)" }}>
            <div style={{ padding:"18px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"var(--green-soft)" }}>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>Patient Detail</span>
              <button className="btn-icon" onClick={()=>setSelected(null)}><X size={14}/></button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:52, height:52, borderRadius:"50%", background:"var(--green-soft)", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid var(--border-green)", fontSize:16, fontWeight:800, color:"var(--green)", flexShrink:0 }}>
                  {selected.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"var(--text)" }}>{selected.name}</div>
                  <div className="mono" style={{ fontSize:11, color:"var(--text-3)" }}>{selected.id}</div>
                  <span className={`badge ${statusBadge[selected.status]}`} style={{ marginTop:5, display:"inline-flex" }}>{selected.status}</span>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                {[["Age",`${selected.age}y`],["Gender",selected.gender==="F"?"Female":"Male"],["Blood",selected.blood],["Ward",selected.ward]].map(([k,v])=>(
                  <div key={k} style={{ background:"var(--bg)", borderRadius:9, padding:"10px 12px", border:"1px solid var(--border)" }}>
                    <div className="lbl" style={{ marginBottom:3 }}>{k}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{v}</div>
                  </div>
                ))}
              </div>
              {[{icon:<User size={13}/>,label:"Attending",value:selected.doctor},{icon:<Calendar size={13}/>,label:"Admitted",value:selected.date},{icon:<Phone size={13}/>,label:"Phone",value:selected.phone}].map(item=>(
                <div key={item.label} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                  <span style={{ color:"var(--green)", marginTop:2, flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <div className="lbl" style={{ marginBottom:2 }}>{item.label}</div>
                    <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{item.value}</div>
                  </div>
                </div>
              ))}
              <div style={{ background:"var(--green-soft)", border:"1px solid var(--border-green)", borderRadius:9, padding:"12px 14px", marginTop:14 }}>
                <div className="lbl" style={{ color:"var(--green)", marginBottom:4 }}>Diagnosis</div>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{selected.diagnosis}</div>
              </div>
            </div>
            <div style={{ padding:"14px 20px", borderTop:"1px solid var(--border)", display:"flex", gap:8 }}>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:"center" }} onClick={() => onOpenRecord(selected)}>Full Record</button>
              <button className="btn btn-ghost" style={{ flex:1, justifyContent:"center" }} onClick={() => onBookAppt(selected)}>Book Appt</button>
            </div>
          </div>
        </>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="overlay">
          <div className="modal">
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
              <div>
                <div className="modal-title">Register New Patient</div>
                <div className="modal-sub">Fill in the patient's basic information</div>
              </div>
              <button className="btn-icon" onClick={()=>{setShowAdd(false);setForm(BLANK_FORM);}}><X size={14}/></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {/* Full Name */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Full Name *</label>
                <input type="text" placeholder="Enter full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              </div>
              {/* DOB */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Date of Birth *</label>
                <input type="date" value={form.dob} onChange={e=>setForm(f=>({...f,dob:e.target.value}))}/>
              </div>
              {/* Gender */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Gender</label>
                <select value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}>
                  <option>Female</option><option>Male</option><option>Other</option>
                </select>
              </div>
              {/* Blood */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Blood Group</label>
                <select value={form.blood} onChange={e=>setForm(f=>({...f,blood:e.target.value}))}>
                  <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
              {/* Phone */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Phone</label>
                <input type="text" placeholder="+233 XX XXX XXXX" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>
              </div>
              {/* Ward */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Ward</label>
                <select value={form.ward} onChange={e=>setForm(f=>({...f,ward:e.target.value}))}>
                  {["General","Cardiology","Maternity","ICU","Emergency","Neurology","Orthopedics","Geriatrics","Pediatrics"].map(w=><option key={w}>{w}</option>)}
                </select>
              </div>
              {/* Diagnosis */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Diagnosis / Chief Complaint</label>
                <input type="text" placeholder="Primary complaint or diagnosis" value={form.diagnosis} onChange={e=>setForm(f=>({...f,diagnosis:e.target.value}))}/>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:20 }}>
              <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setForm(BLANK_FORM);}}>Cancel</button>
              <button className="btn btn-primary" onClick={handleRegister}>Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
