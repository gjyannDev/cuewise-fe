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
  description?: ReactNode;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  register: UseFormRegister<TFormValues>;
  error?: string;
  /** Classes for the textarea; replaces the default fixed height. */
  className?: string;
};

export function TextAreaField<TFormValues extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  rows = 4,
  disabled,
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
          className="text-sm font-display font-bold text-black-secondary"
        >
          {label}
        </FieldLabel>
      )}

      <Textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
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
