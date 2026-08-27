export const patients = [
  { id: "P-00421", name: "Amara Osei", age: 34, gender: "F", blood: "O+", doctor: "Dr. Mensah", ward: "Cardiology", status: "Admitted", date: "2026-08-20", phone: "+233 24 456 7890", diagnosis: "Hypertensive Crisis" },
  { id: "P-00422", name: "Kwame Asante", age: 52, gender: "M", blood: "A+", doctor: "Dr. Acheampong", ward: "General", status: "Outpatient", date: "2026-08-21", phone: "+233 20 123 4567", diagnosis: "Diabetes Type 2" },
  { id: "P-00423", name: "Fatima Al-Hassan", age: 27, gender: "F", blood: "B-", doctor: "Dr. Boateng", ward: "Maternity", status: "Admitted", date: "2026-08-22", phone: "+233 55 789 0123", diagnosis: "Prenatal Care" },
  { id: "P-00424", name: "Emmanuel Darko", age: 61, gender: "M", blood: "AB+", doctor: "Dr. Mensah", ward: "ICU", status: "Critical", date: "2026-08-22", phone: "+233 27 654 3210", diagnosis: "Myocardial Infarction" },
  { id: "P-00425", name: "Ama Owusu", age: 19, gender: "F", blood: "O-", doctor: "Dr. Frimpong", ward: "Emergency", status: "Discharged", date: "2026-08-23", phone: "+233 24 321 6540", diagnosis: "Appendicitis (Post-op)" },
  { id: "P-00426", name: "Kofi Annan", age: 44, gender: "M", blood: "A-", doctor: "Dr. Acheampong", ward: "Orthopedics", status: "Admitted", date: "2026-08-19", phone: "+233 20 987 6543", diagnosis: "Fractured Femur" },
  { id: "P-00427", name: "Abena Kumi", age: 38, gender: "F", blood: "B+", doctor: "Dr. Boateng", ward: "Neurology", status: "Outpatient", date: "2026-08-23", phone: "+233 26 543 2109", diagnosis: "Migraine Disorder" },
  { id: "P-00428", name: "Isaac Tetteh", age: 70, gender: "M", blood: "O+", doctor: "Dr. Mensah", ward: "Geriatrics", status: "Admitted", date: "2026-08-18", phone: "+233 54 210 9876", diagnosis: "COPD Exacerbation" },
];

export const doctors = [
  { id: "D-001", name: "Dr. Kweku Mensah", specialty: "Cardiology", dept: "Cardiology", status: "On Duty", patients: 12, rating: 4.9, exp: "14 yrs", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&auto=format" },
  { id: "D-002", name: "Dr. Adwoa Acheampong", specialty: "Endocrinology", dept: "Internal Medicine", status: "On Duty", patients: 9, rating: 4.8, exp: "11 yrs", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&h=80&fit=crop&auto=format" },
  { id: "D-003", name: "Dr. Samuel Boateng", specialty: "OB/GYN", dept: "Maternity", status: "Off Duty", patients: 7, rating: 4.7, exp: "9 yrs", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&h=80&fit=crop&auto=format" },
  { id: "D-004", name: "Dr. Priscilla Frimpong", specialty: "Surgery", dept: "Emergency", status: "On Duty", patients: 6, rating: 4.9, exp: "16 yrs", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&auto=format" },
  { id: "D-005", name: "Dr. Nana Opoku", specialty: "Neurology", dept: "Neurology", status: "On Duty", patients: 8, rating: 4.6, exp: "8 yrs", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=80&h=80&fit=crop&auto=format" },
  { id: "D-006", name: "Dr. Grace Asare", specialty: "Pediatrics", dept: "Pediatrics", status: "Off Duty", patients: 11, rating: 4.8, exp: "12 yrs", img: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=80&h=80&fit=crop&auto=format" },
];

export const appointments = [
  { id: "APT-1041", patient: "Amara Osei", doctor: "Dr. Mensah", dept: "Cardiology", date: "2026-08-23", time: "09:00", type: "Follow-up", status: "Confirmed" },
  { id: "APT-1042", patient: "Kofi Annan", doctor: "Dr. Frimpong", dept: "Surgery", date: "2026-08-23", time: "10:30", type: "Consultation", status: "In Progress" },
  { id: "APT-1043", patient: "Abena Kumi", doctor: "Dr. Opoku", dept: "Neurology", date: "2026-08-23", time: "11:00", type: "New Patient", status: "Waiting" },
  { id: "APT-1044", patient: "Isaac Tetteh", doctor: "Dr. Mensah", dept: "Cardiology", date: "2026-08-23", time: "13:00", type: "Follow-up", status: "Confirmed" },
  { id: "APT-1045", patient: "Fatima Al-Hassan", doctor: "Dr. Boateng", dept: "Maternity", date: "2026-08-24", time: "09:30", type: "Prenatal", status: "Confirmed" },
  { id: "APT-1046", patient: "Kwame Asante", doctor: "Dr. Acheampong", dept: "Endocrinology", date: "2026-08-24", time: "14:00", type: "Follow-up", status: "Pending" },
  { id: "APT-1047", patient: "Emmanuel Darko", doctor: "Dr. Mensah", dept: "Cardiology", date: "2026-08-25", time: "08:00", type: "Post-op", status: "Confirmed" },
  { id: "APT-1048", patient: "Ama Owusu", doctor: "Dr. Frimpong", dept: "Surgery", date: "2026-08-25", time: "10:00", type: "Post-op", status: "Pending" },
];

export const medicines = [
  { id: "MED-001", name: "Amlodipine 5mg", category: "Cardiovascular", stock: 320, threshold: 50, unit: "tablets", expiry: "2027-04", supplier: "PharmaDelta", price: 0.45 },
  { id: "MED-002", name: "Metformin 500mg", category: "Diabetes", stock: 180, threshold: 100, unit: "tablets", expiry: "2027-08", supplier: "MedSupply Co", price: 0.20 },
  { id: "MED-003", name: "Amoxicillin 250mg", category: "Antibiotic", stock: 42, threshold: 80, unit: "capsules", expiry: "2026-12", supplier: "PharmaDelta", price: 0.35 },
  { id: "MED-004", name: "Lisinopril 10mg", category: "Cardiovascular", stock: 290, threshold: 60, unit: "tablets", expiry: "2027-06", supplier: "MedHub GH", price: 0.55 },
  { id: "MED-005", name: "Paracetamol 500mg", category: "Analgesic", stock: 650, threshold: 200, unit: "tablets", expiry: "2027-11", supplier: "GeneriCo", price: 0.08 },
  { id: "MED-006", name: "Morphine 10mg/ml", category: "Opioid", stock: 28, threshold: 40, unit: "ampoules", expiry: "2026-10", supplier: "MedSupply Co", price: 4.20 },
  { id: "MED-007", name: "Ceftriaxone 1g", category: "Antibiotic", stock: 95, threshold: 50, unit: "vials", expiry: "2027-03", supplier: "PharmaDelta", price: 3.80 },
  { id: "MED-008", name: "Atorvastatin 20mg", category: "Lipid-lowering", stock: 415, threshold: 80, unit: "tablets", expiry: "2027-09", supplier: "MedHub GH", price: 0.65 },
];

export const labTests = [
  { id: "LAB-5501", patient: "Emmanuel Darko", test: "Cardiac Troponin I", ordered: "Dr. Mensah", date: "2026-08-23", status: "Complete", result: "12.4 ng/mL", flag: "Critical" },
  { id: "LAB-5502", patient: "Amara Osei", test: "Complete Blood Count", ordered: "Dr. Mensah", date: "2026-08-23", status: "Pending", result: "—", flag: "Normal" },
  { id: "LAB-5503", patient: "Kwame Asante", test: "HbA1c", ordered: "Dr. Acheampong", date: "2026-08-22", status: "Complete", result: "8.3%", flag: "High" },
  { id: "LAB-5504", patient: "Fatima Al-Hassan", test: "Urinalysis", ordered: "Dr. Boateng", date: "2026-08-22", status: "Processing", result: "—", flag: "Normal" },
  { id: "LAB-5505", patient: "Isaac Tetteh", test: "Arterial Blood Gas", ordered: "Dr. Mensah", date: "2026-08-23", status: "Complete", result: "pH 7.31, pO2 68", flag: "Abnormal" },
  { id: "LAB-5506", patient: "Abena Kumi", test: "MRI Brain — Report", ordered: "Dr. Opoku", date: "2026-08-21", status: "Complete", result: "No acute lesion", flag: "Normal" },
];

export const invoices = [
  { id: "INV-8801", patient: "Emmanuel Darko", services: "ICU × 3 days, Cath Lab, Meds", amount: 4250, paid: 0, insurance: "NHIS", status: "Pending", date: "2026-08-22" },
  { id: "INV-8802", patient: "Amara Osei", services: "Cardiology consult, ECG, Meds", amount: 620, paid: 620, insurance: "—", status: "Paid", date: "2026-08-21" },
  { id: "INV-8803", patient: "Kofi Annan", services: "Surgery, Ortho implant, Ward × 4d", amount: 6800, paid: 3400, insurance: "NHIS", status: "Part-paid", date: "2026-08-20" },
  { id: "INV-8804", patient: "Fatima Al-Hassan", services: "Maternity ward, Prenatal tests", amount: 950, paid: 0, insurance: "NHIS", status: "Pending", date: "2026-08-23" },
  { id: "INV-8805", patient: "Ama Owusu", services: "Emergency, Appendectomy, Ward × 2d", amount: 3100, paid: 3100, insurance: "NHIS", status: "Paid", date: "2026-08-22" },
  { id: "INV-8806", patient: "Isaac Tetteh", services: "ICU × 5 days, Ventilator, Meds", amount: 5900, paid: 1200, insurance: "NHIS", status: "Part-paid", date: "2026-08-18" },
];

export const staff = [
  { id: "STF-001", name: "Nurse Esi Adjei", role: "Head Nurse", dept: "ICU", shift: "Day", status: "Active", joined: "2019-03", phone: "+233 24 111 2222" },
  { id: "STF-002", name: "Mr. Yaw Appiah", role: "Lab Technician", dept: "Laboratory", shift: "Day", status: "Active", joined: "2021-06", phone: "+233 20 333 4444" },
  { id: "STF-003", name: "Ms. Akua Bonsu", role: "Pharmacist", dept: "Pharmacy", shift: "Day", status: "Active", joined: "2020-01", phone: "+233 55 555 6666" },
  { id: "STF-004", name: "Mr. Kwesi Ofori", role: "Receptionist", dept: "Front Desk", shift: "Evening", status: "Active", joined: "2022-09", phone: "+233 27 777 8888" },
  { id: "STF-005", name: "Ms. Abena Sarpong", role: "Radiologist", dept: "Radiology", shift: "Night", status: "On Leave", joined: "2018-11", phone: "+233 24 999 0000" },
  { id: "STF-006", name: "Mr. Kofi Mensah", role: "Accountant", dept: "Finance", shift: "Day", status: "Active", joined: "2023-02", phone: "+233 20 121 3434" },
  { id: "STF-007", name: "Ms. Adwoa Kyei", role: "Nurse", dept: "Maternity", shift: "Night", status: "Active", joined: "2021-07", phone: "+233 55 565 6767" },
];

export const emergencies = [
  { id: "EMG-001", patient: "Unknown Male ~40s", type: "Cardiac Arrest", arrived: "08:42", triage: "Red", doctor: "Dr. Frimpong", status: "Resuscitation", room: "ER-1" },
  { id: "EMG-002", patient: "Akosua Mensah, 7", type: "Febrile Seizure", arrived: "09:15", triage: "Orange", doctor: "Dr. Asare", status: "Stabilising", room: "ER-3" },
  { id: "EMG-003", patient: "John Aidoo, 25", type: "Trauma — RTA", arrived: "09:48", triage: "Red", doctor: "Dr. Frimpong", status: "Surgery Prep", room: "ER-2" },
  { id: "EMG-004", patient: "Maame Serwaa, 65", type: "Stroke Suspect", arrived: "10:05", triage: "Orange", doctor: "Dr. Opoku", status: "CT Scan", room: "Radiology" },
  { id: "EMG-005", patient: "Yaw Brempon, 30", type: "Fracture — Upper limb", arrived: "10:22", triage: "Yellow", doctor: "Dr. Boateng", status: "X-Ray", room: "Radiology" },
];

export const patientFlowData = [
  { day: "Mon", admitted: 14, discharged: 11, emergency: 5 },
  { day: "Tue", admitted: 18, discharged: 15, emergency: 8 },
  { day: "Wed", admitted: 12, discharged: 14, emergency: 4 },
  { day: "Thu", admitted: 21, discharged: 17, emergency: 9 },
  { day: "Fri", admitted: 16, discharged: 13, emergency: 6 },
  { day: "Sat", admitted: 9, discharged: 11, emergency: 7 },
  { day: "Sun", admitted: 11, discharged: 8, emergency: 10 },
];

export const revenueData = [
  { month: "Feb", revenue: 48200, expenses: 32100 },
  { month: "Mar", revenue: 52400, expenses: 33800 },
  { month: "Apr", revenue: 49800, expenses: 31200 },
  { month: "May", revenue: 61000, expenses: 35400 },
  { month: "Jun", revenue: 58600, expenses: 37200 },
  { month: "Jul", revenue: 67300, expenses: 38900 },
  { month: "Aug", revenue: 71200, expenses: 40100 },
];

export const deptData = [
  { name: "Cardiology", value: 28 },
  { name: "General", value: 22 },
  { name: "Maternity", value: 17 },
  { name: "Emergency", value: 14 },
  { name: "Orthopedics", value: 11 },
  { name: "Neurology", value: 8 },
];

export const bedOccupancy = [
  { ward: "General", total: 40, occupied: 31 },
  { ward: "ICU", total: 12, occupied: 11 },
  { ward: "Maternity", total: 20, occupied: 14 },
  { ward: "Cardiology", total: 18, occupied: 15 },
  { ward: "Orthopedics", total: 16, occupied: 10 },
  { ward: "Pediatrics", total: 14, occupied: 7 },
  { ward: "Emergency", total: 10, occupied: 8 },
];
