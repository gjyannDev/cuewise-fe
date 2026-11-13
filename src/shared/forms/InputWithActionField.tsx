"use client";

import { Loader2Icon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputWithActionFieldProps = {
  /** Used as the input id; label, description and error are linked to it. */
  name: string;
  label: string;
  description?: ReactNode;
  placeholder?: string;
  type?: "text" | "url" | "email" | "search";
  value: string;
  onChange: (value: string) => void;
  /** The button's text, e.g. "Import" or "Apply". */
  actionLabel: string;
  /** Runs on a click and on Enter in the input, with the current value. */
  onAction: (value: string) => void;
  /** The action is running: spinner on the button, input and button disabled. */
  pending?: boolean;
  disabled?: boolean;
  error?: string;
  autoComplete?: string;
  className?: string;
};

/**
 * A text input with its own action button ("enter a value, press a button"), for values that trigger a request
 * rather than being submitted with the surrounding form: a link to import, a code to apply. Controlled by the caller,
 * so the value never becomes part of a react-hook-form submission.
 */
export function InputWithActionField({
  name,
  label,
  description,
  placeholder,
  type = "text",
  value,
  onChange,
  actionLabel,
  onAction,
  pending = false,
  disabled = false,
  error,
  autoComplete = "off",
  className,
}: InputWithActionFieldProps) {
  const descriptionId = description ? `${name}-description` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const isDisabled = disabled || pending;

  return (
    <Field className={cn("flex gap-1.5", className)} data-invalid={!!error}>
      <FieldLabel htmlFor={name} className="text-sm font-display font-bold text-black-secondary">
        {label}
      </FieldLabel>
      <div className="flex gap-2">
        <Input
          id={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={isDisabled}
          aria-invalid={!!error}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          className="min-w-0 flex-1 placeholder:text-sm placeholder:text-placeholder"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            // Enter acts on this field only: inside a larger form it would otherwise submit that form.
            if (event.key === "Enter") {
              event.preventDefault();
              if (!isDisabled) {
                onAction(value);
              }
            }
          }}
        />
        <Button type="button" variant="outline" disabled={isDisabled} onClick={() => onAction(value)}>
          {pending && <Loader2Icon aria-hidden className="animate-spin motion-reduce:animate-none" />}
          {actionLabel}
        </Button>
      </div>
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
