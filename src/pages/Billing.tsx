import { useState } from "react";
import { Search, Plus, Download } from "lucide-react";
import { invoices } from "../data/mock";
import type { ShowToast } from "../App";

const sBadge: Record<string,string> = { Paid:"bg-green",Pending:"bg-amber","Part-paid":"bg-blue" };

interface Props { showToast: ShowToast; }

export default function Billing({ showToast }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const collected = invoices.reduce((s,i)=>s+i.paid,0);
  const outstanding = invoices.reduce((s,i)=>s+(i.amount-i.paid),0);
  const total = invoices.reduce((s,i)=>s+i.amount,0);

  const filtered = invoices.filter(inv=>{
    const q=search.toLowerCase();
    return(inv.patient.toLowerCase().includes(q)||inv.id.toLowerCase().includes(q))&&(filter==="All"||inv.status===filter);
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, maxWidth:1300, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>Billing & Finance</h1>
          <p style={{ fontSize:12, color:"var(--text-3)", marginTop:2 }}>{invoices.length} invoices &bull; GHS {collected.toLocaleString()} collected &bull; GHS {outstanding.toLocaleString()} outstanding</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn btn-ghost"><Download size={13}/> Export</button>
          <button className="btn btn-primary" onClick={()=>showToast("Invoice created")}><Plus size={13}/> New Invoice</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:13 }}>
        {[{label:"Total Invoiced",v:`GHS ${total.toLocaleString()}`,bg:"var(--bg)",c:"var(--text)"},{label:"Collected",v:`GHS ${collected.toLocaleString()}`,bg:"var(--green-soft)",c:"var(--green)"},{label:"Outstanding",v:`GHS ${outstanding.toLocaleString()}`,bg:"var(--amber-soft)",c:"var(--amber)"},{label:"Paid Invoices",v:invoices.filter(i=>i.status==="Paid").length.toString(),bg:"var(--blue-soft)",c:"var(--blue)"}].map(s=>(
          <div key={s.label} className="card" style={{ padding:16, background:s.bg, borderColor:"transparent" }}>
            <div className="lbl" style={{ marginBottom:5 }}>{s.label}</div>
            <div className="mono" style={{ fontSize:20, fontWeight:800, color:s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:"1 1 200px", maxWidth:260 }}>
          <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-4)", pointerEvents:"none" }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search invoices…" style={{ paddingLeft:30, height:34, fontSize:12 }}/>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {["All","Paid","Part-paid","Pending"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`pill ${filter===f?"on":""}`}>{f}</button>)}
        </div>
      </div>

      <div className="card t-scroll">
        <table>
          <thead><tr><th>Invoice</th><th>Patient</th><th>Services</th><th>Insurance</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Status</th><th/></tr></thead>
          <tbody>
            {filtered.map(inv=>(
              <tr key={inv.id}>
                <td><span className="mono" style={{ fontSize:11, color:"var(--text-4)" }}>{inv.id}</span></td>
                <td><span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{inv.patient}</span></td>
                <td><span style={{ fontSize:11, color:"var(--text-3)", maxWidth:180, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{inv.services}</span></td>
                <td>{inv.insurance!=="—"?<span className="badge bg-blue">{inv.insurance}</span>:<span style={{ color:"var(--text-4)", fontSize:12 }}>—</span>}</td>
                <td><span className="mono" style={{ fontSize:12, fontWeight:700, color:"var(--text)" }}>GHS {inv.amount.toLocaleString()}</span></td>
                <td><span className="mono" style={{ fontSize:12, color:"var(--green)", fontWeight:600 }}>GHS {inv.paid.toLocaleString()}</span></td>
                <td><span className="mono" style={{ fontSize:12, color:inv.amount-inv.paid>0?"var(--amber)":"var(--green)", fontWeight:600 }}>GHS {(inv.amount-inv.paid).toLocaleString()}</span></td>
                <td><span className={`badge ${sBadge[inv.status]}`}>{inv.status}</span></td>
                <td><button className="btn btn-ghost" style={{ fontSize:11, padding:"3px 9px" }} onClick={()=>showToast(`Viewing ${inv.id}`,"info")}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
