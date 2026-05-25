import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointments',
  imports: [FormsModule, DatePipe],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements OnInit {

  appointments: any[] = [];
  filteredAppointments: any[] = [];

  patients: any[] = [];
  doctors: any[] = [];

  searchText = '';
  showAddAppointmentModal = false;

  appointmentForm = {
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    timeSlot: '',
    reason: ''
  };

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAppointments();
    this.getPatients();
    this.getDoctors();
  }

  getAppointments() {
    this.http.get('http://localhost:5000/api/appointments/list')
      .subscribe({
        next: (res: any) => {
          this.appointments = res.data;
          this.filteredAppointments = res.data;
       
          this.cd.detectChanges();
        },
        error: (err) => {
          console.log('Error fetching appointments', err);
        }
      });
  }

  getPatients() {
    this.http.get('http://localhost:5000/api/patients/list')
      .subscribe({
        next: (res: any) => {
          this.patients = res.data;
         
        },
        error: (err) => {
          console.log('Error fetching patients', err);
        }
      });
  }

  getDoctors() {
    this.http.get('http://localhost:5000/api/users/list')
      .subscribe({
        next: (res: any) => {
          this.doctors = res.data.filter((employee: any) =>
            employee.userId?.roleId?.name === 'Doctor' ||
            employee.role === 'Doctor' ||
            employee.roleCode === 'DOC'
          );

     
        },
        error: (err) => {
          console.log('Error fetching doctors', err);
        }
      });
  }

  openAddAppointmentModal() {
    this.showAddAppointmentModal = true;
  }

  closeAddAppointmentModal() {
    this.showAddAppointmentModal = false;
  }

  saveAppointment() {
    if (
      !this.appointmentForm.patientId ||
      !this.appointmentForm.doctorId ||
      !this.appointmentForm.appointmentDate ||
      !this.appointmentForm.timeSlot ||
      !this.appointmentForm.reason
    ) {
      alert('Please fill all required fields');
      return;
    }

    console.log('Appointment form data:', this.appointmentForm);

    this.http.post('http://localhost:5000/api/appointments/create', this.appointmentForm)
      .subscribe({
        next: (res: any) => {
          console.log('Appointment created successfully:', res);

          this.showAddAppointmentModal = false;
         
          this.getAppointments();

          this.cd.detectChanges();
        },
        error: (err) => {
          console.log('Error while creating appointment:', err);
          alert(err.error?.message || 'Appointment creation failed');
        }
      });
      this.closeAddAppointmentModal();
  }



  filterAppointments() {
    const search = this.searchText.toLowerCase();

    this.filteredAppointments = this.appointments.filter(appointment =>
      appointment.appointmentCode?.toLowerCase().includes(search) ||
      appointment.patientId?.firstName?.toLowerCase().includes(search) ||
      appointment.patientId?.lastName?.toLowerCase().includes(search) ||
      appointment.patientId?.UHID?.toLowerCase().includes(search) ||
      appointment.doctorId?.userId?.firstName?.toLowerCase().includes(search) ||
      appointment.doctorId?.userId?.lastName?.toLowerCase().includes(search) ||
      appointment.timeSlot?.toLowerCase().includes(search) ||
      appointment.status?.toLowerCase().includes(search) ||
      appointment.reason?.toLowerCase().includes(search)
    );
  }
}