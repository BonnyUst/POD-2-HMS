// For GET response (list of employees)
export interface Employee {
  employeeId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  roleCode: string;
  department: string;
  designation: string;
  joiningDate: string;
  isVerified: boolean;
  status: string;
}

// For POST request (create employee)
export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  department: string;
  designation: string;
  joiningDate: string;
}