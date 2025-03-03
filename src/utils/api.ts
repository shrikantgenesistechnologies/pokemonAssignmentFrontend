/* eslint-disable @typescript-eslint/no-explicit-any */
export const NETWORK_ERROR_MESSAGES = {
  API_REQUEST_FAILED: 'API Request Failed!',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface IPayload {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  header?: HeadersInit;
  token?: string;
  body?: string;
}

const defaultHeader = {
  'Content-Type': 'application/json',
};

export const fetchData = async <T>(url: string, payload?: IPayload): Promise<T> => {
  try {
    const { method, header, token, body } = payload ?? { method: 'GET', header: defaultHeader };
    const defaultHeaders = {
      ...header,
      ...defaultHeader,
    };

    const headers = token
      ? { ...defaultHeaders, Authorization: `Bearer ${token}` }
      : defaultHeaders;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body,
    });
    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message ?? NETWORK_ERROR_MESSAGES.API_REQUEST_FAILED);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    throw error as Error;
  }
};
