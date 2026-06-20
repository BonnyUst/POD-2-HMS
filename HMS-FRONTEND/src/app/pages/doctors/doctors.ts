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

import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, NgClass],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class Doctors implements OnInit {
  doctors = signal<Doctor[]>([]);

  currentPage = signal(1);
  pageSize = 10;
  searchText = signal('');
  totalRecords = signal(0);
  totalPages = signal(0);

  showAddDoctorModal = signal(false);
  isEditMode = signal(false);
  selectedDoctor = signal<Doctor | null>(null);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  departments = [
    'OPD', 'IPD', 'Lab',
    'Pharmacy', 'Admin', 'Front Office'
  ];

  designations = ['Jr Doctor'];

  timeOptions = [
    '08:00 AM', '08:30 AM',
    '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM',
    '08:00 PM'
  ];

  doctorForm = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^(?!\s+$)[A-Za-z\s]+$/)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^(?!\s+$)[A-Za-z\s]+$/)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]),
      department: new FormControl('', [
        Validators.required
      ]),
      designation: new FormControl('Jr Doctor', [
        Validators.required
      ]),
      joiningDate: new FormControl('', [
        Validators.required,
        this.joiningDateRangeValidator
      ]),
      specialization: new FormControl('', [
        Validators.required
      ]),
      qualification: new FormControl('', [
        Validators.required
      ]),
      consultationFee: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1)
      ]),
      medicalRegistrationNo: new FormControl('', [
        Validators.required
      ]),
      availabilityStartTime: new FormControl('', [
        Validators.required
      ]),
      availabilityEndTime: new FormControl('', [
        Validators.required
      ]),
      experienceYears: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(60)
      ])
    },
    {
      validators: this.availabilityTimeValidator
    }
  );

  constructor(
    readonly doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  joiningDateRangeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

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

  availabilityTimeValidator(group: AbstractControl): ValidationErrors | null {
    const startTime = group.get('availabilityStartTime')?.value;
    const endTime = group.get('availabilityEndTime')?.value;

    if (!startTime || !endTime) {
      return null;
    }

    const parseTime = (timeStr: string): number => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (period === 'PM' && hours !== 12) {
        hours += 12;
      }

      if (period === 'AM' && hours === 12) {
        hours = 0;
      }

      return hours * 60 + minutes;
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (end <= start) {
      return { invalidAvailability: true };
    }

    if (end - start < 60) {
      return { minAvailability: true };
    }

    return null;
  }

  getDoctors(): void {
    this.doctorService
      .getAllDoctors(
        this.currentPage(),
        this.pageSize,
        this.searchText().trim()
      )
      .subscribe({
        next: (res) => {
          this.doctors.set(res.data);

          this.totalRecords.set(res.pagination.totalRecords);
          this.totalPages.set(res.pagination.totalPages);
          this.currentPage.set(res.pagination.page);
        },
        error: (err) => {
          console.error('Error fetching doctors:', err);
        }
      });
  }

  get paginatedDoctors(): Doctor[] {
    return this.doctors();
  }

  get startRecord(): number {
    if (this.totalRecords() === 0) {
      return 0;
    }

    return (this.currentPage() - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(
      this.currentPage() * this.pageSize,
      this.totalRecords()
    );
  }

  goToPreviousPage(): void {
    if (this.currentPage() <= 1) {
      return;
    }

    this.currentPage.update((page) => page - 1);
    this.getDoctors();
  }

  goToNextPage(): void {
    if (this.currentPage() >= this.totalPages()) {
      return;
    }

    this.currentPage.update((page) => page + 1);
    this.getDoctors();
  }

  filterDoctors(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.currentPage.set(1);
      this.getDoctors();
    }, 300);
  }

  openAddDoctorModal(): void {
    this.isEditMode.set(false);
    this.selectedDoctor.set(null);

    this.doctorForm.reset({
      designation: 'Jr Doctor'
    });

    this.doctorForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(6)
    ]);

    this.doctorForm.get('password')?.updateValueAndValidity();

    this.showAddDoctorModal.set(true);
  }

  openEditDoctorModal(doctor: Doctor): void {
    this.isEditMode.set(true);
    this.selectedDoctor.set(doctor);

    this.doctorForm.reset();

    this.doctorForm.patchValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      password: '',
      phone: doctor.phone,
      department: doctor.department,
      designation: doctor.designation,
      joiningDate: doctor.joiningDate
        ? doctor.joiningDate.split('T')[0]
        : '',
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      consultationFee: doctor.consultationFee,
      medicalRegistrationNo: doctor.medicalRegistrationNo,
      availabilityStartTime: doctor.availabilityStartTime,
      availabilityEndTime: doctor.availabilityEndTime,
      experienceYears: doctor.experienceYears
    });

    this.doctorForm.get('password')?.clearValidators();
    this.doctorForm.get('password')?.updateValueAndValidity();

    this.showAddDoctorModal.set(true);
  }

  closeAddDoctorModal(): void {
    this.showAddDoctorModal.set(false);
    this.isEditMode.set(false);
    this.selectedDoctor.set(null);

    this.doctorForm.reset({
      designation: 'Jr Doctor'
    });

    this.doctorForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(6)
    ]);

    this.doctorForm.get('password')?.updateValueAndValidity();
  }

  saveDoctor(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const selectedDoctor = this.selectedDoctor();

    if (this.isEditMode() && selectedDoctor) {
      const payload = {
        firstName: this.doctorForm.get('firstName')?.value,
        lastName: this.doctorForm.get('lastName')?.value,
        email: this.doctorForm.get('email')?.value,
        phone: this.doctorForm.get('phone')?.value,
        department: this.doctorForm.get('department')?.value,
        designation: this.doctorForm.get('designation')?.value,
        joiningDate: this.doctorForm.get('joiningDate')?.value,
        status: selectedDoctor.status,

        specialization: this.doctorForm.get('specialization')?.value,
        qualification: this.doctorForm.get('qualification')?.value,
        consultationFee: this.doctorForm.get('consultationFee')?.value,
        medicalRegistrationNo: this.doctorForm.get('medicalRegistrationNo')?.value,
        availabilityStartTime: this.doctorForm.get('availabilityStartTime')?.value,
        availabilityEndTime: this.doctorForm.get('availabilityEndTime')?.value,
        experienceYears: this.doctorForm.get('experienceYears')?.value
      };

      this.doctorService
        .updateDoctor(selectedDoctor.doctorId, payload as any)
        .subscribe({
          next: () => {
            alert('Doctor updated successfully!');
            this.closeAddDoctorModal();
            this.getDoctors();
          },
          error: (err) => {
            console.error('Full error:', err);
            alert(err.error?.message || 'Something went wrong');
          }
        });

      return;
    }

    const payload = this.doctorForm.value;

    this.doctorService.createDoctor(payload as any)
      .subscribe({
        next: () => {
          alert('Doctor created successfully!');
          this.closeAddDoctorModal();

          this.currentPage.set(1);
          this.searchText.set('');
          this.getDoctors();
        },
        error: (err) => {
          alert(err.error?.message || 'Something went wrong');
        }
      });
  }
}