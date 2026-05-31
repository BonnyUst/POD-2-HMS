import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Employee, CreateEmployeePayload } from '../../models/employee.model';
import { ApiResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, DatePipe, NgClass],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {

  private baseUrl = environment.apiUrl;

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchText = '';
  showAddEmployeeModal = false;

  employeeForm: CreateEmployeePayload = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    department: '',
    designation: '',
    joiningDate: ''
  };

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  // ========================
  // GET ALL EMPLOYEES
  // ========================

  getEmployees() {
    this.http.get<ApiResponse<Employee[]>>(`${this.baseUrl}/users/list`)
      .subscribe({
        next: (res) => {
          this.employees = res.data;
          this.filteredEmployees = res.data;
          console.log('Employees:', this.employees);
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
        }
      });
  }

  // ========================
  // FILTER / SEARCH
  // ========================

  filterEmployees() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    this.filteredEmployees = this.employees.filter(employee =>
      employee.employeeCode?.toLowerCase().includes(search) ||
      employee.firstName?.toLowerCase().includes(search) ||
      employee.lastName?.toLowerCase().includes(search) ||
      employee.email?.toLowerCase().includes(search) ||
      employee.phone?.includes(search) ||
      employee.role?.toLowerCase().includes(search) ||
      employee.department?.toLowerCase().includes(search) ||
      employee.designation?.toLowerCase().includes(search)
    );
  }

  // ========================
  // MODAL CONTROLS
  // ========================

  openAddEmployeeModal() {
    this.resetForm();
    this.showAddEmployeeModal = true;
  }

  closeAddEmployeeModal() {
    this.showAddEmployeeModal = false;
    this.resetForm();
  }

  // ========================
  // RESET FORM
  // ========================

  resetForm() {
    this.employeeForm = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      role: '',
      department: '',
      designation: '',
      joiningDate: ''
    };
  }

  // ========================
  // SAVE EMPLOYEE
  // ========================

  saveEmployee() {
    if (
      !this.employeeForm.firstName ||
      !this.employeeForm.lastName ||
      !this.employeeForm.email ||
      !this.employeeForm.password ||
      !this.employeeForm.phone ||
      !this.employeeForm.role ||
      !this.employeeForm.department ||
      !this.employeeForm.designation ||
      !this.employeeForm.joiningDate
    ) {
      alert('Please fill all required fields');
      return;
    }

    console.log('Employee form data:', this.employeeForm);

    this.http.post<ApiResponse<Employee>>(
      `${this.baseUrl}/users/create`,
      this.employeeForm
    )
      .subscribe({
        next: (res) => {
          console.log('Employee created successfully:', res);
          alert('Employee created successfully!');
          this.closeAddEmployeeModal();
          this.getEmployees();
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error creating employee:', err);
          alert(err.error?.message || 'Something went wrong');
        }
      });
  }

}