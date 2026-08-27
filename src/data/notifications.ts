import type { Module } from "../App";

export type NotifType = "critical" | "emergency" | "lab" | "appointment" | "info";

export interface Notification {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  timestamp: number;
  read: boolean;
  module: Module;
  category: string;
}

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1, type: "critical",
    title: "Critical Lab Result",
    body: "Emmanuel Darko — Troponin I: 12.4 ng/mL. Immediate physician review required.",
    time: "2 min ago", timestamp: Date.now() - 2 * 60 * 1000,
    read: false, module: "laboratory", category: "Laboratory",
  },
  {
    id: 2, type: "emergency",
    title: "New ER Admission",
    body: "Unknown Male ~40s — Cardiac Arrest. Assigned to ER-1, Dr. Frimpong attending.",
    time: "8 min ago", timestamp: Date.now() - 8 * 60 * 1000,
    read: false, module: "emergency", category: "Emergency",
  },
  {
    id: 3, type: "appointment",
    title: "Appointment Overdue",
    body: "Kofi Annan — Surgery consult scheduled at 10:30. Patient waiting in room 4B.",
    time: "22 min ago", timestamp: Date.now() - 22 * 60 * 1000,
    read: false, module: "appointments", category: "Appointments",
  },
  {
    id: 4, type: "info",
    title: "Patient Discharged",
    body: "Ama Owusu — Post-op appendectomy. Follow-up appointment scheduled for next week.",
    time: "1 hr ago", timestamp: Date.now() - 60 * 60 * 1000,
    read: true, module: "patients", category: "Patients",
  },
  {
    id: 5, type: "info",
    title: "Schedule Reminder",
    body: "Dr. Mensah has 4 appointments this afternoon starting at 13:00.",
    time: "2 hr ago", timestamp: Date.now() - 2 * 60 * 60 * 1000,
    read: true, module: "appointments", category: "Appointments",
  },
  {
    id: 6, type: "critical",
    title: "Low Medication Stock",
    body: "Amoxicillin 250mg — 42 units remaining, below reorder threshold of 80. Action needed.",
    time: "3 hr ago", timestamp: Date.now() - 3 * 60 * 60 * 1000,
    read: true, module: "pharmacy", category: "Pharmacy",
  },
  {
    id: 7, type: "lab",
    title: "Lab Results Ready",
    body: "Amara Osei — Complete Blood Count results available for physician review.",
    time: "4 hr ago", timestamp: Date.now() - 4 * 60 * 60 * 1000,
    read: true, module: "laboratory", category: "Laboratory",
  },
  {
    id: 8, type: "info",
    title: "Shift Change Alert",
    body: "Night shift handover complete. 3 critical patients flagged for morning rounds.",
    time: "6 hr ago", timestamp: Date.now() - 6 * 60 * 60 * 1000,
    read: true, module: "staff", category: "HR & Staff",
  },
  {
    id: 9, type: "emergency",
    title: "ICU Bed Capacity Warning",
    body: "ICU at 91.7% capacity — 11 of 12 beds occupied. No free beds for new admissions.",
    time: "8 hr ago", timestamp: Date.now() - 8 * 60 * 60 * 1000,
    read: true, module: "dashboard", category: "System",
  },
  {
    id: 10, type: "info",
    title: "Invoice Overdue",
    body: "INV-8801 — Emmanuel Darko, GHS 4,250. Payment pending for 3 days.",
    time: "Yesterday", timestamp: Date.now() - 24 * 60 * 60 * 1000,
    read: true, module: "billing", category: "Billing",
  },
];
