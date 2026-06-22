import { Component, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Patient, CreatePatientPayload } from '../../models/patients.model';
import { PatientService } from '../../services/patient.service';

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const selected = new Date(control.value);
  const today = new Date();

  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selected > today ? { futureDate: true } : null;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './patients.html',
  styleUrl: './patients.css'
})
export class Patients implements OnInit {
  patients = signal<Patient[]>([]);

  currentPage = signal(1);
  itemsPerPage = 8;
  searchText = signal('');

  totalRecords = signal(0);
  totalPages = signal(0);

  showAddPatientModal = signal(false);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  patientForm = new FormGroup({
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
  Validators.email,
  Validators.pattern(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  )
]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[6-9][0-9]{9}$')
    ]),
    gender: new FormControl('', [
      Validators.required
    ]),
    dob: new FormControl('', [
      Validators.required,
      futureDateValidator
    ]),
    bloodGroup: new FormControl('', [
      Validators.required
    ]),
   address: new FormGroup({
  city: new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(100)
  ]),

  state: new FormControl('', [
    Validators.required
  ]),

  pincode: new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{6}$')
  ])
}),
    emergencyContactName: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    emergencyContactPhone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[6-9][0-9]{9}$')
    ])
  });

  constructor(
    readonly patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.getPatients();
  }

  getPatients(): void {
    this.patientService
      .getAllPatients(
        this.currentPage(),
        this.itemsPerPage,
        this.searchText().trim()
      )
      .subscribe({
        next: (res) => {
          this.patients.set(res.data);
          this.totalRecords.set(res.pagination.totalRecords);
          this.totalPages.set(res.pagination.totalPages);

          console.log('Patients:', this.patients());
          console.log('Pagination:', res.pagination);
        },
        error: (err) => {
          console.error('Error fetching patients:', err);
        }
      });
  }

  startRecord(): number {
    if (this.totalRecords() === 0) {
      return 0;
    }

    return (this.currentPage() - 1) * this.itemsPerPage + 1;
  }

  endRecord(): number {
    const end = this.currentPage() * this.itemsPerPage;
    return Math.min(end, this.totalRecords());
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.getPatients();
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.getPatients();
    }
  }

  filterPatients(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.currentPage.set(1);
      this.getPatients();
    }, 300);
  }

  openAddPatientModal(): void {
    this.patientForm.reset();
    this.showAddPatientModal.set(true);
    document.body.classList.add('modal-open');
  }

  closeAddPatientModal(): void {
    this.showAddPatientModal.set(false);
    this.patientForm.reset();
    document.body.classList.remove('modal-open');
  }

  savePatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

   const payload = this.patientForm.getRawValue() as CreatePatientPayload;

    console.log('Patient form data:', payload);

    this.patientService.createPatient(payload)
      .subscribe({
        next: (res) => {
  console.log('Patient created successfully:', res);

  if (res.data.credentialsEmailSent) {
    alert(
      'Patient created and login credentials emailed successfully!'
    );
  } else {
    alert(
      'Patient created, but login credentials could not be emailed.'
    );
  }

  this.closeAddPatientModal();

  this.currentPage.set(1);
  this.searchText.set('');
  this.getPatients();
},
        error: (err) => {
          console.error('Error creating patient:', err);
          alert(err.error?.message || 'Something went wrong');
        }
      });
  }
}