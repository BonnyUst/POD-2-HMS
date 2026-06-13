import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

import AppInput from '@/components/common/AppInput';
import PrimaryButton from '@/components/common/PrimaryButton';
import { registerStyles as styles } from '@/styles/auth/register.style';
import { registerPatient } from '@/services/register.service';
import { RegisterPatientPayload } from '@/types/register.types';

import {
  validateRegisterEmail,
  validateRegisterPassword,
  validateRequiredField,
  validatePhoneNumber,
  validateConfirmPassword,
  validateBloodGroup,
  validateDateOfBirth,
  validateGender,
  validatePincode,
}  from '@/validations/register.validation';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const markTouched = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const showError = (field: string) => {
    return touched[field] ? errors[field] || '' : '';
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const setFieldError = (field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const validateSingleField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'firstName':
        error = validateRequiredField(value, 'First name');
        break;

      case 'lastName':
        error = validateRequiredField(value, 'Last name');
        break;

      case 'email':
        error = validateRegisterEmail(value);
        break;

      case 'password':
        error = validateRegisterPassword(value);
        break;

      case 'confirmPassword':
        error = validateConfirmPassword(password, value);
        break;

      case 'phone':
        error = validatePhoneNumber(value, 'Phone number');
        break;

      case 'gender':
        error = validateGender(value);
        break;

      case 'dob':
        error = validateDateOfBirth(value);
        break;

      case 'bloodGroup':
        error = validateBloodGroup(value);
        break;

      case 'city':
        error = validateRequiredField(value, 'City');
        break;

      case 'stateName':
        error = validateRequiredField(value, 'State');
        break;

      case 'pincode':
        error = validatePincode(value);
        break;

      case 'emergencyContactName':
        error = validateRequiredField(value, 'Emergency contact name');
        break;

      case 'emergencyContactPhone':
        error = validatePhoneNumber(value, 'Emergency contact phone');
        break;
    }

    setFieldError(field, error);
  };

  const touchAndValidate = (field: string, value: string) => {
    markTouched(field);
    validateSingleField(field, value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {
      firstName: validateRequiredField(firstName, 'First name'),
      lastName: validateRequiredField(lastName, 'Last name'),
      email: validateRegisterEmail(email),
      password: validateRegisterPassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),

      phone: validatePhoneNumber(phone, 'Phone number'),
      gender: validateGender(gender),
      dob: validateDateOfBirth(dob),
      bloodGroup: validateBloodGroup(bloodGroup),

      city: validateRequiredField(city, 'City'),
      stateName: validateRequiredField(stateName, 'State'),
      pincode: validatePincode(pincode),

      emergencyContactName: validateRequiredField(
        emergencyContactName,
        'Emergency contact name'
      ),
      emergencyContactPhone: validatePhoneNumber(
        emergencyContactPhone,
        'Emergency contact phone'
      ),
    };

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleRegister = async () => {
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      gender: true,
      dob: true,
      bloodGroup: true,
      city: true,
      stateName: true,
      pincode: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
    });

    if (!validateForm()) {
      return;
    }

    const registerData: RegisterPatientPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      gender: gender.trim().toUpperCase(),
      dob: dob.trim(),
      bloodGroup: bloodGroup.trim().toUpperCase(),
      address: {
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
      },
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
    };

    try {
      setLoading(true);

      await registerPatient(registerData);

      Alert.alert('Success', 'Patient registered successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.log('Patient register error:', error?.response?.data || error);

      Alert.alert(
        'Registration Failed',
        error?.response?.data?.message || 'Unable to register patient'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.registerCard}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>HMS</Text>
          </View>

          <Text style={styles.title}>Patient Registration</Text>

          <Text style={styles.subtitle}>
            Create your patient account to manage appointments
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <AppInput
                  label="First Name"
                  placeholder="First name"
                  value={firstName}
                  onChangeText={(value) => {
                    setFirstName(value);
                    clearError('firstName');
                  }}
                  onBlur={() => touchAndValidate('firstName', firstName)}
                  error={showError('firstName')}
                />
              </View>

              <View style={styles.halfInput}>
                <AppInput
                  label="Last Name"
                  placeholder="Last name"
                  value={lastName}
                  onChangeText={(value) => {
                    setLastName(value);
                    clearError('lastName');
                  }}
                  onBlur={() => touchAndValidate('lastName', lastName)}
                  error={showError('lastName')}
                />
              </View>
            </View>

            <AppInput
              label="Email"
              placeholder="Enter email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                clearError('email');
              }}
              onBlur={() => touchAndValidate('email', email)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={showError('email')}
            />

            <AppInput
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearError('password');
                clearError('confirmPassword');
              }}
              onBlur={() => touchAndValidate('password', password)}
              secureTextEntry
              error={showError('password')}
            />

            <AppInput
              label="Confirm Password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                clearError('confirmPassword');
              }}
              onBlur={() =>
                touchAndValidate('confirmPassword', confirmPassword)
              }
              secureTextEntry
              error={showError('confirmPassword')}
            />

            <AppInput
              label="Phone"
              placeholder="Enter phone number"
              value={phone}
              onChangeText={(value) => {
                setPhone(value);
                clearError('phone');
              }}
              onBlur={() => touchAndValidate('phone', phone)}
              keyboardType="phone-pad"
              error={showError('phone')}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <AppInput
                  label="Gender"
                  placeholder="MALE/FEMALE/OTHER"
                  value={gender}
                  onChangeText={(value) => {
                    setGender(value);
                    clearError('gender');
                  }}
                  onBlur={() => touchAndValidate('gender', gender)}
                  autoCapitalize="characters"
                  error={showError('gender')}
                />
              </View>

              <View style={styles.halfInput}>
                <AppInput
                  label="Blood Group"
                  placeholder="A+"
                  value={bloodGroup}
                  onChangeText={(value) => {
                    setBloodGroup(value);
                    clearError('bloodGroup');
                  }}
                  onBlur={() => touchAndValidate('bloodGroup', bloodGroup)}
                  autoCapitalize="characters"
                  error={showError('bloodGroup')}
                />
              </View>
            </View>

            <AppInput
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              value={dob}
              onChangeText={(value) => {
                setDob(value);
                clearError('dob');
              }}
              onBlur={() => touchAndValidate('dob', dob)}
              error={showError('dob')}
            />

            <Text style={styles.sectionTitle}>Address</Text>

            <AppInput
              label="City"
              placeholder="Enter city"
              value={city}
              onChangeText={(value) => {
                setCity(value);
                clearError('city');
              }}
              onBlur={() => touchAndValidate('city', city)}
              error={showError('city')}
            />

            <AppInput
              label="State"
              placeholder="Enter state"
              value={stateName}
              onChangeText={(value) => {
                setStateName(value);
                clearError('stateName');
              }}
              onBlur={() => touchAndValidate('stateName', stateName)}
              error={showError('stateName')}
            />

            <AppInput
              label="Pincode"
              placeholder="Enter pincode"
              value={pincode}
              onChangeText={(value) => {
                setPincode(value);
                clearError('pincode');
              }}
              onBlur={() => touchAndValidate('pincode', pincode)}
              keyboardType="number-pad"
              error={showError('pincode')}
            />

            <Text style={styles.sectionTitle}>Emergency Contact</Text>

            <AppInput
              label="Emergency Contact Name"
              placeholder="Enter contact name"
              value={emergencyContactName}
              onChangeText={(value) => {
                setEmergencyContactName(value);
                clearError('emergencyContactName');
              }}
              onBlur={() =>
                touchAndValidate(
                  'emergencyContactName',
                  emergencyContactName
                )
              }
              error={showError('emergencyContactName')}
            />

            <AppInput
              label="Emergency Contact Phone"
              placeholder="Enter contact phone"
              value={emergencyContactPhone}
              onChangeText={(value) => {
                setEmergencyContactPhone(value);
                clearError('emergencyContactPhone');
              }}
              onBlur={() =>
                touchAndValidate(
                  'emergencyContactPhone',
                  emergencyContactPhone
                )
              }
              keyboardType="phone-pad"
              error={showError('emergencyContactPhone')}
            />

            <PrimaryButton
              title="Register"
              onPress={handleRegister}
              loading={loading}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>

              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}