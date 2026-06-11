// src/types/patient.types.ts

export interface PatientProfile {
  patientId?: string;
  UHID?: string;
  uhid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  address?: {
    city?: string;
    state?: string;
    pincode?: string;
  };
}