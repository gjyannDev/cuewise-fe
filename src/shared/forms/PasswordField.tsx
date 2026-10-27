import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type PasswordFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  register: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: string;
  disabled?: boolean;
};

export function PasswordField<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  autoComplete,
  register,
  registerOptions,
  error,
  disabled,
}: PasswordFieldProps<TFieldValues>) {
  return (
    <Field className="flex flex-col gap-1">
      {label && (
        <FieldLabel
          htmlFor={name}
          className="text-sm font-display font-bold text-black-secondary"
        >
          {label}
        </FieldLabel>
      )}
      <PasswordInput
        id={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="placeholder:text-sm placeholder:text-placeholder"
        disabled={disabled}
        {...register(name, registerOptions)}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
