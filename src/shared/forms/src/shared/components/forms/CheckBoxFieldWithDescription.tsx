import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type CheckboxFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  checkboxLabel?: string;
  description?: string;
  control: Control<TFieldValues>;
  error?: string;
  disabled?: boolean;
};

export function CheckBoxFieldWithDescription<TFieldValues extends FieldValues>({
  name,
  label,
  checkboxLabel,
  description,
  control,
  error,
  disabled,
}: CheckboxFieldProps<TFieldValues>) {
  return (
    <Field className="flex flex-col gap-1.5">
      {label && (
        <FieldLabel htmlFor={name} className="text-sm font-medium">
          {label}
        </FieldLabel>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={false as unknown as TFieldValues[typeof name]}
        render={({ field }) => (
          <Label
            className="
              hover:bg-primary/10
              flex items-start gap-3
              rounded-lg border p-3
              has-aria-checked:border-primary
              has-aria-checked:bg-primary/10
              dark:has-aria-checked:border-primary-dark
              dark:has-aria-checked:bg-primary-dark/10
              cursor-pointer
            "
          >
            <Checkbox
              id={name}
              onCheckedChange={(val: boolean) => field.onChange(val)}
              checked={field.value}
              disabled={disabled}
              className="
                w-3.5 h-3.5
                data-[state=checked]:border-primary
                data-[state=checked]:bg-primary
                data-[state=checked]:text-white
                dark:data-[state=checked]:border-primary-dark
                dark:data-[state=checked]:bg-primary-dark
              "
            />
            <div className="grid gap-1.5 font-normal">
              {checkboxLabel && (
                <p className="text-sm leading-none font-medium">
                  {checkboxLabel}
                </p>
              )}
              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
          </Label>
        )}
      />

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
