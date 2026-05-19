import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employees',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],

  templateUrl: './employees.html',

  styleUrls: ['./employees.css']
})

export class Employees implements OnInit {

  private http = inject(HttpClient);

  private fb = inject(FormBuilder);

  employees: any[] = [];

  filteredEmployees: any[] = [];

  isCreateModalOpen = false;

  isEditMode = false;

  selectedEmployeeId = '';

  searchTerm = '';

  selectedDepartment = '';

  selectedRole = '';

  isAdmin = false;

  userRole = '';

  employeeForm = this.fb.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    email: ['', Validators.required],

    password: [''],

    phone: ['', Validators.required],

    roleName: ['DOCTOR', Validators.required],

    department: ['', Validators.required],

    designation: ['', Validators.required]
  });


  availableDepartments = [

    'OPD',

    'IPD',

    'LAB',

    'PHARMACY'
  ];


  ngOnInit(): void {

    this.checkRole();

    this.getEmployees();
  }


  checkRole() {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {

      const payload =
        JSON.parse(
          atob(token.split('.')[1])
        );

      this.userRole =
        payload.role;

      this.isAdmin =
        this.userRole === 'ADM';

    }
    catch (error) {

      console.log(error);
    }
  }


  getEmployees() {

    this.http.get<any>(
      'http://localhost:3000/api/users'
    )
    .subscribe({

      next: (response) => {

        this.employees =
          response.data;

        this.filteredEmployees =
          response.data;
      },

      error: (error) => {

        console.log(error);
      }
    });
  }


  toggleCreateModal() {

    if (!this.isAdmin) {
      return;
    }

    this.isCreateModalOpen =
      !this.isCreateModalOpen;

    if (!this.isCreateModalOpen) {

      this.employeeForm.reset({

        roleName: 'DOCTOR'
      });

      this.isEditMode = false;

      this.selectedEmployeeId = '';
    }
  }


  openEditModal(employee: any) {

    if (!this.isAdmin) {
      return;
    }

    this.isCreateModalOpen = true;

    this.isEditMode = true;

    this.selectedEmployeeId =
      employee._id;

    this.employeeForm.patchValue({

      firstName:
        employee.firstName,

      lastName:
        employee.lastName,

      email:
        employee.email,

      phone:
        employee.phone,

      roleName:
        employee.roleName,

      department:
        employee.department,

      designation:
        employee.designation
    });

    this.onRoleChange();
  }


  submitEmployeeForm() {

    if (!this.isAdmin) {
      return;
    }

    if (this.employeeForm.invalid) {

      this.employeeForm.markAllAsTouched();

      return;
    }

    if (this.isEditMode) {

      this.updateEmployee();

    } else {

      this.createEmployee();
    }
  }


  createEmployee() {

    this.http.post(
      'http://localhost:3000/api/users',
      this.employeeForm.value
    )
    .subscribe({

      next: () => {

        this.employeeForm.reset({
          roleName: 'DOCTOR'
        });

        this.isCreateModalOpen = false;

        this.getEmployees();
      },

      error: (error) => {

        console.log(error);
      }
    });
  }


  updateEmployee() {

    this.http.put(

      `http://localhost:3000/api/users/${this.selectedEmployeeId}`,

      this.employeeForm.value
    )
    .subscribe({

      next: () => {

        this.employeeForm.reset({
          roleName: 'DOCTOR'
        });

        this.isCreateModalOpen = false;

        this.isEditMode = false;

        this.selectedEmployeeId = '';

        this.getEmployees();
      },

      error: (error) => {

        console.log(error);
      }
    });
  }


  filterEmployees() {

    this.filteredEmployees =
      this.employees.filter((employee) => {

        const fullName =
          `${employee.firstName} ${employee.lastName}`
            .toLowerCase();

        const matchesSearch =

          fullName.includes(
            this.searchTerm.toLowerCase()
          )

          ||

          employee.EMPID
            ?.toLowerCase()
            .includes(
              this.searchTerm.toLowerCase()
            );

        const matchesDepartment =

          this.selectedDepartment

            ?

            employee.department ===
            this.selectedDepartment

            :

            true;

        const matchesRole =

          this.selectedRole

            ?

            employee.role ===
            this.selectedRole

            :

            true;

        return (

          matchesSearch

          &&

          matchesDepartment

          &&

          matchesRole
        );
      });
  }


  onRoleChange() {

    const selectedRole =
      this.employeeForm.value.roleName;

    if (selectedRole === 'ADMINISTRATOR') {

      this.availableDepartments = [
        'ADMIN'
      ];
    }
    else {

      this.availableDepartments = [

        'OPD',

        'IPD',

        'LAB',

        'PHARMACY'
      ];

      if (

        this.employeeForm.value.department ===
        'ADMIN'
      ) {

        this.employeeForm.patchValue({
          department: ''
        });
      }
    }
  }


  deleteEmployee(id: string) {

    if (!this.isAdmin) {
      return;
    }

    const confirmed =
      confirm(
        'Delete employee?'
      );

    if (!confirmed) {
      return;
    }

    this.http.delete(
      `http://localhost:3000/api/users/${id}`
    )
    .subscribe({

      next: () => {

        this.getEmployees();
      },

      error: (error) => {

        console.log(error);
      }
    });
  }


  goToDashboard() {

    window.location.href = '/dashboard';
  }
}