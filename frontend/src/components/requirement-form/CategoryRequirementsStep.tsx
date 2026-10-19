"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import {
  TextField,
  NumberField,
  SelectField,
  TextAreaField,
  ChipMultiSelect,
  RadioYesNo,
  CurrencyAmountField,
} from "@/components/ui/Fields";

// ---------------------------------------------------------------------------
// Field configuration types
// Each field config drives one input, no code duplication across categories.
// ---------------------------------------------------------------------------

type FieldType =
  | "text"
  | "number"
  | "select"
  | "textarea"
  | "chip-multi"
  | "radio-yes-no"
  | "currency-amount";

interface BaseField {
  type: FieldType;
  name: string;
  label: string;
  optional?: boolean;
  hint?: string;
  className?: string;
}

interface TextField_ extends BaseField { type: "text"; placeholder?: string }
interface NumberField_ extends BaseField { type: "number"; placeholder?: string; min?: number; max?: number; step?: number }
interface SelectField_ extends BaseField { type: "select"; options: { value: string; label: string }[]; placeholder?: string }
interface TextareaField_ extends BaseField { type: "textarea"; placeholder?: string; rows?: number; maxLength?: number }
interface ChipMultiField_ extends BaseField { type: "chip-multi"; options: { value: string; label: string }[] }
interface RadioYesNoField_ extends BaseField { type: "radio-yes-no" }
interface CurrencyAmountField_ extends BaseField {
  type: "currency-amount";
  amountName: string;
  currencyName: string;
  currencies: { value: string; label: string }[];
}

export type FieldConfig =
  | TextField_
  | NumberField_
  | SelectField_
  | TextareaField_
  | ChipMultiField_
  | RadioYesNoField_
  | CurrencyAmountField_;

interface CategoryRequirementsStepProps {
  formId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues: Record<string, any>;
  fields: FieldConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}

export function CategoryRequirementsStep({
  formId,
  schema,
  defaultValues,
  fields,
  onSubmit,
}: CategoryRequirementsStepProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-5">
        {fields.map((field) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const error = (errors as Record<string, any>)[field.name];

          if (field.type === "text") {
            return (
              <TextField
                key={field.name}
                id={field.name}
                label={field.label}
                optional={field.optional}
                hint={field.hint}
                error={error}
                placeholder={field.placeholder}
                registration={register(field.name)}
                className={field.className}
              />
            );
          }

          if (field.type === "number") {
            return (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                render={({ field: f }) => (
                  <NumberField
                    id={field.name}
                    label={field.label}
                    optional={field.optional}
                    hint={field.hint}
                    error={error}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className={field.className}
                    registration={{
                      ...f,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        const v = e.target.value;
                        f.onChange(v === "" ? undefined : Number(v));
                      },
                      value: f.value === undefined ? "" : String(f.value),
                    }}
                  />
                )}
              />
            );
          }

          if (field.type === "select") {
            return (
              <SelectField
                key={field.name}
                id={field.name}
                label={field.label}
                optional={field.optional}
                hint={field.hint}
                error={error}
                options={field.options}
                placeholder={field.placeholder}
                registration={register(field.name)}
                className={field.className}
              />
            );
          }

          if (field.type === "textarea") {
            return (
              <TextAreaField
                key={field.name}
                id={field.name}
                label={field.label}
                optional={field.optional}
                hint={field.hint}
                error={error}
                placeholder={field.placeholder}
                rows={field.rows}
                maxLength={field.maxLength}
                registration={register(field.name)}
                className={field.className}
              />
            );
          }

          if (field.type === "chip-multi") {
            return (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                defaultValue={[]}
                render={({ field: f }) => (
                  <ChipMultiSelect
                    id={field.name}
                    label={field.label}
                    optional={field.optional}
                    hint={field.hint}
                    error={error}
                    options={field.options}
                    value={Array.isArray(f.value) ? f.value : []}
                    onChange={f.onChange}
                    className={field.className}
                  />
                )}
              />
            );
          }

          if (field.type === "radio-yes-no") {
            return (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                defaultValue={false}
                render={({ field: f }) => (
                  <RadioYesNo
                    id={field.name}
                    label={field.label}
                    hint={field.hint}
                    error={error}
                    value={!!f.value}
                    onChange={f.onChange}
                    className={field.className}
                  />
                )}
              />
            );
          }

          if (field.type === "currency-amount") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const amountError = (errors as Record<string, any>)[field.amountName];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currencyError = (errors as Record<string, any>)[field.currencyName];
            return (
              <Controller
                key={field.amountName}
                name={field.amountName}
                control={control}
                render={({ field: amountField }) => (
                  <Controller
                    name={field.currencyName}
                    control={control}
                    render={({ field: currencyField }) => (
                      <CurrencyAmountField
                        id={field.amountName}
                        label={field.label}
                        optional={field.optional}
                        hint={field.hint}
                        amountError={amountError}
                        currencyError={currencyError}
                        currencies={field.currencies}
                        className={field.className}
                        amountRegistration={{
                          ...amountField,
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                            const v = e.target.value;
                            amountField.onChange(v === "" ? undefined : Number(v));
                          },
                          value: amountField.value === undefined ? "" : String(amountField.value),
                        }}
                        currencyRegistration={{
                          ...currencyField,
                          value: currencyField.value ?? "INR",
                        }}
                      />
                    )}
                  />
                )}
              />
            );
          }

          return null;
        })}
      </div>
    </form>
  );
}
