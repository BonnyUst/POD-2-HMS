import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-doctors',
  imports: [FormsModule, DatePipe, NgClass],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class Doctors implements OnInit {

  doctors: any[] = [];
  filteredDoctors: any[] = [];
  searchText = '';

  showAddDoctorModal = false;

  departments = [
    'OPD',
    'IPD',
    'Lab',
    'Pharmacy',
    'Admin',
    'Front Office'
  ];

  designations = [
    'Jr Doctor'
  ];

  doctorForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',

    department: '',
    designation: 'Jr Doctor',
    joiningDate: '',

    specialization: '',
    qualification: '',
    consultationFee: null,
    medicalRegistrationNo: '',
    availabilityStartTime: '',
    availabilityEndTime: '',
    experienceYears: null
  };

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  getDoctors() {
    this.http.get('http://localhost:5000/api/doctors/list')
      .subscribe({
        next: (res: any) => {
          this.doctors = res.data;
          this.filteredDoctors = res.data;

          console.log('doctors', this.doctors);

          this.cd.detectChanges();
        },
        error: (err) => {
          console.log('Error fetching doctors', err);
        }
      });
  }

  openAddDoctorModal() {
    this.showAddDoctorModal = true;
  }

  closeAddDoctorModal() {
    this.showAddDoctorModal = false;
  }

  saveDoctor() {
    console.log('Doctor form data:', this.doctorForm);

    this.http.post('http://localhost:5000/api/doctors/create', this.doctorForm)
      .subscribe({
        next: (res: any) => {
          console.log('Doctor created successfully:', res);

          this.showAddDoctorModal = false;

          this.resetDoctorForm();

          this.getDoctors();

          this.cd.detectChanges();
        },
        error: (err) => {
          console.log('Full backend error:', err.error);

          if (err.error?.errors?.length > 0) {
            console.log('Validation object:', err.error.errors[0]);
            console.log('Field:', err.error.errors[0].path || err.error.errors[0].param);
            console.log('Message:', err.error.errors[0].msg);
            console.log('Value:', err.error.errors[0].value);
          } else {
            console.log('Backend message:', err.error?.message || err.message);
          }

          this.cd.detectChanges();
        }
      });
  }

  filterDoctors() {
    const search = this.searchText.toLowerCase();

    this.filteredDoctors = this.doctors.filter(doctor => {
      const employee = doctor.employeeId;
      const user = employee?.userId;

      return (
        employee?.employeeCode?.toLowerCase().includes(search) ||
        user?.firstName?.toLowerCase().includes(search) ||
        user?.lastName?.toLowerCase().includes(search) ||
        user?.email?.toLowerCase().includes(search) ||
        employee?.phone?.includes(search) ||
        employee?.department?.toLowerCase().includes(search) ||
        employee?.designation?.toLowerCase().includes(search) ||
        doctor.specialization?.toLowerCase().includes(search) ||
        doctor.qualification?.toLowerCase().includes(search) ||
        doctor.medicalRegistrationNo?.toLowerCase().includes(search)
      );
    });
  }

  resetDoctorForm() {
    this.doctorForm = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',

      department: '',
      designation: 'Jr Doctor',
      joiningDate: '',

      specialization: '',
      qualification: '',
      consultationFee: null,
      medicalRegistrationNo: '',
      availabilityStartTime: '',
      availabilityEndTime: '',
      experienceYears: null
    };
  }
}