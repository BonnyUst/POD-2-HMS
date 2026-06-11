import apiClient from '../config/appClient';

export const getPatientProfile = async () => {
  const response = await apiClient.get('/patients/profile');
  return response.data.data;
};