import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HealthRecordService } from '../../services/health-record.service';

@Component({
  selector: 'app-health-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-records.html',
  styleUrl: './health-records.css'
})
export class HealthRecords implements OnInit {
  loading = signal(false);
  errorMessage = signal('');
  searchText = signal('');

  healthRecords = signal<any[]>([]);

  filteredHealthRecords = computed(() => {
    const search = this.searchText().trim().toLowerCase();

    if (!search) {
      return this.healthRecords();
    }

    return this.healthRecords().filter((record) => {
      const medicalRecordId = record.medicalRecordId?.toLowerCase() || '';
      const appointmentCode = record.appointmentId?.appointmentCode?.toLowerCase() || '';

      const patientFirstName = record.patientId?.firstName?.toLowerCase() || '';
      const patientLastName = record.patientId?.lastName?.toLowerCase() || '';
      const uhid = record.patientId?.UHID?.toLowerCase() || '';

      const doctorFirstName =
        record.doctorId?.userId?.firstName?.toLowerCase() ||
        record.doctorId?.employeeId?.userId?.firstName?.toLowerCase() ||
        '';

      const doctorLastName =
        record.doctorId?.userId?.lastName?.toLowerCase() ||
        record.doctorId?.employeeId?.userId?.lastName?.toLowerCase() ||
        '';

      const status = record.status?.toLowerCase() || '';
      const diagnosis = record.diagnosis?.toLowerCase() || '';

      return (
        medicalRecordId.includes(search) ||
        appointmentCode.includes(search) ||
        patientFirstName.includes(search) ||
        patientLastName.includes(search) ||
        uhid.includes(search) ||
        doctorFirstName.includes(search) ||
        doctorLastName.includes(search) ||
        status.includes(search) ||
        diagnosis.includes(search)
      );
    });
  });

  constructor(
    private healthRecordService: HealthRecordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHealthRecords();
  }

  loadHealthRecords(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.healthRecordService.getHealthRecords().subscribe({
      next: (res: any) => {
        this.healthRecords.set(res.data || []);
        this.loading.set(false);
      },
      error: (error: any) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to load health records'
        );
        this.loading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
  }

  getPatientName(record: any): string {
    const firstName = record.patientId?.firstName || '';
    const lastName = record.patientId?.lastName || '';

    return `${firstName} ${lastName}`.trim() || '-';
  }

  getDoctorName(record: any): string {
    const firstName =
      record.doctorId?.userId?.firstName ||
      record.doctorId?.employeeId?.userId?.firstName ||
      '';

    const lastName =
      record.doctorId?.userId?.lastName ||
      record.doctorId?.employeeId?.userId?.lastName ||
      '';

    return `${firstName} ${lastName}`.trim() || '-';
  }

  getAppointmentCode(record: any): string {
    return record.appointmentId?.appointmentCode || '-';
  }

  getAppointmentId(record: any): string {
    if (typeof record.appointmentId === 'string') {
      return record.appointmentId;
    }

    return record.appointmentId?._id || '';
  }

  viewAppointmentDetails(record: any): void {
    const appointmentId = this.getAppointmentId(record);

    if (!appointmentId) {
      return;
    }

    const basePath = localStorage.getItem('basePath') || '/admin';

    this.router.navigate([`${basePath}/appointments/details`, appointmentId]);
  }
}