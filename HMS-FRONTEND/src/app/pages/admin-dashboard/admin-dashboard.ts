import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{

  stats={
    totalPatients:0,
    totalEmployees:0,
    pendingApprovals:0
  };

  constructor(private http:HttpClient,
    private cd:ChangeDetectorRef
  ){}

  ngOnInit(): void {
   
    this.http.get('http://localhost:5000/api/admin/dashboard')
    .subscribe((res:any)=>{
      this.stats=res.data;
       this.cd.detectChanges();
      console.log('dashboard stats',this.stats);
    })
  }
  

}
