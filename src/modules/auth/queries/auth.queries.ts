import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authService } from "../services/auth.services";
import type { AuthCredentials, CurrentUserProfile } from "../types/auth.types";
import { authKeys } from "./auth.keys";

/** Everything cached belongs to whoever was signed in, so switching users starts from an empty cache. */
function useStartSession() {
  const queryClient = useQueryClient();
  return (profile: CurrentUserProfile) => {
    queryClient.clear();
    queryClient.setQueryData(authKeys.currentProfile(), profile);
  };
}

export function useSignInMutation() {
  const startSession = useStartSession();

  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: (params: AuthCredentials) => authService.login(params),
    onSuccess: startSession,
  });
}

export function useSignUpMutation() {
  const startSession = useStartSession();

  return useMutation({
    mutationKey: authKeys.register(),
    mutationFn: (params: AuthCredentials) => authService.register(params),
    onSuccess: startSession,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authKeys.logout(),
    mutationFn: () => authService.logout(),
    onSuccess: () => queryClient.clear(),
  });
}

export function useCurrentProfileQuery(enabled = true) {
  return useQuery({
    queryKey: authKeys.currentProfile(),
    queryFn: () => authService.me(),
    enabled,
  });
}
