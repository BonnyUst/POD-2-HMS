import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink ,RouterLinkActive} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule,RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',

})
export class Sidebar implements OnInit {

  nodes: any[] = [];//to hold the nodes coming from the backend

  constructor(readonly http: HttpClient,
    readonly cd:ChangeDetectorRef
  ) { }//inject httpClient

//ng is for fetching the data like that 
  ngOnInit(): void {


    //call the backend api
    this.http.get("http://localhost:5000/api/node/list").subscribe((Response: any) => {
      this.nodes = Response.data;
      this.cd.detectChanges();

      console.log("nodes:", this.nodes);
    });
    // ngOnInit(): void {
    //   const role = localStorage.getItem("role");
    //   const token = localStorage.getItem("token");
    //   const nodes = http.post({"/api/node/list", token, role}
    // } raja's notes for understanding the node how it works 
  }

   getFullPath(path: string): string {
    const basePath = localStorage.getItem('basePath') || '';
    return `${basePath}${path}`;
  }
}
