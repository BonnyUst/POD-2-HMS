import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApprovalsService } from '../../services/approval.service';
import { ApprovalRequest } from '../../models/approval.model';

@Component({
  selector: 'app-approvals',
  imports: [CommonModule, FormsModule],
  templateUrl: './approvals.html',
  styleUrl: './approvals.css',
})
export class Approvals implements OnInit {
  pendingRequests = signal<ApprovalRequest[]>([]);
  expandedRequestId = signal<string | null>(null);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = 10;
  totalRecords = signal(0);
  totalPages = signal(0);

  showRejectModal = signal(false);
  rejectReason = signal('');
  pendingRejectId = signal<string | null>(null);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(readonly approvalsService: ApprovalsService) {}

  ngOnInit(): void {
    this.getPendingRequests();
  }

  getPendingRequests(): void {
    this.approvalsService
      .getPendingRequests(this.currentPage(), this.pageSize, this.searchText().trim())
      .subscribe({
        next: (res) => {
          this.pendingRequests.set(res.data);
          this.totalRecords.set(res.pagination.totalRecords);
          this.totalPages.set(res.pagination.totalPages);
          this.currentPage.set(res.pagination.page);
        },
        error: (err) => {
          console.error('Error fetching pending approvals:', err);
        },
      });
  }

  filterRequests(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.currentPage.set(1);
      this.getPendingRequests();
    }, 300);
  }

  get startRecord(): number {
    if (this.totalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(this.currentPage() * this.pageSize, this.totalRecords());
  }

  goToPreviousPage(): void {
    if (this.currentPage() <= 1) return;
    this.currentPage.update((page) => page - 1);
    this.getPendingRequests();
  }

  goToNextPage(): void {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.update((page) => page + 1);
    this.getPendingRequests();
  }

  toggleDetails(requestId: string): void {
    this.expandedRequestId.set(this.expandedRequestId() === requestId ? null : requestId);
  }

  approveRequest(requestId: string): void {
    this.approvalsService.approveRequest(requestId).subscribe({
      next: () => {
        this.expandedRequestId.set(null);
        this.getPendingRequests();
      },
      error: (err) => {
        console.error('Approval failed:', err);
      },
    });
  }

  openRejectModal(requestId: string): void {
    this.pendingRejectId.set(requestId);
    this.rejectReason.set('');
    this.showRejectModal.set(true);
  }

  closeRejectModal(): void {
    this.showRejectModal.set(false);
    this.pendingRejectId.set(null);
    this.rejectReason.set('');
  }

  confirmReject(): void {
    const requestId = this.pendingRejectId();
    if (!requestId) return;

    this.approvalsService.rejectRequest(requestId, this.rejectReason().trim()).subscribe({
      next: () => {
        this.closeRejectModal();
        this.expandedRequestId.set(null);
        this.getPendingRequests();
      },
      error: (err) => {
        console.error('Rejection failed:', err);
      },
    });
  }
}
