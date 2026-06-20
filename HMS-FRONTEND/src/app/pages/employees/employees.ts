import { Component, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
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
  employees = signal<Employee[]>([]);
  searchText = signal('');
  showAddEmployeeModal = signal(false);

  currentPage = signal(1);
  pageSize = 10;
  totalRecords = signal(0);
  totalPages = signal(0);

  isEditMode = signal(false);
  selectedEmployee = signal<Employee | null>(null);

  loggedInUserId: string | null = null;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  joiningDateRangeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const selected = new Date(control.value);
    const today = new Date();

    const minDate = new Date();
    minDate.setMonth(today.getMonth() - 2);

    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 2);

    if (selected < minDate || selected > maxDate) {
      return { dateOutOfRange: true };
    }

    return null;
  }

  getTodayDate(): string {
    const today = new Date();
    today.setMonth(today.getMonth() - 2);
    return today.toISOString().split('T')[0];
  }

  getMaxDate(): string {
    const today = new Date();
    today.setMonth(today.getMonth() + 2);
    return today.toISOString().split('T')[0];
  }

  employeeForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^(?!\s+$)[A-Za-z\s]+$/)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.pattern(/^(?!\s+$)[A-Za-z\s]+$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
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
      Validators.required,
      this.joiningDateRangeValidator
    ])
  });

  constructor(readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService
      .getAllEmployees(
        this.currentPage(),
        this.pageSize,
        this.searchText().trim()
      )
      .subscribe({
        next: (res) => {
          this.employees.set(res.data);

          this.totalRecords.set(res.pagination.totalRecords);
          this.totalPages.set(res.pagination.totalPages);

          this.currentPage.set(res.pagination.page);
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
        }
      });
  }

  startRecord(): number {
    if (this.totalRecords() === 0) {
      return 0;
    }

    return (this.currentPage() - 1) * this.pageSize + 1;
  }

  endRecord(): number {
    const end = this.currentPage() * this.pageSize;
    return Math.min(end, this.totalRecords());
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.getEmployees();
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.getEmployees();
    }
  }

  filterEmployees(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.currentPage.set(1);
      this.getEmployees();
    }, 300);
  }

  openAddEmployeeModal(): void {
    this.isEditMode.set(false);
    this.selectedEmployee.set(null);

    this.employeeForm.reset();

    this.employeeForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')
    ]);
    this.employeeForm.get('password')?.updateValueAndValidity();

    this.employeeForm.get('role')?.enable();

    this.showAddEmployeeModal.set(true);
  }

  openEditEmployeeModal(employee: Employee): void {
    this.isEditMode.set(true);
    this.selectedEmployee.set(employee);

    this.employeeForm.reset();

    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      password: '',
      phone: employee.phone,
      role: employee.role,
      department: employee.department,
      designation: employee.designation,
      joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : ''
    });

    this.employeeForm.get('password')?.clearValidators();
    this.employeeForm.get('password')?.updateValueAndValidity();

    this.employeeForm.get('role')?.disable();

    this.showAddEmployeeModal.set(true);
  }

  closeAddEmployeeModal(): void {
    this.showAddEmployeeModal.set(false);
    this.isEditMode.set(false);
    this.selectedEmployee.set(null);

    this.employeeForm.reset();

    this.employeeForm.get('role')?.enable();
    this.employeeForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')
    ]);
    this.employeeForm.get('password')?.updateValueAndValidity();
  }

  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const selectedEmployee = this.selectedEmployee();

    if (this.isEditMode() && selectedEmployee) {
      const payload = {
        firstName: this.employeeForm.get('firstName')?.value,
        lastName: this.employeeForm.get('lastName')?.value,
        email: this.employeeForm.get('email')?.value,
        phone: this.employeeForm.get('phone')?.value,
        department: this.employeeForm.get('department')?.value,
        designation: this.employeeForm.get('designation')?.value,
        joiningDate: this.employeeForm.get('joiningDate')?.value,
        status: selectedEmployee.status
      };

      this.employeeService.updateEmployee(
        selectedEmployee.employeeId,
        payload as any
      ).subscribe({
        next: () => {
          alert('Employee updated successfully!');
          this.closeAddEmployeeModal();
          this.getEmployees();
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          alert(err.error?.message || 'Something went wrong');
        }
      });

      return;
    }

    const payload = this.employeeForm.getRawValue();

    this.employeeService.createEmployee(payload as any)
      .subscribe({
        next: () => {
          alert('Employee created successfully!');
          this.closeAddEmployeeModal();
          this.currentPage.set(1);
          this.searchText.set('');
          this.getEmployees();
        },
        error: (err) => {
          console.error('Error creating employee:', err);
          alert(err.error?.message || 'Something went wrong');
        }
      });
  }
}