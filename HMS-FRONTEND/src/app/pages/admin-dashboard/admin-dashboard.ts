import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  readonly baseUrl = environment.apiUrl;
  readonly dashboardPreviewLimit = 7;

  stats = {
    totalPatients: 0,
    totalEmployees: 0,
    pendingApprovals: 0
  };

  employees: any[] = [];
  patients: any[] = [];
  pendingRequests: any[] = [];

  selectedSection = 'employees';

  // ── Approve state ──
  isApproving: { [key: string]: boolean } = {};

  // ── Reject modal state ──
  showRejectModal = false;
  rejectReason = '';
  selectedRequestId = '';
  isRejecting = false;

  constructor(
    readonly http: HttpClient,
    readonly cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getDashboardStats();
    this.showEmployees();
  }

  getDashboardStats() {
    this.http.get(`${this.baseUrl}/dashboard`)
      .subscribe((res: any) => {
        this.stats = res.data;
        this.cd.detectChanges();
      });
  }

  showEmployees() {
    this.selectedSection = 'employees';
    this.http.get(`${this.baseUrl}/users/list`)
      .subscribe((res: any) => {
        this.employees = res.data;
        this.cd.detectChanges();
      });
  }

  showPatients() {
    this.selectedSection = 'patients';
    this.http.get(`${this.baseUrl}/patients/list`, {
      params: { page: 1, limit: this.dashboardPreviewLimit, search: '' }
    }).subscribe((res: any) => {
      this.patients = res.data;
      this.cd.detectChanges();
    });
  }

  showPendingRequests() {
    this.selectedSection = 'pending';
    this.http.get(`${this.baseUrl}/join-us/pending`)
      .subscribe({
        next: (res: any) => {
          this.pendingRequests = res.data;
          this.cd.detectChanges();
        },
        error: (err) => console.log('Pending API error:', err)
      });
  }

  // ── Approve ──
  approveRequest(requestId: string) {
    this.isApproving[requestId] = true;
    this.http.put(`${this.baseUrl}/join-us/approve/${requestId}`, {})
      .subscribe({
        next: () => {
          this.isApproving[requestId] = false;
          this.getDashboardStats();
          this.showPendingRequests();
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Approve error:', err);
          this.isApproving[requestId] = false;
          this.cd.detectChanges();
        }
      });
  }

  // ── Reject modal ──
  openRejectModal(requestId: string) {
    this.selectedRequestId = requestId;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedRequestId = '';
    this.rejectReason = '';
  }

  confirmReject() {
    if (!this.selectedRequestId) return;
    this.isRejecting = true;

    this.http.put(`${this.baseUrl}/join-us/reject/${this.selectedRequestId}`, {
      reason: this.rejectReason
    }).subscribe({
      next: () => {
        this.isRejecting = false;
        this.showRejectModal = false;
        this.getDashboardStats();
        this.showPendingRequests();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Reject error:', err);
        this.isRejecting = false;
        this.cd.detectChanges();
      }
    });
  }
}