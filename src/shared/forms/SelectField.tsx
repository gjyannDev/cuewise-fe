"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  control: Control<TFieldValues>;
  placeholder?: string;
  description?: string;
  options: readonly Option[];
  error?: string;
  className?: string;
  triggerClassName?: string;
  width?: string;
  fullWidth?: boolean;
  isClearable?: boolean;
  showTooltip?: boolean;
  onValueChange?: (value: string | number | undefined) => void;
};

export function SelectField<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  placeholder = "Select option",
  description,
  options,
  error,
  className,
  triggerClassName,
  width,
  fullWidth = false,
  isClearable = false,
  showTooltip = false,
  onValueChange,
}: SelectFieldProps<TFieldValues>) {
  const id = String(name);
  const baseWidthClass = fullWidth ? "w-full" : (width ?? "w-44");
  const triggerCls = `${baseWidthClass} ${triggerClassName ?? ""}`.trim();
  const fieldWidthClass = fullWidth ? "w-full" : "w-fit";

  const displayedOptions = isClearable
    ? [{ value: "__empty__", label: "Select" }, ...options]
    : options;

  return (
    <Field
      className={`flex flex-col gap-1 ${fieldWidthClass} ${className ?? ""}`}
    >
      {" "}
      <FieldLabel
        htmlFor={id}
        className="text-sm font-display font-bold text-black-secondary"
      >
        {label}
      </FieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedLabel =
            displayedOptions.find(
              (opt) => opt.value === field.value?.toString(),
            )?.label ?? placeholder;

          const trigger = (
            <SelectTrigger
              id={id}
              className={`${triggerCls} cursor-pointer [&>svg]:opacity-100 [&>svg]:text-gray-700`}
              style={{ minWidth: 0 }}
            >
              <SelectValue placeholder={placeholder} className="truncate" />
            </SelectTrigger>
          );

          return (
            <div className="flex flex-col">
              <Select
                key={field.value?.toString() ?? "__empty__"}
                value={field.value?.toString() ?? ""}
                onValueChange={(val) => {
                  const numVal = Number(val);
                  if (val === "__empty__") {
                    field.onChange(undefined);
                    onValueChange?.(undefined);
                  } else if (!isNaN(numVal) && val === numVal.toString()) {
                    field.onChange(numVal);
                    onValueChange?.(numVal);
                  } else {
                    field.onChange(val);
                    onValueChange?.(val);
                  }
                }}
              >
                {showTooltip ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                    <TooltipContent>{selectedLabel}</TooltipContent>
                  </Tooltip>
                ) : (
                  trigger
                )}

                <SelectContent>
                  {displayedOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className={
                        opt.label === "Select"
                          ? "text-muted-foreground cursor-pointer"
                          : "cursor-pointer"
                      }
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{error}</FieldError>
    </Field>
  );
}
