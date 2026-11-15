import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { profileService } from "../services/profile.services";
import type { Profile } from "../types/profile.types";
import { getResumeUploadErrorResult } from "../utils/resume.utils";
import { profileKeys } from "./profile.keys";

/** The signed-in user's profile, or null when no résumé was uploaded yet. Shared by /resume and the setup form. */
export function useProfileQuery() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: () => profileService.get(),
  });
}

/**
 * Uploads a résumé. The reply is the new profile, so the cache is replaced in one step (the old profile stays on
 * screen until then). With no reply the backend may still have stored it, so the profile is read again.
 */
export function useUploadResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.upload(),
    mutationFn: (file: File) => profileService.upload(file),
    onSuccess: (profile) => {
      queryClient.setQueryData<Profile | null>(profileKeys.detail(), profile);
    },
    onError: (error) => {
      if (getResumeUploadErrorResult(error).kind === "unconfirmed") {
        return queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
      }
    },
  });
}

/** Deletes the profile for good; the cache then says "no résumé", without a GET. */
export function useDeleteProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.remove(),
    mutationFn: () => profileService.remove(),
    onSuccess: () => {
      queryClient.setQueryData<Profile | null>(profileKeys.detail(), null);
    },
  });
}

/**
 * Records that the user has no profile, for another feature that learned it from cuewise-be (a 409
 * PROFILE_REQUIRED on interview start). That reply is proof enough, so nothing is refetched: a refetch that failed
 * would leave the old profile cached and the résumé option switched on.
 */
export function useMarkProfileMissing() {
  const queryClient = useQueryClient();

  return () => queryClient.setQueryData<Profile | null>(profileKeys.detail(), null);
}
