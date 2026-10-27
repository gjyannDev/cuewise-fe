"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";

type CheckboxFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  error?: string;
  id?: string;
  className?: string; // container
  checkboxClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  hideLabel?: boolean; // when true, render checkbox only
  disabled?: boolean;
};

export function CheckboxField<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  error,
  id,
  className,
  checkboxClassName,
  labelClassName,
  descriptionClassName,
  hideLabel = false,
  disabled,
}: CheckboxFieldProps<TFieldValues>) {
  const fallbackId = id ?? String(name);

  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const checked = Boolean(field.value);
          return (
            <div className={hideLabel ? "" : "flex flex-row items-start gap-3"}>
              <Checkbox
                id={fallbackId}
                className={`border border-slate-500 bg-white ${checkboxClassName ?? ""}`}
                checked={checked}
                onCheckedChange={(val) => field.onChange(Boolean(val))}
                onBlur={field.onBlur}
                disabled={disabled}
              />
              {!hideLabel && (
                <div className="grid gap-1.5">
                  {label && (
                    <Label htmlFor={fallbackId} className={labelClassName}>
                      {label}
                    </Label>
                  )}
                  {description && (
                    <p
                      className={
                        "text-muted-foreground text-sm " +
                        (descriptionClassName ?? "")
                      }
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        }}
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
