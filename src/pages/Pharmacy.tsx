import { useState } from "react";
import { Search, AlertTriangle, Plus, Package } from "lucide-react";
import { medicines } from "../data/mock";
import type { ShowToast } from "../App";

interface Props { showToast: ShowToast; }

export default function Pharmacy({ showToast }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const cats = ["All", ...Array.from(new Set(medicines.map(m=>m.category)))];
  const filtered = medicines.filter(m=>{
    const q = search.toLowerCase();
    return(m.name.toLowerCase().includes(q)||m.category.toLowerCase().includes(q))&&(filter==="All"||m.category===filter);
  });
  const lowStock = medicines.filter(m=>m.stock<=m.threshold).length;
  const val = medicines.reduce((s,m)=>s+m.stock*m.price,0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, maxWidth:1300, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>Pharmacy</h1>
          <p style={{ fontSize:12, color:"var(--text-3)", marginTop:2 }}>
            {medicines.length} items &bull; {lowStock} low stock &bull; GHS {val.toLocaleString(undefined,{maximumFractionDigits:0})} est. value
          </p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {lowStock>0&&<div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 11px", borderRadius:8, background:"var(--red-soft)", border:"1px solid var(--red-border)" }}>
            <AlertTriangle size={13} style={{ color:"var(--red)" }}/>
            <span style={{ fontSize:12, fontWeight:600, color:"var(--red)" }}>{lowStock} low stock</span>
          </div>}
          <button className="btn btn-primary" onClick={()=>showToast("Medicine added")}><Plus size={13}/> Add Medicine</button>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:"1 1 200px", maxWidth:260 }}>
          <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-4)", pointerEvents:"none" }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search medicines…" style={{ paddingLeft:30, height:34, fontSize:12 }}/>
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {cats.map(c=><button key={c} onClick={()=>setFilter(c)} className={`pill ${filter===c?"on":""}`}>{c}</button>)}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:13 }}>
        {filtered.map(m=>{
          const pct = Math.min(100,Math.round((m.stock/(m.threshold*4))*100));
          const isLow = m.stock<=m.threshold;
          const isCrit = m.stock<m.threshold*0.5;
          const c = isCrit?"var(--red)":isLow?"var(--amber)":"var(--green)";
          return(
            <div key={m.id} className="card" style={{ padding:16 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:"var(--green-soft)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Package size={15} style={{ color:"var(--green)" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{m.name}</div>
                    <div style={{ fontSize:11, color:"var(--text-3)", marginTop:1 }}>{m.category}</div>
                  </div>
                </div>
                {isLow&&<span className={`badge ${isCrit?"bg-red":"bg-amber"}`}><AlertTriangle size={9}/>{isCrit?"Critical":"Low"}</span>}
              </div>
              <div style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11, color:"var(--text-3)" }}>Stock</span>
                  <span className="mono" style={{ fontSize:11, fontWeight:700, color:c }}>{m.stock} {m.unit}</span>
                </div>
                <div className="track"><div className="fill" style={{ width:`${pct}%`, background:c }}/></div>
                <div style={{ fontSize:10, color:"var(--text-4)", marginTop:3 }}>Reorder at {m.threshold}</div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:10, borderTop:"1px solid var(--border)" }}>
                <span style={{ fontSize:11, color:"var(--text-3)" }}>Expires <span className="mono" style={{ color:"var(--text-2)", fontWeight:600 }}>{m.expiry}</span></span>
                <span style={{ fontSize:12, fontWeight:700, color:"var(--green)" }}>GHS {m.price.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
