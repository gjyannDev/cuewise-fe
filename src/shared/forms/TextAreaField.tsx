import type { ReactNode } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

type TextAreaFieldProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  label?: string;
  /** Keep the label for screen readers only (e.g. a chat composer whose purpose is clear from the layout). */
  hideLabel?: boolean;
  description?: ReactNode;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  /** Unlike `disabled`, keeps focus in the field (e.g. while a message is sending). */
  readOnly?: boolean;
  autoFocus?: boolean;
  register: UseFormRegister<TFormValues>;
  error?: string;
  /** Classes for the textarea; replaces the default fixed height. */
  className?: string;
};

export function TextAreaField<TFormValues extends FieldValues>({
  name,
  label,
  hideLabel = false,
  description,
  placeholder,
  rows = 4,
  disabled,
  readOnly,
  autoFocus,
  register,
  error,
  className,
}: TextAreaFieldProps<TFormValues>) {
  const descriptionId = description ? `${name}-description` : undefined;
  const errorId = error ? `${name}-error` : undefined;

  return (
    <Field className="flex gap-1.5" data-invalid={!!error}>
      {label && (
        <FieldLabel
          htmlFor={name}
          className={cn("text-sm font-display font-bold text-black-secondary", hideLabel && "sr-only")}
        >
          {label}
        </FieldLabel>
      )}

      <Textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        // Opt-in only, for fields that should take focus when they appear after a user action.
        autoFocus={autoFocus}
        aria-invalid={!!error}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
        className={cn(
          "placeholder:text-sm placeholder:text-placeholder",
          className ?? "h-88",
        )}
        {...register(name)}
      />

      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}

      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
