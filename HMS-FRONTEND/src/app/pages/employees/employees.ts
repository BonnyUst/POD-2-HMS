import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-employees',
  imports: [FormsModule, DatePipe, NgClass],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {

  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchText = '';

  showAddEmployeeModal = false;

  employeeForm = {
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
  ) { }


  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.http.get('http://localhost:5000/api/users/list')
      .subscribe({
        next: (res: any) => {
          this.employees = res.data;
          this.filteredEmployees = res.data;
          console.log('employees', this.employees);
          this.cd.detectChanges();
        },
        error: (err) => {
          console.log('Error fetching employees', err);
        }
      });
  }

  openAddEmployeeModal() {
    this.showAddEmployeeModal = true;
  }

  closeAddEmployeeModal() {
    this.showAddEmployeeModal = false;
  }

  saveEmployee() {
    console.log('Employee form data:', this.employeeForm);

    this.http.post('http://localhost:5000/api/users/create', this.employeeForm)
      .subscribe({
        next: (res: any) => {
          console.log('Employee created successfully:', res);

          this.showAddEmployeeModal = false;

          this.getEmployees();

          this.cd.detectChanges();
        },
        error: (err) => {

         console.log("Full backend error:", err.error);

  if (err.error?.errors?.length > 0) {
    console.log("Validation object:", err.error.errors[0]);
    console.log("Field:", err.error.errors[0].path || err.error.errors[0].param);
    console.log("Message:", err.error.errors[0].msg);
    console.log("Value:", err.error.errors[0].value);
  } else {
    console.log("Backend message:", err.error?.message || err.message);
  }
          
        }
      });

    this.closeAddEmployeeModal();
  }
  filterEmployees() {
    const search = this.searchText.toLowerCase();

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
}