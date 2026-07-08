import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: 'toast.html',
  styleUrl: './toast.css',
})
export class Toast { 
  toastService = inject(ToastService);
  toasts = this.toastService.toasts;
}
