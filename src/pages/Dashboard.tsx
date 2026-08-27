import { Users, Stethoscope, CalendarDays, Bed, Activity, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import StatCard from "../components/StatCard";
import { patientFlowData, revenueData, deptData, bedOccupancy, appointments, emergencies } from "../data/mock";
import type { Module, ShowToast } from "../App";

const PIE_COLORS = ["#16A36A","#0E8A58","#34D399","#059669","#6EE7B7","#A7F3D0"];

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 13px", boxShadow: "var(--sh-md)", fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-2)", marginBottom: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span>{p.name}: <strong style={{ color: "var(--text)" }}>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

const apptBadge: Record<string, string> = {
  Confirmed: "bg-green", "In Progress": "bg-blue", Waiting: "bg-amber", Pending: "bg-muted",
};
const triageDot: Record<string, string> = { Red: "var(--red)", Orange: "var(--orange)", Yellow: "var(--amber)" };

interface Props { navigate: (m: Module) => void; showToast: ShowToast; }

export default function Dashboard({ navigate }: Props) {
  const totalBeds = bedOccupancy.reduce((a, b) => a + b.total, 0);
  const occupied  = bedOccupancy.reduce((a, b) => a + b.occupied, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1300, margin: "0 auto" }}>

      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(182px,1fr))", gap: 14 }}>
        <StatCard label="Total Patients"      value="1,284" sub="48 admitted today"        icon={<Users size={18}/>} trend={{ value:"4.2%", up:true }} />
        <StatCard label="Doctors on Duty"     value="18"    sub="6 currently in surgery"   icon={<Stethoscope size={18}/>} trend={{ value:"+2", up:true }} />
        <StatCard label="Today's Appointments"value="47"    sub="8 in progress"             icon={<CalendarDays size={18}/>} iconBg="var(--blue-soft)" iconColor="var(--blue)" trend={{ value:"11%", up:true }} />
        <StatCard label="Bed Occupancy"       value={`${Math.round((occupied/totalBeds)*100)}%`} sub={`${occupied}/${totalBeds} beds`} icon={<Bed size={18}/>} iconBg="var(--amber-soft)" iconColor="var(--amber)" trend={{ value:"3%", up:false }} />
        <StatCard label="ICU Capacity"        value="91.7%" sub="11 of 12 filled"           icon={<Activity size={18}/>} iconBg="var(--red-soft)" iconColor="var(--red)" trend={{ value:"1 bed", up:false }} />
        <StatCard label="Revenue Today"       value="GHS 18.4k" sub="vs 15.2k yesterday"  icon={<TrendingUp size={18}/>} trend={{ value:"21%", up:true }} />
      </div>

      {/* Charts row 1 */}
      <div className="g-2" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        {/* Patient flow */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Patient Flow — This Week</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Admissions · Discharges · Emergency</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={patientFlowData} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
              <defs>
                {[{id:"gA",c:"#16A36A"},{id:"gD",c:"#059669"},{id:"gE",c:"#DC2626"}].map(g=>(
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={g.c} stopOpacity={0.18}/>
                    <stop offset="100%" stopColor={g.c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="day" tick={{ fill:"var(--text-3)", fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"var(--text-3)", fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="admitted"   name="Admitted"   stroke="#16A36A" fill="url(#gA)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="discharged" name="Discharged" stroke="#059669" fill="url(#gD)" strokeWidth={1.5} dot={false}/>
              <Area type="monotone" dataKey="emergency"  name="Emergency"  stroke="#DC2626" fill="url(#gE)" strokeWidth={1.5} dot={false} strokeDasharray="4 2"/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", gap:18, marginTop:8 }}>
            {[{label:"Admitted",c:"#16A36A"},{label:"Discharged",c:"#059669"},{label:"Emergency",c:"#DC2626"}].map(l=>(
              <div key={l.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:10, height:3, background:l.c, borderRadius:2, display:"inline-block" }}/>
                <span style={{ fontSize:11, color:"var(--text-3)", fontWeight:500 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dept donut */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>Department Mix</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 10 }}>Inpatients by unit</div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={36} outerRadius={54} dataKey="value" paddingAngle={3}>
                {deptData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, fontSize:12 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:8 }}>
            {deptData.map((d,i)=>(
              <div key={d.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:7, height:7, borderRadius:2, background:PIE_COLORS[i], display:"inline-block", flexShrink:0 }}/>
                  <span style={{ fontSize:11, color:"var(--text-2)" }}>{d.name}</span>
                </div>
                <span className="mono" style={{ fontSize:11, color:"var(--text-3)", fontWeight:600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="g-2" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        {/* Revenue */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>Revenue vs Expenses</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 14 }}>Last 7 months · GHS</div>
          <ResponsiveContainer width="100%" height={165}>
            <BarChart data={revenueData} margin={{ top:0, right:0, bottom:0, left:-22 }} barGap={4} barCategoryGap="32%">
              <XAxis dataKey="month" tick={{ fill:"var(--text-3)", fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"var(--text-3)", fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<Tip/>} cursor={{ fill:"var(--surface-hover)" }}/>
              <Bar dataKey="revenue"  name="Revenue"  fill="var(--green)" radius={[4,4,0,0]}/>
              <Bar dataKey="expenses" name="Expenses" fill="var(--green-mid)" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bed occupancy */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>Bed Occupancy</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 14 }}>Live by ward</div>
          <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
            {bedOccupancy.map(w=>{
              const pct = Math.round((w.occupied/w.total)*100);
              const c = pct>=90?"var(--red)":pct>=75?"var(--amber)":"var(--green)";
              return (
                <div key={w.ward}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:500, color:"var(--text-2)" }}>{w.ward}</span>
                    <span className="mono" style={{ fontSize:11, fontWeight:700, color:c }}>{w.occupied}/{w.total}</span>
                  </div>
                  <div className="track"><div className="fill" style={{ width:`${pct}%`, background:c }}/></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="g-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Appointments */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>Today's Appointments</div>
            <button className="btn btn-ghost" style={{ fontSize:12, padding:"4px 10px" }} onClick={()=>navigate("appointments")}>View all</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {appointments.slice(0,5).map(a=>(
              <div key={a.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 11px", borderRadius:9, background:"var(--bg)", border:"1px solid var(--border)" }}>
                <span className="mono" style={{ fontSize:11, color:"var(--text-3)", width:38, flexShrink:0 }}>{a.time}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.patient}</div>
                  <div style={{ fontSize:11, color:"var(--text-3)" }}>{a.doctor}</div>
                </div>
                <span className={`badge ${apptBadge[a.status]||"bg-muted"}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency feed */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>Emergency</div>
              <span className="dot" style={{ width:7, height:7, background:"var(--red)" }}/>
            </div>
            <button className="btn btn-ghost" style={{ fontSize:12, padding:"4px 10px" }} onClick={()=>navigate("emergency")}>View ER</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {emergencies.map(e=>{
              const tc = triageDot[e.triage];
              const tbg = e.triage==="Red" ? "#FEF2F2" : e.triage==="Orange" ? "#FFF7ED" : "#FFFBEB";
              const tborder = e.triage==="Red" ? "#FECACA" : e.triage==="Orange" ? "#FED7AA" : "#FDE68A";
              return (
                <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 11px", borderRadius:9, background:"var(--bg)", border:"1px solid var(--border)" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.type}</div>
                    <div style={{ fontSize:11, color:"var(--text-3)" }}>{e.patient}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    <span className="mono" style={{ fontSize:11, color:"var(--text-4)" }}>{e.arrived}</span>
                    {tc && (
                      <span style={{
                        fontSize: 9, fontWeight: 800,
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        color: tc, background: tbg, border: `1px solid ${tborder}`,
                        borderRadius: 999, padding: "2px 7px",
                      }}>{e.triage}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
