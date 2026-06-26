const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JoinUs = require("./src/models/joinUs.model");

const MONGO_URI = "mongodb://localhost:27017/hms_backend_sprint4";

const seedData = [
  {
    firstName: "Arjun",
    lastName: "Sharma",
    email: "arjun.sharma@example.com",
    phone: "9876543210",
    role: "Nurse",
    department: "OPD",
    designation: "Nurse",
  },
  {
    firstName: "Priya",
    lastName: "Nair",
    email: "priya.nair@example.com",
    phone: "9876543211",
    role: "Receptionist",
    department: "Front Office",
    designation: "Receptionist",
  },
  {
    firstName: "Rahul",
    lastName: "Verma",
    email: "rahul.verma@example.com",
    phone: "9876543212",
    role: "Lab Technician",
    department: "Lab",
    designation: "Administrator",
  },
  {
    firstName: "Sneha",
    lastName: "Pillai",
    email: "sneha.pillai@example.com",
    phone: "9876543213",
    role: "Pharmacist",
    department: "Pharmacy",
    designation: "Receptionist",
  },
  {
    firstName: "Vikram",
    lastName: "Iyer",
    email: "vikram.iyer@example.com",
    phone: "9876543214",
    role: "Doctor",
    department: "OPD",
    designation: "Jr Doctor",
    specialization: "Cardiology",
    qualification: "MBBS MD",
    consultationFee: 500,
    medicalRegistrationNo: "KL-MED-12345",
    availabilityStartTime: "09:00 AM",
    availabilityEndTime: "04:00 PM",
    experienceYears: 8,
  },
  {
    firstName: "Divya",
    lastName: "Menon",
    email: "divya.menon@example.com",
    phone: "9876543215",
    role: "Doctor",
    department: "IPD",
    designation: "Jr Doctor",
    specialization: "Neurology",
    qualification: "MBBS MS",
    consultationFee: 700,
    medicalRegistrationNo: "KL-MED-67890",
    availabilityStartTime: "10:00 AM",
    availabilityEndTime: "05:00 PM",
    experienceYears: 12,
  },
  {
    firstName: "Karthik",
    lastName: "Rajan",
    email: "karthik.rajan@example.com",
    phone: "9876543216",
    role: "Nurse",
    department: "IPD",
    designation: "Nurse",
  },
  {
    firstName: "Meera",
    lastName: "Krishnan",
    email: "meera.krishnan@example.com",
    phone: "9876543217",
    role: "Receptionist",
    department: "Admin",
    designation: "Administrator",
  },
  {
    firstName: "Anil",
    lastName: "Kumar",
    email: "anil.kumar@example.com",
    phone: "9876543218",
    role: "Lab Technician",
    department: "Lab",
    designation: "Administrator",
  },
  {
    firstName: "Lakshmi",
    lastName: "Suresh",
    email: "lakshmi.suresh@example.com",
    phone: "9876543219",
    role: "Doctor",
    department: "OPD",
    designation: "Jr Doctor",
    specialization: "Dermatology",
    qualification: "MBBS MD",
    consultationFee: 600,
    medicalRegistrationNo: "KL-MED-11111",
    availabilityStartTime: "08:00 AM",
    availabilityEndTime: "03:00 PM",
    experienceYears: 5,
  },
  {
    firstName: "Ravi",
    lastName: "Shankar",
    email: "ravi.shankar@example.com",
    phone: "9876543220",
    role: "Nurse",
    department: "IPD",
    designation: "Nurse",
  },
  {
    firstName: "Anitha",
    lastName: "Raj",
    email: "anitha.raj@example.com",
    phone: "9876543221",
    role: "Receptionist",
    department: "Front Office",
    designation: "Receptionist",
  },
  {
    firstName: "Suresh",
    lastName: "Babu",
    email: "suresh.babu@example.com",
    phone: "9876543222",
    role: "Pharmacist",
    department: "Pharmacy",
    designation: "Administrator",
  },
  {
    firstName: "Kavitha",
    lastName: "Nair",
    email: "kavitha.nair@example.com",
    phone: "9876543223",
    role: "Lab Technician",
    department: "Lab",
    designation: "Administrator",
  },
  {
    firstName: "Deepak",
    lastName: "Mohan",
    email: "deepak.mohan@example.com",
    phone: "9876543224",
    role: "Doctor",
    department: "OPD",
    designation: "Jr Doctor",
    specialization: "Orthopedics",
    qualification: "MBBS MS",
    consultationFee: 800,
    medicalRegistrationNo: "KL-MED-22222",
    availabilityStartTime: "09:00 AM",
    availabilityEndTime: "05:00 PM",
    experienceYears: 10,
  },
  {
    firstName: "Sindhu",
    lastName: "Prakash",
    email: "sindhu.prakash@example.com",
    phone: "9876543225",
    role: "Doctor",
    department: "IPD",
    designation: "Jr Doctor",
    specialization: "Pediatrics",
    qualification: "MBBS MD",
    consultationFee: 550,
    medicalRegistrationNo: "KL-MED-33333",
    availabilityStartTime: "08:00 AM",
    availabilityEndTime: "02:00 PM",
    experienceYears: 6,
  },
  {
    firstName: "Manoj",
    lastName: "Thomas",
    email: "manoj.thomas@example.com",
    phone: "9876543226",
    role: "Nurse",
    department: "OPD",
    designation: "Nurse",
  },
  {
    firstName: "Reshma",
    lastName: "George",
    email: "reshma.george@example.com",
    phone: "9876543227",
    role: "Receptionist",
    department: "Admin",
    designation: "Receptionist",
  },
  {
    firstName: "Ajith",
    lastName: "Kumar",
    email: "ajith.kumar@example.com",
    phone: "9876543228",
    role: "Doctor",
    department: "OPD",
    designation: "Jr Doctor",
    specialization: "Psychiatry",
    qualification: "MBBS MD",
    consultationFee: 650,
    medicalRegistrationNo: "KL-MED-44444",
    availabilityStartTime: "10:00 AM",
    availabilityEndTime: "06:00 PM",
    experienceYears: 9,
  },
  {
    firstName: "Nisha",
    lastName: "Chandran",
    email: "nisha.chandran@example.com",
    phone: "9876543229",
    role: "Pharmacist",
    department: "Pharmacy",
    designation: "Receptionist",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB:", MONGO_URI);

    const passwordHash = await bcrypt.hash("Test@1234", 10);

    let inserted = 0;
    let skipped = 0;

    for (const entry of seedData) {
      const exists = await JoinUs.findOne({ email: entry.email });

      if (exists) {
        console.log(`Skipping ${entry.email} — already exists`);
        skipped++;
        continue;
      }

      await JoinUs.create({
        ...entry,
        passwordHash,
        isVerified: true,
        approvalStatus: "PENDING",
        joiningDate: new Date(),
      });

      console.log(
        `Inserted: ${entry.firstName} ${entry.lastName} (${entry.role})`,
      );
      inserted++;
    }

    console.log(`\nDone. ${inserted} inserted, ${skipped} skipped.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
