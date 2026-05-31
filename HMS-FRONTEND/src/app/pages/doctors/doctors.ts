import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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

  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchText = '';
  showAddDoctorModal = false;

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

  // Reactive Form
  doctorForm = new FormGroup({
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
      Validators.email
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
      Validators.required
    ]),
    specialization: new FormControl('', [
      Validators.required
    ]),
    qualification: new FormControl('', [
      Validators.required
    ]),
    consultationFee: new FormControl(null, [
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
    experienceYears: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(60)
    ])
  }, {
    validators: this.availabilityTimeValidator
  });

  constructor(
    private doctorService: DoctorService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  // ========================
  // AVAILABILITY TIME VALIDATOR
  // ========================

  availabilityTimeValidator(group: AbstractControl): ValidationErrors | null {
    const startTime = group.get('availabilityStartTime')?.value;
    const endTime = group.get('availabilityEndTime')?.value;

    if (!startTime || !endTime) return null;

    const parseTime = (timeStr: string): number => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (end <= start) {
      return { invalidAvailability: true };
    }

    // Minimum 1 hour difference
    if (end - start < 60) {
      return { minAvailability: true };
    }

    return null;
  }

  // ========================
  // GET ALL DOCTORS
  // ========================

  getDoctors() {
    this.doctorService.getAllDoctors()
      .subscribe({
        next: (res) => {
          this.doctors = res.data;
          this.filteredDoctors = res.data;
          console.log('Doctors:', this.doctors);
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching doctors:', err);
        }
      });
  }

  // ========================
  // FILTER / SEARCH
  // ========================

  filterDoctors() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredDoctors = [...this.doctors];
      return;
    }

    this.filteredDoctors = this.doctors.filter(doctor =>
      doctor.employeeCode?.toLowerCase().includes(search) ||
      doctor.firstName?.toLowerCase().includes(search) ||
      doctor.lastName?.toLowerCase().includes(search) ||
      doctor.email?.toLowerCase().includes(search) ||
      doctor.phone?.includes(search) ||
      doctor.specialization?.toLowerCase().includes(search) ||
      doctor.qualification?.toLowerCase().includes(search) ||
      doctor.medicalRegistrationNo?.toLowerCase().includes(search)
    );
  }

  // ========================
  // MODAL CONTROLS
  // ========================

  openAddDoctorModal() {
    this.doctorForm.reset({ designation: 'Jr Doctor' });
    this.showAddDoctorModal = true;
  }

  closeAddDoctorModal() {
    this.showAddDoctorModal = false;
    this.doctorForm.reset({ designation: 'Jr Doctor' });
  }

  // ========================
  // SAVE DOCTOR
  // ========================

  saveDoctor() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const payload = this.doctorForm.value;

    console.log('Doctor form data:', payload);

    this.doctorService.createDoctor(payload as any)
      .subscribe({
        next: (res) => {
          console.log('Doctor created successfully:', res);
          alert('Doctor created successfully!');
          this.closeAddDoctorModal();
          this.getDoctors();
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error creating doctor:', err);
          alert(err.error?.message || 'Something went wrong');
        }
      });
  }

}