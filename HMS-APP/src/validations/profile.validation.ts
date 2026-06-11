import {
  PatientProfileFormData,
  ProfileValidationErrors,
} from '@/types/patient.types';

export const validateProfileForm = (
  formData: PatientProfileFormData
): ProfileValidationErrors => {
  const errors: ProfileValidationErrors = {};

  const nameRegex = /^[A-Za-z ]{2,30}$/;
  const phoneRegex = /^[6-9][0-9]{9}$/;
  const pincodeRegex = /^[0-9]{6}$/;

  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (!nameRegex.test(formData.firstName.trim())) {
    errors.firstName = 'Enter a valid first name';
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (!nameRegex.test(formData.lastName.trim())) {
    errors.lastName = 'Enter a valid last name';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!phoneRegex.test(formData.phone.trim())) {
    errors.phone = 'Enter a valid 10-digit mobile number';
  }

  if (!formData.gender.trim()) {
    errors.gender = 'Gender is required';
  }

  if (!formData.dob.trim()) {
    errors.dob = 'Date of birth is required';
  } else {
    const dobDate = new Date(formData.dob);
    const today = new Date();

    if (Number.isNaN(dobDate.getTime()) || dobDate >= today) {
      errors.dob = 'Enter a valid date of birth';
    }
  }

  if (!formData.bloodGroup.trim()) {
    errors.bloodGroup = 'Blood group is required';
  }

  if (!formData.address.city.trim()) {
    errors.city = 'City is required';
  }

  if (!formData.address.state.trim()) {
    errors.state = 'State is required';
  }

  if (!formData.address.pincode.trim()) {
    errors.pincode = 'Pincode is required';
  } else if (!pincodeRegex.test(formData.address.pincode.trim())) {
    errors.pincode = 'Enter a valid 6-digit pincode';
  }

  if (!formData.emergencyContactName.trim()) {
    errors.emergencyContactName = 'Emergency contact name is required';
  } else if (!nameRegex.test(formData.emergencyContactName.trim())) {
    errors.emergencyContactName = 'Enter a valid emergency contact name';
  }

  if (!formData.emergencyContactPhone.trim()) {
    errors.emergencyContactPhone = 'Emergency contact phone is required';
  } else if (!phoneRegex.test(formData.emergencyContactPhone.trim())) {
    errors.emergencyContactPhone = 'Enter a valid emergency contact number';
  }

  if (
    formData.phone.trim() &&
    formData.emergencyContactPhone.trim() &&
    formData.phone.trim() === formData.emergencyContactPhone.trim()
  ) {
    errors.emergencyContactPhone =
      'Emergency contact number should be different';
  }

  return errors;
};

export const hasProfileValidationErrors = (
  errors: ProfileValidationErrors
): boolean => Object.keys(errors).length > 0;