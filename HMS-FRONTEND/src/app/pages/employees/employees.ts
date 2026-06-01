import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, NgClass],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchText = '';
  showAddEmployeeModal = false;

  // Reactive Form
  employeeForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[6-9][0-9]{9}$')
    ]),
    role: new FormControl('', [
      Validators.required
    ]),
    department: new FormControl('', [
      Validators.required
    ]),
    designation: new FormControl('', [
      Validators.required
    ]),
    joiningDate: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private employeeService: EmployeeService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  // ========================
  // GET ALL EMPLOYEES
  // ========================

  getEmployees() {
    this.employeeService.getAllEmployees()
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
    this.employeeForm.reset();
    this.showAddEmployeeModal = true;
  }

  closeAddEmployeeModal() {
    this.showAddEmployeeModal = false;
    this.employeeForm.reset();
  }

  // ========================
  // SAVE EMPLOYEE
  // ========================

  saveEmployee() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const payload = this.employeeForm.value;

    console.log('Employee form data:', payload);

    this.employeeService.createEmployee(payload as any)
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