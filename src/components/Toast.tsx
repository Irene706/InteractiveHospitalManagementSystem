import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";
export interface ToastItem { id: number; message: string; type: ToastType; }

interface Props { toasts: ToastItem[]; remove: (id: number) => void; }

const cfg = {
  success: { Icon: CheckCircle, color: "var(--green)" },
  error:   { Icon: AlertCircle, color: "var(--red)" },
  info:    { Icon: Info,        color: "var(--blue)" },
};

function Toast({ t, remove }: { t: ToastItem; remove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => remove(t.id), 3500);
    return () => clearTimeout(timer);
  }, [t.id, remove]);

  const { Icon, color } = cfg[t.type];
  return (
    <div className="toast" style={{ boxShadow: `inset 3px 0 0 ${color}, var(--sh-lg)` }}>
      <Icon size={15} style={{ color, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{t.message}</span>
      <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 2, display: "flex" }}>
        <X size={13} />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, remove }: Props) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => <Toast key={t.id} t={t} remove={remove} />)}
    </div>
  );
}
