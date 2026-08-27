import { useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { appointments } from "../data/mock";
import type { ShowToast } from "../App";

const sBadge: Record<string,string> = { Confirmed:"bg-green","In Progress":"bg-blue",Waiting:"bg-amber",Pending:"bg-muted" };
const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function Cal() {
  const [month, setMonth] = useState(new Date(2026,7,1));
  const firstDay = month.getDay();
  const total = new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
  const cells: (number|null)[] = Array(firstDay).fill(null);
  for(let i=1;i<=total;i++) cells.push(i);
  const hasAppt = new Set([19,20,21,22,23,24,25]);
  const today = 23;

  return (
    <div className="card" style={{ padding:18 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <button className="btn-icon" style={{ width:28, height:28 }} onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}><ChevronLeft size={13}/></button>
        <span style={{ fontSize:12, fontWeight:700, color:"var(--text)" }}>{month.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</span>
        <button className="btn-icon" style={{ width:28, height:28 }} onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}><ChevronRight size={13}/></button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:3 }}>
        {days.map(d=><div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:"var(--text-4)", padding:"2px 0" }}>{d}</div>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
        {cells.map((d,i)=>(
          <div key={i} style={{ height:30, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", borderRadius:7, cursor:d?"pointer":"default", background:d===today?"var(--green)":"transparent", transition:"background 0.1s" }}
            onMouseEnter={e=>d&&d!==today&&((e.currentTarget as HTMLElement).style.background="var(--green-soft)")}
            onMouseLeave={e=>d&&d!==today&&((e.currentTarget as HTMLElement).style.background="transparent")}
          >
            {d&&<>
              <span style={{ fontSize:11, fontWeight:d===today?700:400, color:d===today?"#fff":"var(--text-2)" }}>{d}</span>
              {hasAppt.has(d)&&d!==today&&<span style={{ width:3, height:3, borderRadius:"50%", background:"var(--green)", display:"block", marginTop:1 }}/>}
            </>}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props { showToast: ShowToast; }

export default function Appointments({ showToast }: Props) {
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  const filtered = appointments.filter(a=>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, maxWidth:1300, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>Appointments</h1>
          <p style={{ fontSize:12, color:"var(--text-3)", marginTop:2 }}>{appointments.length} scheduled this week</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowNew(true)}><Plus size={13}/> Book Appointment</button>
      </div>

      <div className="g-sb" style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Cal/>
          <div className="card" style={{ padding:16 }}>
            <div className="lbl" style={{ marginBottom:10 }}>Today's Summary</div>
            {[{label:"Total",count:8,cls:"bg-muted"},{label:"Confirmed",count:5,cls:"bg-green"},{label:"In Progress",count:2,cls:"bg-blue"},{label:"Pending",count:1,cls:"bg-amber"}].map(s=>(
              <div key={s.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid var(--border)" }}>
                <span style={{ fontSize:12, color:"var(--text-2)", fontWeight:500 }}>{s.label}</span>
                <span className={`badge ${s.cls}`}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card t-scroll">
          <div style={{ padding:"14px 14px 0" }}>
            <div style={{ position:"relative", maxWidth:260 }}>
              <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-4)", pointerEvents:"none" }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search appointments…" style={{ paddingLeft:30, height:34, fontSize:12 }}/>
            </div>
          </div>
          <table>
            <thead>
              <tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Dept</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id}>
                  <td><span className="mono" style={{ fontSize:11, color:"var(--text-4)" }}>{a.id}</span></td>
                  <td><span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{a.patient}</span></td>
                  <td><span style={{ fontSize:12, color:"var(--text-2)" }}>{a.doctor}</span></td>
                  <td><span style={{ fontSize:12 }}>{a.dept}</span></td>
                  <td><span className="mono" style={{ fontSize:11, color:"var(--text-3)" }}>{a.date}</span></td>
                  <td><span className="mono" style={{ fontSize:12, fontWeight:700, color:"var(--text)" }}>{a.time}</span></td>
                  <td><span style={{ fontSize:11, background:"var(--bg)", padding:"3px 9px", borderRadius:999, color:"var(--text-3)", border:"1px solid var(--border)" }}>{a.type}</span></td>
                  <td><span className={`badge ${sBadge[a.status]||"bg-muted"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && (
        <div className="overlay">
          <div className="modal">
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
              <div>
                <div className="modal-title">Book Appointment</div>
                <div className="modal-sub">Schedule a new patient visit</div>
              </div>
              <button className="btn-icon" onClick={()=>setShowNew(false)}><X size={14}/></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Patient</label>
                <input placeholder="Search patient name or ID"/>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Doctor</label>
                <select><option>Dr. Mensah</option><option>Dr. Acheampong</option><option>Dr. Boateng</option><option>Dr. Frimpong</option></select>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Department</label>
                <select><option>Cardiology</option><option>General</option><option>Maternity</option><option>Surgery</option></select>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Date</label>
                <input type="date" defaultValue="2026-08-24"/>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Time</label>
                <input type="time" defaultValue="09:00"/>
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:5 }}>Type</label>
                <select><option>New Patient</option><option>Follow-up</option><option>Consultation</option><option>Post-op</option></select>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:20 }}>
              <button className="btn btn-ghost" onClick={()=>setShowNew(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{setShowNew(false);showToast("Appointment booked");}}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
