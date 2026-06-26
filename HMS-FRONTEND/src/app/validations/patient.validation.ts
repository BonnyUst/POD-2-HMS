import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

export function futureDateValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value as string | null;

  if (!value) {
    return null;
  }

  const [year, month, day] = value
    .split('-')
    .map(Number);

  const selectedDate = new Date(
    year,
    month - 1,
    day
  );

  const today = new Date();

  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate > today
    ? { futureDate: true }
    : null;
}

/*
  Allows letters, spaces, apostrophes,
  full stops and hyphens.

  Valid examples:
  - Thiruvananthapuram
  - St. Thomas
  - Mary Ann
  - O'Connor
  - Ernakulam-Kochi

  Invalid examples:
  - Kochi123
  - 123456
*/
const nameAndPlacePattern =
  /^(?!\s+$)[A-Za-z][A-Za-z\s.'-]*$/;

export const patientValidators: {
  firstName: ValidatorFn[];
  lastName: ValidatorFn[];
  email: ValidatorFn[];
  phone: ValidatorFn[];
  gender: ValidatorFn[];
  dob: ValidatorFn[];
  bloodGroup: ValidatorFn[];
  city: ValidatorFn[];
  state: ValidatorFn[];
  pincode: ValidatorFn[];
  emergencyContactName: ValidatorFn[];
  emergencyContactPhone: ValidatorFn[];
} = {
  firstName: [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern(
      /^(?!\s+$)[A-Za-z\s]+$/
    )
  ],

  lastName: [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern(
      /^(?!\s+$)[A-Za-z\s]+$/
    )
  ],

  email: [
    Validators.required,
    Validators.email,
    Validators.pattern(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    )
  ],

  phone: [
    Validators.required,
    Validators.pattern(
      /^[6-9][0-9]{9}$/
    )
  ],

  gender: [
    Validators.required
  ],

  dob: [
    Validators.required,
    futureDateValidator
  ],

  bloodGroup: [
    Validators.required
  ],

  city: [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(100),
    Validators.pattern(
      nameAndPlacePattern
    )
  ],

  state: [
    Validators.required
  ],

  pincode: [
    Validators.required,
    Validators.pattern(
      /^[0-9]{6}$/
    )
  ],

  emergencyContactName: [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(100),
    Validators.pattern(
      nameAndPlacePattern
    )
  ],

  emergencyContactPhone: [
    Validators.required,
    Validators.pattern(
      /^[6-9][0-9]{9}$/
    )
  ]
};