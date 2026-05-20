
const ROLES = Object.freeze({
  OWNER: { roleId: "OWN", roleName: "OWNER" },
  ADMIN: { roleId: "ADM", roleName: "ADMIN" },
  DOCTOR: { roleId: "DOC", roleName: "DOCTOR" },
  RECEPTIONIST: { roleId: "RECP", roleName: "RECEPTIONIST" },
  CASHIER: { roleId: "CSH", roleName: "CASHIER" },
  NURSE: { roleId: "NUR", roleName: "NURSE" },
  LAB_TECHNICIAN: { roleId: "LAB", roleName: "LAB_TECHNICIAN" },
  PHARMACIST: { roleId: "PHA", roleName: "PHARMACIST" },
  PATIENT: { roleId: "PAT", roleName: "PATIENT" }
});

module.exports = ROLES;
