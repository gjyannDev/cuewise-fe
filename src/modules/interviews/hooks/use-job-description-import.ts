"use client";

import { type ClipboardEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { JOB_IMPORT_REPLACED_MESSAGE } from "../constants";
import { jobUrlSchema } from "../schemas/interviews.schema";
import type { JobImport, JobTextRequest } from "../types/interviews.types";
import { buildPastePayload, getJobImportErrorResult, shouldCleanPaste } from "../utils/job-import.utils";

/** What the container hands the setup form: the two import mutations, as plain functions plus their busy flags. */
export type JobImportActions = {
  importJobUrl: (url: string) => Promise<JobImport>;
  importJobText: (request: JobTextRequest) => Promise<JobImport>;
  isImportingLink: boolean;
  isImportingPaste: boolean;
};

type UseJobDescriptionImportOptions = JobImportActions & {
  /** The job description field's current value (watched), so notes and errors can tell when it was edited. */
  jobDescription: string;
  setJobDescription: (text: string) => void;
  focusJobDescription: () => void;
};

/**
 * Fills the setup form's job description from a posting link or a whole pasted page (cuewise-be cleans both).
 *
 * The job description field stays the single source of truth: an import only replaces its text, for the candidate
 * to review before Start. Replacing text they had offers Undo. The "shortened" note and a paste error belong to the
 * text the import left, so they disappear as soon as the field is edited.
 */
export function useJobDescriptionImport({
  jobDescription,
  setJobDescription,
  focusJobDescription,
  importJobUrl,
  importJobText,
  isImportingLink,
  isImportingPaste,
}: UseJobDescriptionImportOptions) {
  const isImporting = isImportingLink || isImportingPaste;
  const [link, setLinkValue] = useState("");
  const [linkError, setLinkError] = useState<string>();
  const [imported, setImported] = useState<JobImport | null>(null);
  // The field's value when a paste failed: the error shows until the field changes.
  const [pasteError, setPasteError] = useState<{ message: string; value: string } | null>(null);
  // The field is disabled while importing, and a disabled field can't take focus. The request's promise and the
  // mutation's busy flag settle in either order, so whichever side comes last does the focusing.
  const focusPending = useRef(false);
  const importingNow = useRef(isImporting);

  useEffect(() => {
    importingNow.current = isImporting;
    if (!isImporting && focusPending.current) {
      focusPending.current = false;
      focusJobDescription();
    }
  }, [isImporting, focusJobDescription]);

  function requestFocus() {
    if (importingNow.current) {
      focusPending.current = true;
    } else {
      focusJobDescription();
    }
  }

  function setLink(value: string) {
    setLinkValue(value);
    setLinkError(undefined);
  }

  function apply(result: JobImport) {
    const previous = jobDescription;
    setJobDescription(result.text);
    setImported(result);
    setPasteError(null);
    if (previous.trim() !== "" && previous !== result.text) {
      toast(JOB_IMPORT_REPLACED_MESSAGE, {
        action: {
          label: "Undo",
          onClick: () => {
            setJobDescription(previous);
            setImported(null);
          },
        },
      });
    }
  }

  /** Shows a failed import where it belongs: under the link (then focus the box to paste instead), under the box, or a toast. */
  function fail(error: unknown, valueBefore: string): void {
    const result = getJobImportErrorResult(error);
    if (result.kind === "toast") {
      toast.error(result.message);
      return;
    }
    if (result.target === "url") {
      setLinkError(result.message);
      // The link didn't work: the box is where the candidate pastes instead.
      requestFocus();
      return;
    }
    setPasteError({ message: result.message, value: valueBefore });
  }

  async function importFromLink() {
    if (isImporting) {
      return;
    }
    const parsed = jobUrlSchema.safeParse(link);
    if (!parsed.success) {
      setLinkError(parsed.error.issues[0]?.message);
      return;
    }
    setLinkError(undefined);
    try {
      apply(await importJobUrl(parsed.data));
      requestFocus();
    } catch (error) {
      fail(error, jobDescription);
    }
  }

  async function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const text = event.clipboardData.getData("text/plain");
    if (isImporting || !shouldCleanPaste(text)) {
      return;
    }
    // A whole copied page: cleaned by cuewise-be instead of pasted as is.
    event.preventDefault();
    const payload = buildPastePayload({ html: event.clipboardData.getData("text/html"), text });
    const valueBefore = jobDescription;
    try {
      apply(await importJobText(payload));
      requestFocus();
    } catch (error) {
      fail(error, valueBefore);
    }
  }

  return {
    link,
    setLink,
    linkError,
    importFromLink,
    handlePaste,
    isImporting,
    isImportingLink,
    isImportingPaste,
    /** Shown under the job description while it still holds the text a failed paste left untouched. */
    jobDescriptionError: pasteError && pasteError.value === jobDescription ? pasteError.message : undefined,
    /** The imported text was cut to fit, and the candidate hasn't edited it yet. */
    showTruncatedNote: imported !== null && imported.truncated && imported.text === jobDescription,
  };
}
