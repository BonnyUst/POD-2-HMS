import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Patient, CreatePatientPayload } from '../../models/patients.model';
import { ApiResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './patients.html',
  styleUrl: './patients.css'
})
export class Patients implements OnInit {

  private baseUrl = environment.apiUrl;

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchText = '';
  showAddPatientModal = false;

  patientForm: CreatePatientPayload = {
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    address: {
      city: '',
      state: '',
      pincode: ''
    },
    emergencyContactName: '',
    emergencyContactPhone: ''
  };

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getPatients();
  }

  // ========================
  // GET ALL PATIENTS
  // ========================

  getPatients() {
    this.http.get<ApiResponse<Patient[]>>(`${this.baseUrl}/patients/list`)
      .subscribe({
        next: (res) => {
          this.patients = res.data;
          this.filteredPatients = res.data;
          console.log('Patients:', this.patients);
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching patients:', err);
        }
      });
  }

  // ========================
  // FILTER / SEARCH
  // ========================

  filterPatients() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter(patient =>
      patient.UHID?.toLowerCase().includes(search) ||
      patient.firstName?.toLowerCase().includes(search) ||
      patient.lastName?.toLowerCase().includes(search) ||
      patient.phone?.includes(search) ||
      patient.gender?.toLowerCase().includes(search) ||
      patient.bloodGroup?.toLowerCase().includes(search) ||
      patient.city?.toLowerCase().includes(search) ||
      patient.state?.toLowerCase().includes(search) ||
      patient.createdByName?.toLowerCase().includes(search)
    );
  }

  // ========================
  // MODAL CONTROLS
  // ========================

  openAddPatientModal() {
    this.resetForm();
    this.showAddPatientModal = true;
  }

  closeAddPatientModal() {
    this.showAddPatientModal = false;
    this.resetForm();
  }

  // ========================
  // RESET FORM
  // ========================

  resetForm() {
    this.patientForm = {
      firstName: '',
      lastName: '',
      phone: '',
      gender: '',
      dob: '',
      bloodGroup: '',
      address: {
        city: '',
        state: '',
        pincode: ''
      },
      emergencyContactName: '',
      emergencyContactPhone: ''
    };
  }

  // ========================
  // SAVE PATIENT
  // ========================

  savePatient() {
    if (
      !this.patientForm.firstName ||
      !this.patientForm.lastName ||
      !this.patientForm.phone ||
      !this.patientForm.gender ||
      !this.patientForm.dob ||
      !this.patientForm.bloodGroup ||
      !this.patientForm.emergencyContactName ||
      !this.patientForm.emergencyContactPhone
    ) {
      alert('Please fill all required fields');
      return;
    }

    console.log('Patient form data:', this.patientForm);

    this.http.post<ApiResponse<Patient>>(
      `${this.baseUrl}/patients/create`,
      this.patientForm
    )
      .subscribe({
        next: (res) => {
          console.log('Patient created successfully:', res);
          alert('Patient created successfully!');
          this.closeAddPatientModal();
          this.getPatients();
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error creating patient:', err);
          alert(err.error?.message || 'Something went wrong');
        }
      });
  }

}