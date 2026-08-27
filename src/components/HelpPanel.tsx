import { useState, useRef, useEffect } from "react";
import {
  X, HelpCircle, MessageSquare, ChevronDown, ChevronUp,
  Send, Bot, User, CalendarPlus, Stethoscope, FlaskConical,
  ClipboardList, Pill, AlertTriangle,
} from "lucide-react";

/* ── FAQ data — top 5 daily-use questions only ── */
const FAQ_ITEMS = [
  {
    q: "How do I register a new patient?",
    a: "Go to Patients → click '+ New Patient'. Name and date of birth are required. Click 'Register' and the patient appears at the top of the registry immediately.",
  },
  {
    q: "How can I book an appointment for a patient?",
    a: "In the Patients module, click the patient's row to open their detail panel, then tap 'Book Appt'. Choose a doctor, date, and time slot — the doctor is notified automatically on confirmation.",
  },
  {
    q: "Which doctors are currently on duty?",
    a: "Open the Doctors module. On-duty doctors show a green status indicator. You can also ask the Staff Chat for a live summary.",
  },
  {
    q: "What do I do in a critical emergency?",
    a: "Go to the Emergency module for live triage. Red (Immediate) cases require instant escalation — notify the on-call registrar and attending physician, then update the triage status in the system.",
  },
  {
    q: "How do I view a patient's full medical record?",
    a: "In the Patients module, click the patient's row → tap 'Full Record'. You'll see tabs for Overview, Vitals, Medications, Lab Results, History, and Clinical Notes.",
  },
];

/* ── AI staff chat responses ── */
function getResponse(input: string): string {
  const m = input.toLowerCase();

  if ((m.includes("book") || m.includes("schedule") || m.includes("arrange")) && m.includes("appointment")) {
    return "To book an appointment: open **Patients** → select the patient → click **Book Appt** in the detail panel. Choose a doctor, date and time, then confirm. The assigned doctor is notified right away.\n\nNeed me to walk you through a specific patient?";
  }
  if (m.includes("on duty") || (m.includes("available") && m.includes("doctor"))) {
    return "Currently **on duty**:\n• Dr. Kweku Mensah — Cardiology\n• Dr. Adwoa Acheampong — Endocrinology\n• Dr. Priscilla Frimpong — Surgery\n• Dr. Nana Opoku — Neurology\n\nDr. Boateng and Dr. Asare are currently off duty. For real-time status, check the **Doctors** module.";
  }
  if (m.includes("critical") || m.includes("emergency") || m.includes("triage")) {
    return "For **critical or emergency cases**, go to the **Emergency** module. Cases are colour-coded:\n🔴 Red — Immediate\n🟠 Orange — Urgent\n🟡 Yellow — Less urgent\n🟢 Green — Stable\n\nEnsure the attending physician and charge nurse are notified for any Red triage case.";
  }
  if (m.includes("patient") && (m.includes("register") || m.includes("add") || m.includes("new"))) {
    return "To register a new patient, go to **Patients** and click **+ New Patient**. Fill in the name, date of birth, blood group, contact, and chief complaint, then click **Register**. They will appear at the top of the registry immediately.";
  }
  if (m.includes("record") || m.includes("emr") || m.includes("chart")) {
    return "Full electronic health records are in the **EMR** module (all patients) or via **Full Record** in the Patients detail panel (one patient). You can view vitals, medications, lab results, appointment history, and add clinical notes there.";
  }
  if (m.includes("lab") || m.includes("result") || m.includes("test")) {
    return "Lab requests and results are managed in the **Laboratory** module. Completed results show flags (Normal / High / Critical). Critical results also surface on the Emergency dashboard.";
  }
  if (m.includes("pharmacy") || m.includes("medicine") || m.includes("stock") || m.includes("drug")) {
    return "Pharmacy inventory is in the **Pharmacy** module. Items below threshold are flagged. You can raise restock requests and track dispensing history there.";
  }
  if (m.includes("billing") || m.includes("invoice") || m.includes("payment") || m.includes("nhis")) {
    return "Billing is managed under the **Billing & Finance** module. You can create invoices, record NHIS claims, and track payment status (Paid / Part-paid / Pending) for each patient.";
  }
  if (m.includes("shift") || m.includes("schedule") || m.includes("staff") || m.includes("nurse")) {
    return "Staff scheduling and HR records are in the **HR & Staff** module. You can view shifts, attendance, and department assignments there.";
  }
  if (m.includes("password") || m.includes("login") || m.includes("account")) {
    return "To change your password, click your profile avatar in the top navigation bar, then select **Change Password**. You will need your current password to proceed.";
  }
  if (m.includes("hello") || m.includes("hi") || m.includes("hey") || m.includes("good morning") || m.includes("good afternoon")) {
    return "Hello! I'm MedCore Assistant 👋\n\nI can help you with:\n• Booking appointments for patients\n• Finding available doctors\n• Navigating patient records\n• Emergency triage guidance\n• Lab, pharmacy, and billing queries\n\nWhat do you need help with today?";
  }
  if (m.includes("thank")) {
    return "You're welcome! Let me know if there's anything else you need. 😊";
  }
  return "I'm not sure I understood that completely. Here are some things I can help with:\n\n• **Booking appointments** for patients\n• **Checking which doctors** are on duty\n• **Patient registration** steps\n• **Lab results** and **pharmacy** stock\n• **Emergency triage** guidance\n\nTry rephrasing, or check the **FAQ** tab for common answers.";
}

type Msg = { role: "user" | "bot"; text: string; ts: string };

function formatTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/* Render chat text with basic **bold** markdown */
function ChatText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return (
          <span key={i}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

export default function HelpPanel({ isMobile }: { isMobile: boolean }) {
  const [open, setOpen]           = useState(false);
  const [tab, setTab]             = useState<"faq" | "chat">("faq");
  const [openIdx, setOpenIdx]     = useState<number | null>(null);
  const [messages, setMessages]   = useState<Msg[]>([
    { role: "bot", text: "Hello! I'm MedCore Assistant 👋\n\nI can help you book appointments, check doctor availability, navigate patient records, and much more.\n\nWhat do you need today?", ts: formatTime() },
  ]);
  const [input, setInput]         = useState("");
  const [typing, setTyping]       = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { role: "user", text, ts: formatTime() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role: "bot", text: getResponse(text), ts: formatTime() }]);
    }, delay);
  }

  /* Bottom offset: 80px on mobile (above bottom nav), 24px on desktop */
  const bottom = isMobile ? 88 : 24;

  return (
    <>
      {/* Floating toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="Help & Staff Assistant"
          style={{
            position: "fixed",
            bottom,
            right: 20,
            zIndex: 500,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--text)",
            color: "var(--surface)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--sh-lg)",
            transition: "transform 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <HelpCircle size={20} />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div style={{
          position: "fixed",
          bottom,
          right: 20,
          zIndex: 500,
          width: "min(400px, calc(100vw - 32px))",
          height: "min(640px, calc(100vh - 100px))",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          boxShadow: "var(--sh-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideUpIn 0.2s ease",
        }}>

          {/* Header */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "var(--bg)", flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={16} style={{ color: "var(--surface)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>MedCore Assistant</div>
              <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>● Online</div>
            </div>
            <button className="btn-icon" onClick={() => setOpen(false)}><X size={14} /></button>
          </div>

          {/* Tab strip */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            {(["faq", "chat"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 0",
                  fontSize: 12,
                  fontWeight: tab === t ? 700 : 400,
                  color: tab === t ? "var(--green)" : "var(--text-3)",
                  background: "transparent",
                  border: "none",
                  borderBottom: tab === t ? "2px solid var(--green)" : "2px solid transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.13s",
                  marginBottom: -1,
                }}
              >
                {t === "faq" ? <><HelpCircle size={13} /> FAQ</> : <><MessageSquare size={13} /> Staff Chat</>}
              </button>
            ))}
          </div>

          {/* ── FAQ tab ── */}
          {tab === "faq" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", paddingBottom: 2 }}>
                Top {FAQ_ITEMS.length} questions
              </div>
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 11,
                    border: `1px solid ${openIdx === i ? "var(--border-green)" : "var(--border)"}`,
                    background: openIdx === i ? "var(--green-soft)" : "var(--surface)",
                    overflow: "hidden",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <button
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "14px 16px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      background: openIdx === i ? "var(--green)" : "var(--bg)",
                      border: `1px solid ${openIdx === i ? "var(--green)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 800,
                      color: openIdx === i ? "#fff" : "var(--text-4)",
                      marginTop: 1, transition: "all 0.15s", flexDirection: "column",
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: openIdx === i ? "var(--green)" : "var(--text)", flex: 1, lineHeight: 1.5 }}>{item.q}</span>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>
                      {openIdx === i
                        ? <ChevronUp size={14} style={{ color: "var(--green)" }} />
                        : <ChevronDown size={14} style={{ color: "var(--text-4)" }} />}
                    </span>
                  </button>
                  {openIdx === i && (
                    <div style={{
                      padding: "0 16px 16px 48px",
                      fontSize: 12.5,
                      color: "var(--text-2)",
                      lineHeight: 1.75,
                      borderTop: "1px solid var(--border-green)",
                      paddingTop: 12,
                    }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
              {/* Quick-action chips */}
              <div style={{ paddingTop: 10, borderTop: "1px solid var(--border)", marginTop: 2 }}>
                <div style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 }}>Quick actions</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {[
                    { label: "Book appointment", Icon: CalendarPlus },
                    { label: "Doctors on duty", Icon: Stethoscope },
                    { label: "Lab results", Icon: FlaskConical },
                    { label: "Emergency triage", Icon: AlertTriangle },
                    { label: "Pharmacy stock", Icon: Pill },
                    { label: "Patient records", Icon: ClipboardList },
                  ].map(({ label, Icon }) => (
                    <button
                      key={label}
                      onClick={() => { setTab("chat"); setInput(label); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "7px 12px", borderRadius: 999,
                        background: "var(--bg)", border: "1px solid var(--border)",
                        fontSize: 11, color: "var(--text-2)", cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.12s",
                      }}
                    >
                      <Icon size={10} style={{ color: "var(--green)" }} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Chat tab ── */}
          {tab === "chat" && (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 6px", display: "flex", flexDirection: "column", gap: 10 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-end", gap: 7 }}>
                    {msg.role === "bot" && (
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2 }}>
                        <Bot size={13} style={{ color: "var(--surface)" }} />
                      </div>
                    )}
                    {msg.role === "user" && (
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--green-soft)", border: "1px solid var(--border-green)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2 }}>
                        <User size={13} style={{ color: "var(--green)" }} />
                      </div>
                    )}
                    <div style={{
                      maxWidth: "74%",
                      padding: "9px 12px",
                      borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                      background: msg.role === "user" ? "var(--green)" : "var(--bg)",
                      border: msg.role === "user" ? "none" : "1px solid var(--border)",
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: msg.role === "user" ? "#fff" : "var(--text)",
                    }}>
                      <ChatText text={msg.text} />
                      <div style={{ fontSize: 10, color: msg.role === "user" ? "rgba(255,255,255,0.6)" : "var(--text-4)", marginTop: 4, textAlign: "right" }}>{msg.ts}</div>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Bot size={13} style={{ color: "var(--surface)" }} />
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: "12px 12px 12px 4px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", gap: 5, alignItems: "center" }}>
                      {[0, 1, 2].map(d => (
                        <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-3)", display: "block", animation: `dotBounce 1.1s ${d * 0.18}s ease-in-out infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, flexShrink: 0, background: "var(--bg)" }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Ask about appointments, doctors, patients…"
                  style={{ flex: 1, fontSize: 12, height: 36 }}
                />
                <button
                  onClick={send}
                  style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: input.trim() ? "var(--green)" : "var(--bg)",
                    border: `1px solid ${input.trim() ? "var(--green)" : "var(--border)"}`,
                    cursor: input.trim() ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.13s",
                    fontFamily: "inherit",
                  }}
                >
                  <Send size={14} style={{ color: input.trim() ? "#fff" : "var(--text-4)" }} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
