import { QueryClient } from "@tanstack/react-query";

// For static deployment, we don't need API functionality
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  throw new Error("API not available in static deployment");
}

// Simplified query client for static deployment
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
