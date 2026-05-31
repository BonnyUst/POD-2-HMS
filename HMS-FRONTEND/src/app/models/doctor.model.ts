// GET response - from getAllDoctors
export interface Doctor {
  doctorId: string;
  employeeId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  consultationFee: number;
  medicalRegistrationNo: string;
  availabilityStartTime: string;
  availabilityEndTime: string;
  experienceYears: number;
  status: string;
  isVerified: boolean;
}

// POST request - for createDoctorByAdmin
export interface CreateDoctorPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  specialization: string;
  qualification: string;
  consultationFee: number | null;
  medicalRegistrationNo: string;
  availabilityStartTime: string;
  availabilityEndTime: string;
  experienceYears: number | null;
}