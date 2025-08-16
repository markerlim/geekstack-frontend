import { gsMongoUser, gsSQLUser, Notification } from "../../model/user.model";
import { getApiBaseUrl } from "../../utils/apiBase";
import apiClient from "../../utils/apiClient";

interface InitUserResponse {
  success: boolean;
  message: string;
  gsMongoUser?: gsMongoUser;
  gsSQLUser?: gsSQLUser;
  gsUser?: any;
  error?: any;
}

/**
 * User initialization.
 * If user do not exist on database, profile will be created.
 * Else profile will be pulled from database
 * @param idToken
 * @returns
 */
export async function initUser(): Promise<InitUserResponse> {
  try {
    const response = await apiClient.post(`${getApiBaseUrl()}/user/init`);
    console.log(response);
    return {
      success: true,
      message: response.data.message,
      gsMongoUser: response.data.userObject.gsMongoUser,
      gsSQLUser: response.data.userObject.gsSQLUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      error: error,
    };
  }
}

/**
 * Fetches exchange rate from the backend
 * @param base - Base currency (default: 'SGD')
 * @param symbol - Target currency (default: 'JPY')
 */
export async function getExcRate(base = "SGD", symbol = "JPY"): Promise<string> {
  return apiClient
    .get(`${getApiBaseUrl()}/user/getExcRate`, {
      params: { base, symbol },
    })
    .then((response) => response.data);
}

export async function getNotifications(limit = 10): Promise<Notification[]> {
  return apiClient
    .get<Notification[]>(`${getApiBaseUrl()}/user/notifications`)
    .then((response) => response.data);
}
