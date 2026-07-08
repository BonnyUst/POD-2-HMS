import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
@Component({
  selector: 'app-join-us',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './join-us.html',
  styleUrl: './join-us.css'
})
export class JoinUs {

  emailChecked = false;
  isCheckingEmail = false;
  isSubmitting = false;

  successMessage = '';
  errorMessage = '';

  emailForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ])
  });

  joiningDateRangeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const selected = new Date(control.value);
    const today = new Date();

    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    maxDate.setHours(23, 59, 59, 999);

    selected.setHours(0, 0, 0, 0);

    if (selected < minDate || selected > maxDate) {
        return { dateOutOfRange: true };
    }

    return null;
  }

  specializationCommaValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.value) return null;

    const commas = (control.value.match(/,/g) || []).length;

    return commas <= 2 ? null : { maxComma: true };

  }

  joinUsForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
      Validators.pattern(/^[A-Za-z]+$/)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
      Validators.pattern(/^[A-Za-z]+$/)
    ]),
    email: new FormControl({ value: '', disabled: true }),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[6-9][0-9]{9}$')
    ]),
    role: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    designation: new FormControl('', [Validators.required]),
    joiningDate: new FormControl('', [Validators.required,this.joiningDateRangeValidator]),
   
    specialization: new FormControl('', [
        Validators.pattern(/^(?!.*\d)(?!.*[\(\)\[\]\{\}@#$%^&*+=<>!?;:'"`~\\|])[A-Za-z\s\/,-]+$/),
        this.specializationCommaValidator
      ]),

      qualification: new FormControl(''),

      consultationFee: new FormControl<number | null>(null, [
        Validators.min(500)
      ]),

      medicalRegistrationNo: new FormControl('', [
        Validators.pattern(/^[A-Za-z0-9/-]+$/)
      ]),

      availabilityStartTime: new FormControl(''),

      availabilityEndTime: new FormControl(''),

      experienceYears: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(40)
      ])
  });

  constructor(
    readonly auth: Auth,
    readonly cd: ChangeDetectorRef
  ) {

    this.joinUsForm.get('role')?.valueChanges.subscribe((role) => {

      const specialization = this.joinUsForm.get('specialization');
      const qualification = this.joinUsForm.get('qualification');
      const consultationFee = this.joinUsForm.get('consultationFee');
      const medicalRegistrationNo = this.joinUsForm.get('medicalRegistrationNo');
      const availabilityStartTime = this.joinUsForm.get('availabilityStartTime');
      const availabilityEndTime = this.joinUsForm.get('availabilityEndTime');
      const experienceYears = this.joinUsForm.get('experienceYears');

      if (role === 'Doctor') {

        specialization?.setValidators([
          Validators.required,
          Validators.pattern(/^(?!.*\d)(?!.*[\(\)\[\]\{\}@#$%^&*+=<>!?;:'"`~\\|])[A-Za-z\s\/,-]+$/),
          this.specializationCommaValidator
        ]);

        qualification?.setValidators([
          Validators.required
        ]);

        consultationFee?.setValidators([
          Validators.required,
          Validators.min(500)
        ]);

        medicalRegistrationNo?.setValidators([
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9/-]+$/)
        ]);

        availabilityStartTime?.setValidators([
          Validators.required
        ]);

        availabilityEndTime?.setValidators([
          Validators.required
        ]);

        experienceYears?.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(40)
        ]);

      } else {

        specialization?.clearValidators();
        qualification?.clearValidators();
        consultationFee?.clearValidators();
        medicalRegistrationNo?.clearValidators();
        availabilityStartTime?.clearValidators();
        availabilityEndTime?.clearValidators();
        experienceYears?.clearValidators();

        specialization?.setErrors(null);
        qualification?.setErrors(null);
        consultationFee?.setErrors(null);
        medicalRegistrationNo?.setErrors(null);
        availabilityStartTime?.setErrors(null);
        availabilityEndTime?.setErrors(null);
        experienceYears?.setErrors(null);

      }

      specialization?.updateValueAndValidity();
      qualification?.updateValueAndValidity();
      consultationFee?.updateValueAndValidity();
      medicalRegistrationNo?.updateValueAndValidity();
      availabilityStartTime?.updateValueAndValidity();
      availabilityEndTime?.updateValueAndValidity();
      experienceYears?.updateValueAndValidity();

    });

  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  getMaxDate(): string {
    const today = new Date();
    today.setMonth(today.getMonth() + 2);
    return today.toISOString().split('T')[0];
  }


  checkEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.isCheckingEmail = true;

    const email = this.emailForm.get('email')?.value;

    this.auth.checkJoinUsEmail({ email }).subscribe({
      next: (res: any) => {

      this.isCheckingEmail = false;

      if (res.canContinue) {

        this.successMessage = res.message;
        this.errorMessage = '';

        this.emailChecked = true;

        this.joinUsForm.patchValue({
          email: email
        });

      } else {

        this.successMessage = '';
        this.errorMessage = res.message;

        this.emailChecked = false;

      }

      this.cd.detectChanges();
    },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Email already exists';
        this.emailChecked = false;
        this.isCheckingEmail = false;
        this.cd.detectChanges();
      }
    });
  }

  submitJoinUs() {
    if (this.joinUsForm.invalid) {
      this.joinUsForm.markAllAsTouched();
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    const formValue = this.joinUsForm.getRawValue();

    const payload: any = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      phone: formValue.phone,
      role: formValue.role,
      department: formValue.department,
      designation: formValue.designation,
      joiningDate: formValue.joiningDate
    };

    if (formValue.role === 'Doctor') {
      payload.specialization = formValue.specialization;
      payload.qualification = formValue.qualification;
      payload.consultationFee = formValue.consultationFee;
      payload.medicalRegistrationNo = formValue.medicalRegistrationNo;
      payload.availabilityStartTime = formValue.availabilityStartTime;
      payload.availabilityEndTime = formValue.availabilityEndTime;
      payload.experienceYears = formValue.experienceYears;
    }

    this.auth.joinUs(payload).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Join request submitted successfully.';
        this.isSubmitting = false;
        this.emailChecked = false;
        this.emailForm.reset();
        this.joinUsForm.reset();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to submit join request';
        this.isSubmitting = false;
        this.cd.detectChanges();
      }
    });
  }

  resetEmailCheck() {
    this.emailChecked = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.emailForm.reset();
    this.joinUsForm.reset();
  }

  departments = [
    'OPD', 'IPD', 'Lab', 'Pharmacy', 'Admin', 'Front Office'
  ];

  designations = [
    'Junior',
    'Senior'
  ];
}