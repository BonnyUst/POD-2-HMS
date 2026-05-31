// appointment.model.ts

export interface Appointment {
  _id: string;
  appointmentCode: string;
  patientId: AppointmentPatient;
  doctorId: AppointmentDoctor;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  reason: string;
  createdAt: string;
}

export interface AppointmentPatient {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  UHID: string;
}

export interface AppointmentDoctor {
  _id: string;
  department: string;
  designation: string;
  employeeCode: string;
  userId: AppointmentDoctorUser;
}

export interface AppointmentDoctorUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
}

export interface SlotResponse {
  availabilityStart: string;
  availabilityEnd: string;
  totalSlots: number;
  bookedCount: number;
  availableSlots: string[];
}