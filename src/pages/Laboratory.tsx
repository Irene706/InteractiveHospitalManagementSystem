import { useState } from "react";
import { Search, Plus, FlaskConical, Bell } from "lucide-react";
import { labTests } from "../data/mock";
import type { ShowToast } from "../App";

const sBadge: Record<string,string> = { Complete:"bg-green",Pending:"bg-amber",Processing:"bg-blue" };
const fBadge: Record<string,string> = { Critical:"bg-red",High:"bg-amber",Abnormal:"bg-amber",Normal:"bg-green" };

interface Props { showToast: ShowToast; }

export default function Laboratory({ showToast }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = labTests.filter(t=>{
    const q=search.toLowerCase();
    return(t.patient.toLowerCase().includes(q)||t.test.toLowerCase().includes(q))&&(filter==="All"||t.status===filter);
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, maxWidth:1300, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>Laboratory</h1>
          <p style={{ fontSize:12, color:"var(--text-3)", marginTop:2 }}>
            {labTests.filter(t=>t.status==="Complete").length} complete &bull; {labTests.filter(t=>t.status==="Pending").length} pending &bull; <span style={{ color:"var(--red)", fontWeight:600 }}>{labTests.filter(t=>t.flag==="Critical").length} critical</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={()=>showToast("Test requested","info")}><Plus size={13}/> Request Test</button>
      </div>

      {labTests.filter(t=>t.flag==="Critical").map(t=>(
        <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 15px", borderRadius:10, background:"var(--red-soft)", border:"1px solid var(--red-border)" }}>
          <Bell size={14} style={{ color:"var(--red)", flexShrink:0 }}/>
          <span style={{ fontSize:13, color:"var(--red)", flex:1 }}>
            <strong>Critical: </strong>{t.patient} — {t.test}: <strong>{t.result}</strong>
          </span>
          <button className="btn btn-ghost" style={{ fontSize:11, padding:"4px 10px" }} onClick={()=>showToast("Alert acknowledged")}>Acknowledge</button>
        </div>
      ))}

      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:"1 1 200px", maxWidth:260 }}>
          <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-4)", pointerEvents:"none" }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tests or patients…" style={{ paddingLeft:30, height:34, fontSize:12 }}/>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {["All","Complete","Processing","Pending"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`pill ${filter===f?"on":""}`}>{f}</button>)}
        </div>
      </div>

      <div className="card t-scroll">
        <table>
          <thead><tr><th>Lab ID</th><th>Patient</th><th>Test</th><th>Ordered By</th><th>Date</th><th>Status</th><th>Result</th><th>Flag</th></tr></thead>
          <tbody>
            {filtered.map(t=>(
              <tr key={t.id}>
                <td><span className="mono" style={{ fontSize:11, color:"var(--text-4)" }}>{t.id}</span></td>
                <td><span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{t.patient}</span></td>
                <td><div style={{ display:"flex", alignItems:"center", gap:6 }}><FlaskConical size={12} style={{ color:"var(--green)", flexShrink:0 }}/><span style={{ fontSize:12, color:"var(--text-2)" }}>{t.test}</span></div></td>
                <td><span style={{ fontSize:12, color:"var(--text-3)" }}>{t.ordered}</span></td>
                <td><span className="mono" style={{ fontSize:11, color:"var(--text-3)" }}>{t.date}</span></td>
                <td><span className={`badge ${sBadge[t.status]}`}>{t.status}</span></td>
                <td><span className="mono" style={{ fontSize:12, color:t.result==="—"?"var(--text-4)":"var(--text)", fontWeight:t.result!=="—"?600:400 }}>{t.result}</span></td>
                <td><span className={`badge ${fBadge[t.flag]}`}>{t.flag}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
