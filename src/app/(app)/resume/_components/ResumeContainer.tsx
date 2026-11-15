"use client";

import { RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationCallbacks } from "@/hooks/use-mutation-callback";
import { ResumeProfileView } from "@/modules/profile/components/resume/ResumeProfileView";
import { ResumeUploadCard } from "@/modules/profile/components/resume/ResumeUploadCard";
import { RESUME_PAGE_COPY, RESUME_PROFILE_COPY, RESUME_UPLOAD_COPY } from "@/modules/profile/constants";
import {
  useDeleteProfileMutation,
  useProfileQuery,
  useUploadResumeMutation,
} from "@/modules/profile/queries/profile.queries";
import type { ResumeUploadNotice } from "@/modules/profile/types/profile.types";
import { getResumeUploadErrorResult } from "@/modules/profile/utils/resume.utils";

/** Owns the profile query and its two mutations, and picks the page's state: loading, error, empty or profile. */
export function ResumeContainer() {
  const profile = useProfileQuery();
  const upload = useUploadResumeMutation();
  const deleteProfile = useDeleteProfileMutation();
  // The last failed upload's notice stays on the page (with a next step) until another file is chosen.
  const [uploadNotice, setUploadNotice] = useState<ResumeUploadNotice>();
  // One action at a time: a delete confirmed mid-upload would be undone seconds later by the upload's result.
  const isBusy = upload.isPending || deleteProfile.isPending;

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Profile" });
  const deleteCallbacks = buildCallbacks("delete", "Profile", {
    successMessage: RESUME_PROFILE_COPY.deleted,
    errorMessage: RESUME_PROFILE_COPY.deleteFailed,
  });

  async function handleUpload(file: File) {
    if (isBusy) {
      return;
    }
    setUploadNotice(undefined);
    // Read before the upload replaces it: the toast says whether a profile was added or updated.
    const successMessage = profile.data ? RESUME_UPLOAD_COPY.replaced : RESUME_UPLOAD_COPY.uploaded;
    try {
      await upload.mutateAsync(file);
      buildCallbacks("upload", "Résumé", { successMessage }).onSuccess();
    } catch (error) {
      const result = getResumeUploadErrorResult(error);
      if (result.kind === "toast") {
        buildCallbacks("upload", "Résumé", { errorMessage: RESUME_UPLOAD_COPY.uploadFailed }).onError(error);
        return;
      }
      setUploadNotice(result);
    }
  }

  function handleDelete() {
    if (isBusy) {
      return;
    }
    setUploadNotice(undefined);
    deleteProfile.mutate(undefined, deleteCallbacks);
  }

  if (profile.isPending) {
    return (
      <div aria-busy="true" className="flex w-full flex-col gap-6">
        <span className="sr-only">Loading your résumé…</span>
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  // Only when nothing is cached: a failed background refetch keeps the profile on screen.
  if (profile.data === undefined) {
    return (
      <Alert variant="destructive" className="max-w-xl">
        <TriangleAlertIcon aria-hidden />
        <AlertTitle>{RESUME_PAGE_COPY.loadErrorTitle}</AlertTitle>
        <AlertDescription className="flex flex-col items-start gap-3">
          {RESUME_PAGE_COPY.loadErrorDescription}
          <Button variant="outline" className="h-11" onClick={() => profile.refetch()}>
            <RotateCcwIcon aria-hidden data-icon="inline-start" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    // One column at the content area's full width: the upload (or replace) card first, the profile under it. The same
    // parent in both states, so the card isn't remounted when the first upload creates a profile.
    <div className="flex w-full flex-col gap-6">
      <ResumeUploadCard
        hasProfile={profile.data !== null}
        isUploading={upload.isPending}
        disabled={deleteProfile.isPending}
        onUpload={(file) => void handleUpload(file)}
        onFileChosen={() => setUploadNotice(undefined)}
        notice={uploadNotice}
      />
      {profile.data && (
        <ResumeProfileView
          profile={profile.data}
          isDeleting={deleteProfile.isPending}
          disabled={upload.isPending}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
