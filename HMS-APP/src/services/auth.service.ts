import apiClient from "../config/appClient";
import { tokenStorage } from "../storage/tokenStorage";

export const login = async (
  email: string,
  password: string
) => {
  const response = await apiClient.post(
    "/auth/login",
    {
      email: email.trim().toLowerCase(),
      password,
    }
  );

  const {
    accessToken,
    refreshToken,
    user,
  } = response.data.data;

  if (!accessToken || !refreshToken) {
    throw new Error(
      "Authentication tokens were not returned by the server"
    );
  }

  await tokenStorage.saveTokens(
    accessToken,
    refreshToken
  );

  return user;
};

export interface ChangeFirstLoginPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export const changeFirstLoginPassword = async (
  payload: ChangeFirstLoginPasswordPayload
) => {
  const response = await apiClient.put(
    "/auth/first-login/change-password",
    payload
  );

  return response.data;
};

export const logout = async () => {
  await tokenStorage.clear();
};