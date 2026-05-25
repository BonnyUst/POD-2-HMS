import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patients',
  imports: [FormsModule, DatePipe],
  templateUrl: './patients.html',
  styleUrl: './patients.css'
})
export class Patients implements OnInit {

  patients: any[] = [];
  filteredPatients: any[] = [];
  searchText = '';


  showAddPatientModal = false;

  patientForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
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

  activeFilter: string = '';
  selectedBloodGroup: string = '';
  selectedGender: string = '';
  selectedState: string = '';
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getPatients();
  }
  toggleFilter(column: string) {
    this.activeFilter = this.activeFilter === column ? '' : column;
  }

  getPatients() {
    this.http.get('http://localhost:5000/api/patients/list')
      .subscribe((res: any) => {
        this.patients = res.data;
        this.filteredPatients = res.data;
        console.log('patients', this.patients);
      });
  }

  
   openAddPatientModal() {
    this.showAddPatientModal = true;
  }
  closeAddPatientModal() {
    this.showAddPatientModal = false;
  }
savePatient() {
  console.log('Before API:', this.patientForm);

  this.http.post('http://localhost:5000/api/patients/create', this.patientForm)
    .subscribe({
      next: (res: any) => {
        console.log('Patient added successfully:', res);
        console.log('Closing modal now');

        this.showAddPatientModal = false;

        this.getPatients();
      },
      error: (err) => {
        console.log('Error while adding patient:', err);
      }
    });
    this.closeAddPatientModal()
}

  filterPatients() {
    const search = this.searchText.toLowerCase();

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
}