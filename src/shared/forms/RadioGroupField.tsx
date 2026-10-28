"use client";

import type { LucideIcon } from "lucide-react";
import { CheckIcon } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type RadioOption = {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

type RadioGroupFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  options: readonly RadioOption[];
  /** segmented: short labels in a button row; cards: icon, label and description per option. */
  variant?: "segmented" | "cards";
  error?: string;
  disabled?: boolean;
  className?: string;
};

// Container queries, not viewport breakpoints: the field's width depends on the sidebar and page columns.
const LAYOUT = {
  segmented: "grid grid-cols-2 gap-2 @sm:grid-cols-4",
  cards: "grid grid-cols-1 gap-3 @xl:grid-cols-3",
};

const OPTION = {
  segmented:
    "h-11 items-center justify-center gap-1.5 px-3 text-sm font-medium",
  cards: "min-h-16 items-start gap-3 p-4",
};

export function RadioGroupField<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  options,
  variant = "segmented",
  error,
  disabled,
  className,
}: RadioGroupFieldProps<TFieldValues>) {
  const labelId = `${name}-label`;
  const errorId = `${name}-error`;

  return (
    <Field data-invalid={!!error} className={cn("@container gap-2", className)}>
      <FieldTitle id={labelId}>{label}</FieldTitle>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // Focus target for "focus the first invalid field": the chosen option, else the first one.
          const focusValue = field.value ?? options[0]?.value;

          return (
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
              aria-labelledby={labelId}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className={LAYOUT[variant]}
            >
              {options.map((option) => {
                const id = `${name}-${option.value}`;
                const Icon = option.icon;

                return (
                  <label
                    key={option.value}
                    htmlFor={id}
                    className={cn(
                      "group/option relative flex cursor-pointer rounded-lg border border-border bg-card transition-colors duration-150 hover:bg-muted motion-reduce:transition-none",
                      "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent",
                      "has-[:focus-visible]:ring-3 has-focus-visible:ring-ring/50",
                      "has-disabled:cursor-not-allowed has-disabled:opacity-50",
                      OPTION[variant],
                    )}
                  >
                    {/* The real radio stays in the tab order and drives keyboard/screen-reader behavior; the label is the visual. */}
                    <RadioGroupItem
                      id={id}
                      value={option.value}
                      ref={option.value === focusValue ? field.ref : undefined}
                      className="absolute opacity-0"
                    />
                    {Icon && (
                      <Icon
                        aria-hidden
                        className="mt-0.5 size-5 shrink-0 text-primary-text"
                      />
                    )}
                    {variant === "segmented" && (
                      <CheckIcon
                        aria-hidden
                        className="hidden size-4 shrink-0 text-primary-text group-has-data-[state=checked]/option:block"
                      />
                    )}
                    <span
                      className={cn(
                        "flex flex-col gap-1",
                        variant === "cards" && "flex-1 pr-6",
                      )}
                    >
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="text-sm text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </span>
                    {variant === "cards" && (
                      <CheckIcon
                        aria-hidden
                        className="invisible absolute top-3 right-3 size-4 text-primary-text group-has-data-[state=checked]/option:visible"
                      />
                    )}
                  </label>
                );
              })}
            </RadioGroup>
          );
        }}
      />

      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
