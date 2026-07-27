import type { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type BilingualFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: boolean;
  multiline?: boolean;
};

/**
 * Renders an EN/AR side-by-side pair for a `Bilingual` field (e.g.
 * `name.en` / `name.ar`). `name` is the base path — this appends
 * `.en` / `.ar` itself so every call site only has to name the field
 * once instead of writing out both register() calls by hand.
 */
export function BilingualField<T extends FieldValues>({
  label,
  name,
  register,
  errors,
  required = true,
  multiline = false,
}: BilingualFieldProps<T>) {
  const enPath = `${name}.en` as Path<T>;
  const arPath = `${name}.ar` as Path<T>;

  // react-hook-form's FieldErrors is a nested object keyed by the dotted
  // path segments — walk it manually since the path itself is dynamic.
  const enError = String(name)
    .split(".")
    .concat("en")
    .reduce<unknown>((acc, key) => (acc as Record<string, unknown> | undefined)?.[key], errors);
  const arError = String(name)
    .split(".")
    .concat("ar")
    .reduce<unknown>((acc, key) => (acc as Record<string, unknown> | undefined)?.[key], errors);

  const Control = multiline ? Textarea : Input;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field
        label={`${label} (English)`}
        htmlFor={enPath}
        required={required}
        error={(enError as { message?: string } | undefined)?.message}
      >
        <Control id={enPath} dir="ltr" {...register(enPath)} />
      </Field>
      <Field
        label={`${label} (Arabic)`}
        htmlFor={arPath}
        required={required}
        error={(arError as { message?: string } | undefined)?.message}
      >
        <Control id={arPath} dir="rtl" {...register(arPath)} />
      </Field>
    </div>
  );
}
