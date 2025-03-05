import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError } from 'axios';

// Types for the portal-specific globals
declare global {
  interface Window {
    shell: {
      getTokenDeferred(): JQueryDeferred<string>;
    };
    validateLoginSession(data: unknown, textStatus: string, jqXHR: JQueryXHR, resolve: (value: unknown) => void): void;
  }
}

// Define a type for JQuery deferred object
interface JQueryDeferred<T> {
  done(callback: (value: T) => void): JQueryDeferred<T>;
  fail(callback: (error: Error) => void): JQueryDeferred<T>;
}

// Interface for API error responses
export interface ApiErrorResponse {
  ErrorMessage: string;
  ErrorDetails?: string;
  StatusCode?: number;
}

// Generic response type for better type safety
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 60000, // Default timeout of 60 seconds
    });
  }
  
  /**
   * Gets the anti-forgery token using the portal's getTokenDeferred method
   */
  private getAntiForgeryToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      window.shell.getTokenDeferred()
        .done((token: string) => resolve(token))
        .fail((error: Error) => reject(new Error('Failed to acquire authentication token')));
    });
  }
  
  /**
   * Makes a safe API request that handles token acquisition and session validation
   * This mimics exactly how the original safeAjax function worked
   * 'X-Requested-With': 'XMLHttpRequest' is specifically required when calling
   * the InitializeUpload or UploadBlock calls otherwise you will get a 500 that the
   * anti-forgery token is missing.
   */
  async safeRequest<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    const token = await this.getAntiForgeryToken();
    const headers = {
      ...config.headers,
      __RequestVerificationToken: token,
      'X-Requested-With': 'XMLHttpRequest' // Add the X-Requested-With header
    };
    return new Promise<T>((resolve, reject) => {
      this.axiosInstance({ ...config, headers })
        .then((response: AxiosResponse) => {
          const jqXHR = {
            getAllResponseHeaders: () => Object.entries(response.headers)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n'),
            getResponseHeader: (name: string) => response.headers[name] || null,
            status: response.status,
            statusText: response.statusText
          } as unknown as JQueryXHR;

          window.validateLoginSession(response.data, response.statusText, jqXHR, (validatedData: unknown) => {
            resolve((validatedData !== undefined ? validatedData : response.data) as T);
          });
          return response; // Ensure the promise chain is correctly handled
        })
        .catch((error: unknown) => {
          if (axios.isCancel(error)) {
            reject(new Error('Request canceled'));
            return;
          }

          let errorMessage = 'Request failed';
          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.ErrorMessage || error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          reject(new Error(errorMessage));
        });
    });
  }
  
  /**
   * GET request with token and session validation
   */
  async get<T = unknown>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.safeRequest<T>({
      ...config,
      method: 'GET',
      url
    });
  }
  
  /**
   * POST request with token and session validation
   */
  async post<T = unknown, D = Record<string, unknown>>(url: string, data?: D, config: AxiosRequestConfig = {}): Promise<T> {
    return this.safeRequest<T>({
      ...config,
      method: 'POST',
      url,
      data
    });
  }
  
  /**
   * PUT request with token and session validation
   */
  async put<T = unknown, D = Record<string, unknown>>(url: string, data?: D, config: AxiosRequestConfig = {}): Promise<T> {
    return this.safeRequest<T>({
      ...config,
      method: 'PUT',
      url,
      data
    });
  }
  
  /**
   * DELETE request with token and session validation
   */
  async delete<T = unknown>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.safeRequest<T>({
      ...config,
      method: 'DELETE',
      url
    });
  }
}

// Export a singleton instance
export const httpClient = new HttpClient();
