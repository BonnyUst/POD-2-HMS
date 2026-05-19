const Role = require("../models/role.model");

const roles = [
  {
    code: "OWN",
    name: "Owner",
  },
  {
    code: "ADM",
    name: "Administrator",
  },
  {
    code: "DOC",
    name: "Doctor",
  },
  {
    code: "REC",
    name: "Receptionist",
  },
  {
    code: "CSH",
    name: "Cashier",
  },
  {
    code: "NUR",
    name: "Nurse",
  },
  {
    code: "LAB",
    name: "Lab Technician",
  },
  {
    code: "PHA",
    name: "Pharmacist",
  },
  {
    code: "PAT",
    name: "Patient",
  },
];

const seedRoles = async () => {
  try {
    await Role.insertMany(roles, {
      ordered: false,
    });

    console.log("✅ Roles seeded successfully");
  } catch (error) {
    if (error.code === 11000) {
      console.log("⚡ Roles already seeded");
    } else {
      console.error("❌ Error seeding roles:", error.message);
    }
  }
};

module.exports = seedRoles;
