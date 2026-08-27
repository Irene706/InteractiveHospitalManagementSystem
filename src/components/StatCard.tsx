interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: { value: string; up: boolean };
}

export default function StatCard({ label, value, sub, icon, iconBg = "var(--green-soft)", iconColor = "var(--green)", trend }: Props) {
  return (
    <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        {trend && (
          <span className={`badge ${trend.up ? "bg-green" : "bg-red"}`}>
            {trend.up ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
      <div>
        <div className="num">{value}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}
