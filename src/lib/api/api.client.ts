import type { AxiosDefaults, AxiosRequestConfig } from "axios";

import { API } from "@/lib/config/axios.client";

/** Thin wrapper over the browser `API` client. cuewise-be returns plain objects, so `res.data` is the payload. */
class ApiClient {
  get defaults(): AxiosDefaults<unknown> {
    return API.defaults;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await API.get<T>(url, config);
    return res.data;
  }

  async post<T, B = unknown>(url: string, body: B, config?: AxiosRequestConfig): Promise<T> {
    const res = await API.post<T>(url, body, config);
    return res.data;
  }

  async put<T, B = unknown>(url: string, body: B): Promise<T> {
    const res = await API.put<T>(url, body);
    return res.data;
  }

  async patch<T, B = unknown>(url: string, body?: B): Promise<T> {
    const res = await API.patch<T>(url, body);
    return res.data;
  }

  async delete<T>(url: string): Promise<T> {
    const res = await API.delete<T>(url);
    return res.data;
  }

  async downloadBlob(url: string): Promise<Blob> {
    const res = await API.get<Blob>(url, { responseType: "blob" });
    return res.data;
  }
}

export const apiClient = new ApiClient();
