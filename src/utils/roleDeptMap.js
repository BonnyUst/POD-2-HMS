module.exports = {
    DOCTOR: ["CAR", "ENT", "NEU", "ORT", "DER", "PED","GEN"],
    NURSE: ["ICU", "EMR", "WARD","GEN"], // add WARD if needed
    RECEPTIONIST: ["FRD", "OPD"],
    PHARMACIST: ["PHA"],
};

// Admin (Frontend Form)
//         ↓
// Select Role + Department
//         ↓
// API Request → Backend
//         ↓
// 🔐 Check 1: Is user ADMIN?
//         ↓
// 🔐 Check 2: Is Admin belongs to this department?
//         ↓
// 🔐 Check 3: Role allowed for this department?
//         ↓
// ✅ Create User
//         ↓
// ✅ Create Employee
//         ↓
// 🎯 Success Response