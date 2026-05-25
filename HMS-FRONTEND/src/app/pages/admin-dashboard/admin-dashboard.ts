import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {


  stats = {
    totalPatients: 0,
    totalEmployees: 0,
    pendingApprovals: 0
  };

  employees: any[] = [];
  patients: any[] = [];
  pendingRequests: any[] = [];

  selectedSection = 'employees';

  constructor(private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.getDashboardStats();
    this.showEmployees();

  }

  getDashboardStats() {

    this.http.get('http://localhost:5000/api/dashboard')
      .subscribe((res: any) => {
        this.stats = res.data;
        this.cd.detectChanges();
        console.log('dashboard stats', this.stats);
      })
  }

  showEmployees() {
    this.selectedSection='employees';
    this.http.get('http://localhost:5000/api/users/list')
      .subscribe((res: any) => {
        this.employees = res.data;
        this.cd.detectChanges();
        console.log('dashboard stats', this.employees);
      })
  }

  showPatients() {
    console.log('patients', this.patients);
  this.selectedSection = 'patients';

  this.http.get('http://localhost:5000/api/patients/list')
    .subscribe((res: any) => {
      this.patients = res.data;
      this.cd.detectChanges();
    });
}

showPendingRequests() {
  this.selectedSection = 'pending';

  this.http.get('http://localhost:5000/api/pending-requests')
    .subscribe((res: any) => {
      this.pendingRequests = res.data;
      this.cd.detectChanges();
    });
}


}
