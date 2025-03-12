export const NETWORK_ERROR_MESSAGES = {
  API_REQUEST_FAILED: 'API Request Failed!',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface IPayload {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  header?: HeadersInit;
  body?: string;
}

const defaultHeader = {
  'Content-Type': 'application/json',
};

export const fetchData = async <T>(url: string, payload?: IPayload): Promise<T> => {
  try {
    const { method, header, body } = payload ?? { method: 'GET', header: defaultHeader };
    const defaultHeaders = {
      ...header,
      ...defaultHeader,
    };

    const headers = defaultHeaders;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      credentials: 'include',
      body,
    });
    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message ?? NETWORK_ERROR_MESSAGES.API_REQUEST_FAILED);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (
      (error instanceof TypeError &&
        ['load failed', 'failed to fetch'].includes(
          (error as Error).message.toLocaleLowerCase(),
        )) ||
      (error as Error).message.toLocaleLowerCase().trim().startsWith('networkerror')
    ) {
      throw new Error('Network Error: Unable to connect to the server. Please try again later.');
    }
    throw error as Error;
  }
};
