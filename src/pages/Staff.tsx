import { useState } from "react";
import { Search, Plus, UserCog } from "lucide-react";
import { staff } from "../data/mock";
import type { ShowToast } from "../App";

const sBadge: Record<string,string> = { Active:"bg-green","On Leave":"bg-amber",Suspended:"bg-red" };
const shBadge: Record<string,string> = { Day:"bg-blue",Evening:"bg-amber",Night:"bg-purple" };

interface Props { showToast: ShowToast; }

export default function Staff({ showToast }: Props) {
  const [search, setSearch] = useState("");
  const filtered = staff.filter(s=>{
    const q=search.toLowerCase();
    return s.name.toLowerCase().includes(q)||s.role.toLowerCase().includes(q)||s.dept.toLowerCase().includes(q);
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, maxWidth:1300, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>HR & Staff</h1>
          <p style={{ fontSize:12, color:"var(--text-3)", marginTop:2 }}>{staff.length} staff &bull; {staff.filter(s=>s.status==="Active").length} active today</p>
        </div>
        <button className="btn btn-primary" onClick={()=>showToast("Staff added")}><Plus size={13}/> Add Staff</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:12 }}>
        {[{label:"Total Staff",v:staff.length,c:"var(--blue)"},{label:"Active Today",v:staff.filter(s=>s.status==="Active").length,c:"var(--green)"},{label:"On Leave",v:staff.filter(s=>s.status==="On Leave").length,c:"var(--amber)"},{label:"Departments",v:new Set(staff.map(s=>s.dept)).size,c:"var(--purple)"}].map(s=>(
          <div key={s.label} className="card" style={{ padding:16 }}>
            <div style={{ fontSize:26, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--text-3)", marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ position:"relative", maxWidth:280 }}>
        <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-4)", pointerEvents:"none" }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, role, dept…" style={{ paddingLeft:30, height:34, fontSize:12 }}/>
      </div>

      <div className="card t-scroll">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Department</th><th>Shift</th><th>Phone</th><th>Joined</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(s=>(
              <tr key={s.id}>
                <td><span className="mono" style={{ fontSize:11, color:"var(--text-4)" }}>{s.id}</span></td>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--purple-soft)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <UserCog size={13} style={{ color:"var(--purple)" }}/>
                    </div>
                    <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{s.name}</span>
                  </div>
                </td>
                <td><span style={{ fontSize:12, color:"var(--text-2)" }}>{s.role}</span></td>
                <td><span style={{ fontSize:12 }}>{s.dept}</span></td>
                <td><span className={`badge ${shBadge[s.shift]||"bg-muted"}`}>{s.shift}</span></td>
                <td><span className="mono" style={{ fontSize:11, color:"var(--text-3)" }}>{s.phone}</span></td>
                <td><span className="mono" style={{ fontSize:11, color:"var(--text-3)" }}>{s.joined}</span></td>
                <td><span className={`badge ${sBadge[s.status]}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
