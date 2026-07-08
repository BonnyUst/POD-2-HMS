import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  resetPasswordForm: FormGroup;

  token = '';

  isLoading = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    readonly fb: FormBuilder,
    readonly auth: Auth,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly toastService: ToastService,
    readonly cd: ChangeDetectorRef
  ) {

    this.token =
      this.route.snapshot.paramMap.get('token') || '';

    this.resetPasswordForm = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
          ],
        ],

        confirmPassword: [
          '',
          Validators.required,
        ],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  passwordMatchValidator(form: FormGroup) {

    const password = form.get('newPassword')?.value;

    const confirm = form.get('confirmPassword')?.value;

    return password === confirm
      ? null
      : { passwordMismatch: true };
  }

  resetPassword(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.auth
      .resetPassword(
        this.token,
        this.newPassword?.value,
        this.confirmPassword?.value
      )
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({

        next: (res) => {

          this.successMessage = res.message;

          this.toastService.success(res.message);

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);

        },

        error: (err) => {

          this.errorMessage =
            err?.error?.message ||
            'Unable to reset password';

          this.toastService.error(this.errorMessage);
        },

      });

  }

}