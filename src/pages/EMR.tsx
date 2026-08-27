import { useState } from "react";
import { Search, ChevronRight, AlertTriangle, Pill, Activity } from "lucide-react";
import { patients } from "../data/mock";
import type { ShowToast } from "../App";

const emrData = patients.map((p,i)=>({
  ...p,
  vitals:{bp:["120/80","145/95","118/76","180/110","110/70","128/84","122/78","155/98"][i],hr:[72,88,68,110,65,80,74,94][i],temp:[36.6,37.2,36.8,37.8,36.5,36.9,36.7,37.4][i],spo2:[98,96,99,94,99,97,98,92][i]},
  allergies:[["Penicillin"],["None known"],["Sulfonamides"],["Aspirin","Iodine"],["None known"],["Latex"],["None known"],["NSAIDs"]][i],
  meds:[["Amlodipine 5mg OD","Ramipril 10mg OD"],["Metformin 500mg BD","Glibenclamide 5mg OD"],["Folic Acid 400mcg OD","Iron tabs OD"],["Heparin IV","Atorvastatin 40mg ON"],["Paracetamol 1g QDS","Metronidazole 400mg TDS"],["Tramadol 50mg QDS","Co-amoxiclav 625mg TDS"],["Sumatriptan 50mg PRN","Naproxen 500mg BD"],["Salbutamol inhaler PRN","Prednisolone 30mg OD"]][i],
  notes:["BP improving on current regimen. Review in 2 weeks. Consider reducing Amlodipine if BP maintained <130/80.","HbA1c elevated at 8.3%. Increasing Metformin to 1g BD. Referred to dietitian. Foot examination normal.","32 weeks gestation. All parameters within normal limits. Continue routine antenatal care. Growth scan booked for week 34.","Post-MI day 3. Haemodynamically stable. EF on echo 38%. Cardiac rehabilitation referral planned.","Post-appendectomy day 2. Wound healing well. Tolerating oral diet. Plan for discharge tomorrow if observations stable.","Post-ORIF day 4. Physiotherapy commenced. Good range of motion. X-ray satisfactory alignment.","Migraine frequency reduced from 6/month to 2/month on current regimen. Continue and review in 3 months.","COPD exacerbation improving on nebulisers and steroids. SpO2 now 94% on 2L O2. Chest physio daily."][i],
}));

const vStyle = (key:string,val:number)=>{
  if(key==="hr")  return val>100?"bg-red":val<60?"bg-amber":"bg-green";
  if(key==="temp") return val>37.5?"bg-red":val<36?"bg-amber":"bg-green";
  if(key==="spo2") return val<94?"bg-red":val<97?"bg-amber":"bg-green";
  return "bg-green";
};
const vColor = (cls:string)=>cls==="bg-red"?"var(--red)":cls==="bg-amber"?"var(--amber)":"var(--green)";

interface Props { showToast: ShowToast; }

export default function EMR({ showToast }: Props) {
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(emrData[0]);
  const [tab, setTab] = useState<"overview"|"vitals"|"meds"|"notes">("overview");

  const filtered = emrData.filter(p=>
    p.name.toLowerCase().includes(search.toLowerCase())||p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="emr-layout" style={{ display:"flex", gap:14, maxWidth:1300, margin:"0 auto", height:"calc(100vh - 108px)", minHeight:0 }}>
      {/* List */}
      <div className="emr-list" style={{ width:248, display:"flex", flexDirection:"column", flexShrink:0, minHeight:0 }}>
        <div style={{ marginBottom:10 }}>
          <div style={{ position:"relative" }}>
            <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-4)", pointerEvents:"none" }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patients…" style={{ paddingLeft:30, height:34, fontSize:12 }}/>
          </div>
        </div>
        <div className="card" style={{ flex:1, overflowY:"auto", padding:0 }}>
          {filtered.map(p=>(
            <div key={p.id} onClick={()=>{setSel(p);setTab("overview");}} style={{ display:"flex", alignItems:"center", gap:9, padding:"11px 13px", borderBottom:"1px solid var(--border)", cursor:"pointer", background:sel.id===p.id?"var(--green-soft)":"transparent", borderLeft:`2px solid ${sel.id===p.id?"var(--green)":"transparent"}`, transition:"background 0.12s" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"var(--green-soft)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, fontWeight:700, color:"var(--green)", border:sel.id===p.id?"1.5px solid var(--border-green)":"1.5px solid transparent" }}>
                {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                <div style={{ fontSize:11, color:"var(--text-3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.diagnosis}</div>
              </div>
              <ChevronRight size={12} style={{ color:"var(--text-4)", flexShrink:0 }}/>
            </div>
          ))}
        </div>
      </div>

      {/* Record */}
      <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", gap:12, minWidth:0, overflowY:"auto" }}>
        {/* Patient header */}
        <div className="card" style={{ padding:18 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:"var(--green-soft)", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid var(--border-green)", fontSize:15, fontWeight:800, color:"var(--green)", flexShrink:0 }}>
                {sel.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:"var(--text)" }}>{sel.name}</div>
                <div style={{ fontSize:11, color:"var(--text-3)", marginTop:2 }}>{sel.id} &bull; {sel.age}y &bull; {sel.gender==="F"?"Female":"Male"} &bull; {sel.blood}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <span className="badge bg-blue">{sel.ward}</span>
              <span className={`badge ${sel.status==="Critical"?"bg-red":sel.status==="Admitted"?"bg-blue":"bg-green"}`}>{sel.status}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-row">
          {(["overview","vitals","meds","notes"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`tab ${tab===t?"on":"off"}`}>
              {t==="overview"?"Overview":t==="vitals"?"Vitals":t==="meds"?"Medications":"Clinical Notes"}
            </button>
          ))}
        </div>

        {tab==="overview"&&(
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div className="card" style={{ padding:16 }}>
              <div className="lbl" style={{ marginBottom:8 }}>Primary Diagnosis</div>
              <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:4 }}>{sel.diagnosis}</div>
              <div style={{ fontSize:11, color:"var(--text-3)" }}>Admitted {sel.date} &bull; {sel.ward} Ward</div>
            </div>
            <div className="card" style={{ padding:16 }}>
              <div className="lbl" style={{ marginBottom:8 }}>Known Allergies</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {sel.allergies.map(a=><span key={a} className="badge bg-red"><AlertTriangle size={9}/>{a}</span>)}
              </div>
            </div>
            <div className="card" style={{ padding:16 }}>
              <div className="lbl" style={{ marginBottom:8 }}>Attending Physician</div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{sel.doctor}</div>
            </div>
            <div className="card" style={{ padding:16 }}>
              <div className="lbl" style={{ marginBottom:8 }}>Contact</div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{sel.phone}</div>
            </div>
          </div>
        )}

        {tab==="vitals"&&(
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
            {[{label:"Blood Pressure",v:sel.vitals.bp,u:"mmHg",k:"bp"},{label:"Heart Rate",v:sel.vitals.hr,u:"bpm",k:"hr"},{label:"Temperature",v:sel.vitals.temp,u:"°C",k:"temp"},{label:"SpO₂",v:sel.vitals.spo2,u:"%",k:"spo2"}].map(item=>{
              const cls = typeof item.v==="number"?vStyle(item.k,item.v):"bg-green";
              const c = vColor(cls);
              return(
                <div key={item.label} className="card" style={{ padding:18, boxShadow:`inset 4px 0 0 ${c}, var(--sh-sm)` }}>
                  <div className="lbl" style={{ marginBottom:8 }}>{item.label}</div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:8 }}>
                    <span className="mono" style={{ fontSize:28, fontWeight:700, color:c }}>{item.v}</span>
                    <span style={{ fontSize:12, color:"var(--text-3)" }}>{item.u}</span>
                  </div>
                  <span className={`badge ${cls}`}>Recorded 08:00</span>
                </div>
              );
            })}
          </div>
        )}

        {tab==="meds"&&(
          <div className="card" style={{ padding:18 }}>
            <div className="lbl" style={{ marginBottom:12 }}>Active Prescriptions</div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {sel.meds.map((m,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 13px", borderRadius:9, background:"var(--bg)", border:"1px solid var(--border)" }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:"var(--green-soft)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Pill size={13} style={{ color:"var(--green)" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{m}</div>
                    <div style={{ fontSize:11, color:"var(--text-3)", marginTop:1 }}>Prescribed by {sel.doctor}</div>
                  </div>
                  <span className="badge bg-green" style={{ marginLeft:"auto" }}>Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="notes"&&(
          <div className="card" style={{ padding:18 }}>
            <div className="lbl" style={{ marginBottom:10 }}>Clinical Notes — {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
            <div style={{ padding:"13px 15px", borderRadius:9, background:"var(--bg)", border:"1px solid var(--border)", fontSize:13, color:"var(--text-2)", lineHeight:1.7, marginBottom:14 }}>{sel.notes}</div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", display:"block", marginBottom:6 }}>Add Note</label>
            <textarea rows={3} placeholder="Enter clinical notes, observations, or plan…" style={{ resize:"none" }}/>
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}>
              <button className="btn btn-primary" onClick={()=>showToast("Note saved")}>Save Note</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
