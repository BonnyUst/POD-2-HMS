const departments = [
    { deptId: "CAR", deptName: "CARDIOLOGY" },
    { deptId: "NEU", deptName: "NEUROLOGY" },
    { deptId: "ENT", deptName: "ENT" },
    { deptId: "ORT", deptName: "ORTHOPEDICS" },
    { deptId: "DER", deptName: "DERMATOLOGY" },
    { deptId: "PED", deptName: "PEDIATRICS" },
    { deptId: "EMR", deptName: "EMERGENCY" },
    { deptId: "ICU", deptName: "INTENSIVE CARE UNIT" },
    { deptId: "RAD", deptName: "RADIOLOGY" },
    { deptId: "LAB", deptName: "LABORATORY" },
    { deptId: "PHA", deptName: "PHARMACY" },
    { deptId: "FRD", deptName: "FRONT DESK" },
    { deptId: "GEN", deptName: "GENERAL"}
];

module.exports = departments;

// Role Departments 
// DOCTOR Cardiology, ENT, Neurology 
// NURSE ICU, Emergency, Ward
// RECEPTIONIST Front Desk, OPD 
// PHARMACIST Pharmacy

// here i need to change admin may have more depts


// Department (Cardiology)
//         ↓
// adminIds = [Admin1, Admin2]

// Admin1 logs in
//         ↓
// Tries to create Doctor in ENT ❌
//         ↓
// Blocked (not his department)

// Tries to create Doctor in Cardiology ✅
//         ↓
// Allowed