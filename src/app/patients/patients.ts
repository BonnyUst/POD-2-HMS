import {

  Component,

  OnInit,

  inject

} from '@angular/core';

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

  selector: 'app-patients',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    FormsModule,

    RouterModule,

  ],

  templateUrl: './patients.html',

  styleUrls: ['./patients.css']
})

export class Patients implements OnInit {

  private http = inject(HttpClient);

  private fb = inject(FormBuilder);


  patients: any[] = [];

  filteredPatients: any[] = [];


  searchTerm = '';

  selectedGender = '';

  selectedBloodGroup = '';


  isAdmin = false;

  isReceptionist = false;

  canManagePatients = false;

  userRole = '';

  isCreateModalOpen = false;

  isEditMode = false;

  selectedPatientId = '';


  patientForm = this.fb.group({

    fullName: ['', Validators.required],

    email: ['', Validators.required],

    phone: ['', Validators.required],

    gender: ['', Validators.required],

    dob: ['', Validators.required],

    bloodGroup: ['', Validators.required],

    address: ['', Validators.required],

    emergencyContactName: ['', Validators.required],

    emergencyContactPhone: ['', Validators.required]
  });


  ngOnInit(): void {

    this.checkRole();

    this.getPatients();
  }


  checkRole() {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {

      const payload =
        JSON.parse(atob(token.split('.')[1]));

      this.userRole =
        payload.role;

      this.isAdmin =
        this.userRole === 'ADM';

      this.isReceptionist =
        this.userRole === 'REC';

      this.canManagePatients =

        this.isAdmin

        ||

        this.isReceptionist;

    }
    catch (error) {

      console.log(error);
    }
  }


  getPatients() {

    this.http.get<any>(
      'http://localhost:3000/api/patients'
    )
    .subscribe({

      next: (response) => {

        this.patients =
          response.data;

        this.filteredPatients =
          response.data;
      },

      error: (error) => {

        console.log(error);
      }
    });
  }


  filterPatients() {

    this.filteredPatients =
      this.patients.filter((patient) => {

        const fullName =
          patient.fullName?.toLowerCase() || '';

        const matchesSearch =

          fullName.includes(
            this.searchTerm.toLowerCase()
          )

          ||

          patient.UHID
            ?.toLowerCase()
            .includes(
              this.searchTerm.toLowerCase()
            );


        const matchesGender =

          this.selectedGender

            ?

            patient.gender ===
            this.selectedGender

            :

            true;


        const matchesBloodGroup =

          this.selectedBloodGroup

            ?

            patient.bloodGroup ===
            this.selectedBloodGroup

            :

            true;


        return (

          matchesSearch

          &&

          matchesGender

          &&

          matchesBloodGroup
        );
      });
  }


  toggleCreateModal() {

    if (!this.canManagePatients) {
      return;
    }

    this.isCreateModalOpen =
      !this.isCreateModalOpen;

    if (!this.isCreateModalOpen) {

      this.patientForm.reset();

      this.isEditMode = false;

      this.selectedPatientId = '';
    }
  }


  openEditModal(patient: any) {

    if (!this.canManagePatients) {
      return;
    }

    this.isCreateModalOpen = true;

    this.isEditMode = true;

    this.selectedPatientId =
      patient._id;

    this.patientForm.patchValue({

      fullName:
        patient.fullName,

      email:
        patient.email,

      phone:
        patient.phone,

      gender:
        patient.gender,

      dob:
        patient.dob
          ?.split('T')[0],

      bloodGroup:
        patient.bloodGroup,

      address:
        patient.address,

      emergencyContactName:
        patient.emergencyContactName,

      emergencyContactPhone:
        patient.emergencyContactPhone
    });
  }


  submitPatientForm() {

    if (!this.canManagePatients) {
      return;
    }

    if (this.patientForm.invalid) {

      this.patientForm.markAllAsTouched();

      return;
    }

    if (this.isEditMode) {

      this.updatePatient();

    } else {

      this.createPatient();
    }
  }


  createPatient() {

    this.http.post(
      'http://localhost:3000/api/patients',
      this.patientForm.value
    )
    .subscribe({

      next: () => {

        this.patientForm.reset();

        this.isCreateModalOpen = false;

        this.getPatients();
      },

      error: (error) => {

        console.log(error);
      }
    });
  }


  updatePatient() {

    this.http.put(

      `http://localhost:3000/api/patients/${this.selectedPatientId}`,

      this.patientForm.value
    )
    .subscribe({

      next: () => {

        this.patientForm.reset();

        this.isCreateModalOpen = false;

        this.isEditMode = false;

        this.selectedPatientId = '';

        this.getPatients();
      },

      error: (error) => {

        console.log(error);
      }
    });
  }


  deletePatient(id: string) {

    if (!this.isAdmin) {
      return;
    }

    const confirmed =
      confirm(
        'Delete patient?'
      );

    if (!confirmed) {
      return;
    }

    this.http.delete(
      `http://localhost:3000/api/patients/${id}`
    )
    .subscribe({

      next: () => {

        this.getPatients();
      },

      error: (error) => {

        console.log(error);
      }
    });
  }
}