import axios from "axios";
import { isServer, QueryClient } from "@tanstack/react-query";

function shouldRetry(failureCount: number, error: unknown) {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  // 4xx won't change on retry (bad input, no session, forbidden); only retry network errors and 5xx.
  if (status !== undefined && status >= 400 && status < 500) {
    return false;
  }
  return failureCount < 2;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000, retry: shouldRetry },
      mutations: { retry: false },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * New client per server request (never share cached data between users), one shared client in the
 * browser so the cache survives re-renders and the axios client can clear it on session expiry.
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
