import { useState, useCallback, useEffect } from "react";
import { useIsMobile } from "./hooks/useIsMobile";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import ToastContainer, { type ToastItem, type ToastType } from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientRecord from "./pages/PatientRecord";
import BookAppointment from "./pages/BookAppointment";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import EMR from "./pages/EMR";
import Pharmacy from "./pages/Pharmacy";
import Laboratory from "./pages/Laboratory";
import Billing from "./pages/Billing";
import Staff from "./pages/Staff";
import Emergency from "./pages/Emergency";
import Notifications from "./pages/Notifications";
import BottomNav from "./components/BottomNav";
import HelpPanel from "./components/HelpPanel";
import SystemSettings from "./pages/SystemSettings";
import ChangePassword from "./pages/ChangePassword";
import SignOut from "./pages/SignOut";

export type Module =
  | "dashboard" | "patients" | "doctors" | "appointments"
  | "emr" | "pharmacy" | "laboratory" | "billing" | "staff" | "emergency"
  | "notifications" | "settings" | "password" | "signout"
  | "patient-record" | "book-appointment";

export type ShowToast = (message: string, type?: ToastType) => void;
export type PatientCtx = { id: string; name: string; age: number; gender: string; blood: string; doctor: string; ward: string; status: string; date: string; phone: string; diagnosis: string; };

export default function App() {
  const isMobile = useIsMobile();
  const [active, setActive]       = useState<Module>("dashboard");
  const [sidebar, setSidebar]     = useState(true);
  const [dark, setDark]           = useState(false);
  const [toasts, setToasts]       = useState<ToastItem[]>([]);
  const [notifCount, setNotifCount] = useState(3);
  const [ctxPatient, setCtxPatient] = useState<PatientCtx | null>(null);

  /* Auto-close sidebar on mobile */
  useEffect(() => { if (isMobile) setSidebar(false); }, [isMobile]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const navigate   = useCallback((m: Module) => setActive(m), []);
  const openRecord  = useCallback((p: PatientCtx) => { setCtxPatient(p); setActive("patient-record"); }, []);
  const openBooking = useCallback((p: PatientCtx) => { setCtxPatient(p); setActive("book-appointment"); }, []);
  const showToast: ShowToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message: msg, type }]);
  }, []);
  const removeToast = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), []);

  const pages: Record<Module, React.ReactNode> = {
    dashboard:    <Dashboard navigate={navigate} showToast={showToast} />,
    patients:     <Patients showToast={showToast} onOpenRecord={openRecord} onBookAppt={openBooking} />,
    "patient-record": <PatientRecord patient={ctxPatient} navigate={navigate} onBookAppt={() => ctxPatient && openBooking(ctxPatient)} showToast={showToast} />,
    "book-appointment": <BookAppointment patient={ctxPatient} navigate={navigate} showToast={showToast} />,
    doctors:      <Doctors showToast={showToast} />,
    appointments: <Appointments showToast={showToast} />,
    emr:          <EMR showToast={showToast} />,
    pharmacy:     <Pharmacy showToast={showToast} />,
    laboratory:   <Laboratory showToast={showToast} />,
    billing:      <Billing showToast={showToast} />,
    staff:        <Staff showToast={showToast} />,
    emergency:    <Emergency showToast={showToast} />,
    notifications: <Notifications navigate={navigate} showToast={showToast} setNotifCount={setNotifCount} />,
    settings:      <SystemSettings navigate={navigate} showToast={showToast} />,
    password:      <ChangePassword navigate={navigate} showToast={showToast} />,
    signout:       <SignOut navigate={navigate} showToast={showToast} />,
  };

  return (
    <div style={{ display: "flex", height: "100%", width: "100%", overflow: "hidden", background: "var(--bg)", transition: "background 0.25s" }}>
      {/* Backdrop for mobile sidebar */}
      {isMobile && sidebar && (
        <div className="sidebar-backdrop visible" onClick={() => setSidebar(false)} />
      )}
      <Sidebar active={active} setActive={setActive} open={sidebar} isMobile={isMobile} setOpen={setSidebar} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
        <TopBar module={active} sidebarOpen={sidebar} setSidebarOpen={setSidebar} dark={dark} setDark={setDark} navigate={navigate} notifCount={notifCount} setNotifCount={setNotifCount} />
        <main
          key={active}
          className="fade-in"
          style={{
            flex: 1, overflowY: "auto", overflowX: "hidden",
            padding: "20px 24px",
            paddingBottom: isMobile ? "80px" : "20px",
          }}
        >
          {pages[active]}
        </main>
      </div>
      <ToastContainer toasts={toasts} remove={removeToast} />
      <HelpPanel isMobile={isMobile} />
      {/* Bottom nav — mobile only */}
      {isMobile && (
        <BottomNav
          active={active}
          setActive={m => { setActive(m); setSidebar(false); }}
          onMore={() => setSidebar(s => !s)}
        />
      )}
    </div>
  );
}
