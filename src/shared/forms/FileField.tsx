"use client";

import { FileUpIcon, Loader2Icon } from "lucide-react";
import { type DragEvent, type ReactNode, useState } from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type FileFieldProps<TFieldValues extends FieldValues> = {
  /** Used as the input id; label, description and error are linked to it. */
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  /** The native `accept` hint for the picker. It is only a hint: validate the file in the form's schema. */
  accept?: string;
  /** The drop area's main line. */
  prompt?: string;
  /** Under the drop area, e.g. the accepted formats and size. */
  description?: ReactNode;
  disabled?: boolean;
  /** A chosen file is being sent: the drop area shows `pendingLabel` and the file's name instead of the prompt. */
  pending?: boolean;
  pendingLabel?: string;
  error?: string;
  /** Runs after the form value changed, e.g. to submit as soon as a file is chosen. */
  onFileChange?: (file: File | undefined) => void;
  className?: string;
};

/**
 * One file for a react-hook-form form, held as a `File` (not a `FileList`) so a zod schema can check it, chosen by a
 * click or by dropping it on the area. The native input stays inside the label, visually hidden, so the keyboard
 * (Tab, then Enter or Space) and screen readers work as for any file input. Its value is cleared after each choice,
 * so choosing the same file again (after fixing it, or after a failed upload) still counts as a change.
 */
export function FileField<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  accept,
  prompt = "Drag and drop a file here",
  description,
  disabled = false,
  pending = false,
  pendingLabel = "Uploading…",
  error,
  onFileChange,
  className,
}: FileFieldProps<TFieldValues>) {
  const [isDragging, setIsDragging] = useState(false);
  const labelId = `${name}-label`;
  const descriptionId = description ? `${name}-description` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const isDisabled = disabled || pending;

  return (
    <Field className={cn("flex gap-1.5", className)} data-invalid={!!error}>
      <span id={labelId} className="text-sm font-display font-bold text-black-secondary">
        {label}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const choose = (file: File | undefined) => {
            field.onChange(file);
            onFileChange?.(file);
          };
          const value: unknown = field.value;
          const chosen = value instanceof File ? value : undefined;
          const dragProps = {
            onDragEnter: (event: DragEvent) => {
              event.preventDefault();
              if (!isDisabled) setIsDragging(true);
            },
            onDragOver: (event: DragEvent) => event.preventDefault(),
            onDragLeave: (event: DragEvent) => {
              // Leaving for a child of the area (the icon, the text) is not leaving the area.
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
            },
            onDrop: (event: DragEvent) => {
              event.preventDefault();
              setIsDragging(false);
              if (!isDisabled) choose(event.dataTransfer.files[0]);
            },
          };

          return (
            <FieldLabel
              htmlFor={name}
              {...dragProps}
              className={cn(
                "flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-input bg-muted/30 px-6 py-8 text-center font-normal transition-colors",
                "hover:border-primary/60 hover:bg-accent/40",
                "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50",
                isDragging && "border-primary bg-accent/60",
                error && "border-destructive",
                isDisabled && "pointer-events-none cursor-not-allowed opacity-60",
              )}
            >
              <input
                id={name}
                name={field.name}
                ref={field.ref}
                type="file"
                accept={accept}
                disabled={isDisabled}
                // Named by the visible label above, not by the whole drop area's text.
                aria-labelledby={labelId}
                aria-invalid={!!error}
                aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
                className="sr-only"
                onBlur={field.onBlur}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  choose(file);
                }}
              />
              <span className="flex size-12 items-center justify-center rounded-full bg-accent">
                {pending ? (
                  <Loader2Icon aria-hidden className="size-6 animate-spin text-primary-text motion-reduce:animate-none" />
                ) : (
                  <FileUpIcon aria-hidden className="size-6 text-primary-text" />
                )}
              </span>
              {/* Announced when the upload starts and ends (always rendered, so screen readers catch the change). */}
              <span role="status" className="flex flex-col gap-1">
                {pending ? (
                  <>
                    <span className="text-sm font-medium">{pendingLabel}</span>
                    {chosen && <span className="max-w-full truncate text-xs text-muted-foreground">{chosen.name}</span>}
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium">{prompt}</span>
                    <span className="text-xs text-muted-foreground">
                      or <span className="font-medium text-primary-text underline underline-offset-4">browse your files</span>
                    </span>
                  </>
                )}
              </span>
            </FieldLabel>
          );
        }}
      />
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
