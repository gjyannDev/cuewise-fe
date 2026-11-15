"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileUpIcon, InfoIcon, ShieldCheckIcon, TriangleAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldSet } from "@/components/ui/field";
import { FileField } from "@/shared/forms/FileField";

import { RESUME_ACCEPT, RESUME_PROVIDER_NOTICE, RESUME_UPLOAD_COPY } from "@/modules/profile/constants";
import { resumeUploadFormSchema } from "@/modules/profile/schemas/profile.schema";
import type { ResumeUploadFormValues, ResumeUploadNotice } from "@/modules/profile/types/profile.types";

type ResumeUploadCardProps = {
  /** A profile is stored: the card offers to replace it rather than to add one. */
  hasProfile: boolean;
  isUploading: boolean;
  /** Another action on the profile is running (a delete), so no upload may start. */
  disabled?: boolean;
  /** Called with a file that passed the name and size check; the container sends it. */
  onUpload: (file: File) => void;
  /** A new file was chosen: the last upload's notice no longer applies. */
  onFileChosen: () => void;
  /** The last upload's outcome when it didn't succeed: a refusal as cuewise-be worded it, or no reply at all. */
  notice?: ResumeUploadNotice;
};

/**
 * Choose a résumé and it is sent at once: there is nothing else to fill in. The name and size are checked first, so
 * an obvious mistake never leaves the browser. Replacing needs no confirmation: a failed upload keeps the old profile.
 */
export function ResumeUploadCard({
  hasProfile,
  isUploading,
  disabled = false,
  onUpload,
  onFileChosen,
  notice,
}: ResumeUploadCardProps) {
  const form = useForm<ResumeUploadFormValues, unknown, { file: File }>({
    resolver: zodResolver(resumeUploadFormSchema),
  });
  const copy = hasProfile ? RESUME_UPLOAD_COPY.replace : RESUME_UPLOAD_COPY.upload;
  const submit = form.handleSubmit(({ file }) => onUpload(file));
  const isDisabled = isUploading || disabled;
  // No reply is not a refusal: the profile may have been replaced, so it is said neutrally, not as a failure.
  const isUnconfirmed = notice?.kind === "unconfirmed";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent">
          <FileUpIcon aria-hidden className="size-5 text-primary-text" />
        </span>
        <div className="flex flex-col gap-1">
          <CardTitle>
            <h2 className="text-base font-semibold">{copy.title}</h2>
          </CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form noValidate onSubmit={submit} aria-busy={isUploading}>
          {/* A second file can't be chosen while one is being read (EC23), nor during a delete. */}
          <FieldSet disabled={isDisabled}>
            <FileField
              name="file"
              label={copy.fieldLabel}
              control={form.control}
              accept={RESUME_ACCEPT}
              prompt={copy.prompt}
              description={RESUME_UPLOAD_COPY.limits}
              disabled={disabled}
              pending={isUploading}
              pendingLabel={RESUME_UPLOAD_COPY.pending}
              error={form.formState.errors.file?.message}
              onFileChange={() => {
                onFileChosen();
                void submit();
              }}
            />
          </FieldSet>
        </form>

        {notice && !isUploading && (
          <Alert variant={isUnconfirmed ? "default" : "destructive"}>
            {isUnconfirmed ? <InfoIcon aria-hidden /> : <TriangleAlertIcon aria-hidden />}
            <AlertTitle>{isUnconfirmed ? RESUME_UPLOAD_COPY.unconfirmedTitle : RESUME_UPLOAD_COPY.errorTitle}</AlertTitle>
            <AlertDescription>{notice.message}</AlertDescription>
          </Alert>
        )}

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheckIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          {RESUME_PROVIDER_NOTICE}
        </p>
      </CardContent>
    </Card>
  );
}
