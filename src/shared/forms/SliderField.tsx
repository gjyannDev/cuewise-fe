"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

type SliderFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  min: number;
  max: number;
  step?: number;
  /** Shown beside the label and announced as the slider's value, e.g. "5 questions". */
  formatValue?: (value: number) => string;
  error?: string;
  disabled?: boolean;
};

export function SliderField<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  min,
  max,
  step = 1,
  formatValue = String,
  error,
  disabled,
}: SliderFieldProps<TFieldValues>) {
  const labelId = `${name}-label`;
  const errorId = `${name}-error`;

  return (
    <Field data-invalid={!!error} className="gap-3">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <div className="flex items-center justify-between gap-4">
              <FieldTitle id={labelId}>{label}</FieldTitle>
              <span className="text-sm font-semibold tabular-nums text-primary-text">
                {formatValue(field.value)}
              </span>
            </div>

            {/* py-3 gives the 16px thumb a touch target of about 44px without changing its look. */}
            <Slider
              className="py-3"
              min={min}
              max={max}
              step={step}
              value={[field.value]}
              onValueChange={([value]) => field.onChange(value)}
              disabled={disabled}
              thumbProps={{
                ref: field.ref,
                onBlur: field.onBlur,
                "aria-labelledby": labelId,
                "aria-valuetext": formatValue(field.value),
                "aria-invalid": !!error,
                "aria-describedby": error ? errorId : undefined,
              }}
            />

            <div className="flex justify-between text-xs text-muted-foreground" aria-hidden>
              <span>{min}</span>
              <span>{max}</span>
            </div>
          </>
        )}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
