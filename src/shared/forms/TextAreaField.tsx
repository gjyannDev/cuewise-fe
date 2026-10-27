import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

type TextAreaFieldProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  register: UseFormRegister<TFormValues>;
  error?: string;
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
}: TextAreaFieldProps<TFormValues>) {
  return (
    <Field className="flex gap-1.5">
      {label && (
        <FieldLabel className="text-sm font-display font-bold text-black-secondary">
          {label}
        </FieldLabel>
      )}

      <Textarea
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className="placeholder:text-sm placeholder:text-placeholder h-88"
        {...register(name)}
      />

      {description && <FieldDescription>{description}</FieldDescription>}

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
