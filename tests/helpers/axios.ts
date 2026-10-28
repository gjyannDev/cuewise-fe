import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";

export const errorBody = (code: string, message: string, details: unknown = null) => ({
  error: { code, message, details, request_id: "req-1" },
});

/** An AxiosError as axios throws it for a non-2xx response. */
export function axiosErrorWith(status: number, data: unknown) {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, null, {
    status,
    statusText: "",
    headers: {},
    config,
    data,
  });
}

/** An AxiosError with no response (backend down, DNS failure, timeout). */
export const networkError = () => new AxiosError("connect ECONNREFUSED", "ECONNREFUSED");

export const ok = <T>(data: T, status = 200) => ({ data, status }) as AxiosResponse<T>;
