"use client";

import * as React from "react";
import type { FieldError } from "react-hook-form";

// ---------------------------------------------------------------------------
// Shared prop types
// ---------------------------------------------------------------------------

interface BaseFieldProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: FieldError;
  className?: string;
}

// ---------------------------------------------------------------------------
// FieldWrapper — label + hint + error
// ---------------------------------------------------------------------------

interface FieldWrapperProps extends BaseFieldProps {
  children: React.ReactNode;
}

export function FieldWrapper({ id, label, optional, hint, error, children, className }: FieldWrapperProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {optional && <span className="ml-1 text-slate-400 font-normal">(optional)</span>}
      </label>
      {/* Clone child to inject aria-describedby */}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ "aria-describedby"?: string }>, {
            "aria-describedby": describedBy,
          })
        : children}
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared input class builder
// ---------------------------------------------------------------------------

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 bg-white",
    "placeholder:text-slate-400 outline-none transition-shadow",
    "focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
    hasError
      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
      : "border-slate-200 hover:border-slate-300",
  ]
    .filter(Boolean)
    .join(" ");
}

// ---------------------------------------------------------------------------
// TextField
// ---------------------------------------------------------------------------

interface TextFieldProps extends BaseFieldProps {
  placeholder?: string;
  registration: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
}

export function TextField({ id, label, optional, hint, error, placeholder, registration, className }: TextFieldProps) {
  return (
    <FieldWrapper id={id} label={label} optional={optional} hint={hint} error={error} className={className}>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className={inputCls(!!error)}
        {...registration}
      />
    </FieldWrapper>
  );
}

// ---------------------------------------------------------------------------
// NumberField
// ---------------------------------------------------------------------------

interface NumberFieldProps extends BaseFieldProps {
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  registration: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
}

export function NumberField({
  id,
  label,
  optional,
  hint,
  error,
  placeholder,
  min,
  max,
  step = 1,
  registration,
  className,
}: NumberFieldProps) {
  return (
    <FieldWrapper id={id} label={label} optional={optional} hint={hint} error={error} className={className}>
      <input
        id={id}
        type="number"
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={inputCls(!!error)}
        {...registration}
        onChange={(e) => {
          // Convert to number or undefined; never NaN
          const raw = e.target.value;
          const synthetic = {
            ...e,
            target: {
              ...e.target,
              value: raw,
              valueAsNumber: raw === "" ? undefined : Number(raw),
            },
          };
          registration.onChange?.(synthetic as React.ChangeEvent<HTMLInputElement>);
        }}
      />
    </FieldWrapper>
  );
}

// ---------------------------------------------------------------------------
// SelectField
// ---------------------------------------------------------------------------

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends BaseFieldProps {
  options: SelectOption[];
  placeholder?: string;
  registration: React.SelectHTMLAttributes<HTMLSelectElement> & { ref?: React.Ref<HTMLSelectElement> };
}

export function SelectField({ id, label, optional, hint, error, options, placeholder, registration, className }: SelectFieldProps) {
  return (
    <FieldWrapper id={id} label={label} optional={optional} hint={hint} error={error} className={className}>
      <select
        id={id}
        className={inputCls(!!error)}
        {...registration}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

// ---------------------------------------------------------------------------
// TextAreaField
// ---------------------------------------------------------------------------

interface TextAreaFieldProps extends BaseFieldProps {
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  registration: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> };
}

export function TextAreaField({ id, label, optional, hint, error, placeholder, rows = 3, maxLength, registration, className }: TextAreaFieldProps) {
  return (
    <FieldWrapper id={id} label={label} optional={optional} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${inputCls(!!error)} resize-none`}
        {...registration}
      />
    </FieldWrapper>
  );
}

// ---------------------------------------------------------------------------
// ChipMultiSelect — checkbox chips for arrays
// ---------------------------------------------------------------------------

interface ChipMultiSelectProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: FieldError;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  /** Optional price map: option value → INR amount. Shown as compact badge on each chip. */
  prices?: Record<string, number>;
  className?: string;
}

export function ChipMultiSelect({ id, label, optional, hint, error, options, value, onChange, prices, className }: ChipMultiSelectProps) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;

  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }

  /** Compact INR abbreviation for chip badges */
  function compactPrice(amount: number): string {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
    return `₹${amount}`;
  }

  return (
    <div className={className}>
      <p className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {optional && <span className="ml-1 text-slate-400 font-normal">(optional)</span>}
      </p>
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => {
          const checked = value.includes(opt.value);
          const price = prices?.[opt.value];
          return (
            <label
              key={opt.value}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm cursor-pointer select-none transition-colors",
                checked
                  ? "bg-violet-50 border-violet-500 text-violet-700 font-medium"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300",
              ].join(" ")}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => toggle(opt.value)}
                aria-label={opt.label}
              />
              <span>{opt.label}</span>
              {price !== undefined && (
                <span
                  className={[
                    "text-xs px-1.5 py-0.5 rounded-full font-normal",
                    checked
                      ? "bg-violet-100 text-violet-600"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {compactPrice(price)}
                </span>
              )}
            </label>
          );
        })}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RadioYesNo — Yes/No radio buttons for booleans
// ---------------------------------------------------------------------------

interface RadioYesNoProps {
  id: string;
  label: string;
  hint?: string;
  error?: FieldError;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

export function RadioYesNo({ id, label, hint, error, value, onChange, className }: RadioYesNoProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <p className="block text-sm font-medium text-slate-700 mb-2">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex gap-4">
        {[
          { label: "Yes", val: true },
          { label: "No", val: false },
        ].map(({ label: optLabel, val }) => (
          <label key={String(val)} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
            <input
              type="radio"
              name={id}
              checked={value === val}
              onChange={() => onChange(val)}
              aria-describedby={errorId}
              className="accent-violet-600 w-4 h-4"
            />
            {optLabel}
          </label>
        ))}
      </div>
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CurrencyAmountField — amount input + currency selector side by side
// ---------------------------------------------------------------------------

interface CurrencyAmountFieldProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  amountError?: FieldError;
  currencyError?: FieldError;
  amountRegistration: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
  currencyRegistration: React.SelectHTMLAttributes<HTMLSelectElement> & { ref?: React.Ref<HTMLSelectElement> };
  currencies: SelectOption[];
  className?: string;
}

export function CurrencyAmountField({
  id,
  label,
  optional,
  hint,
  amountError,
  currencyError,
  amountRegistration,
  currencyRegistration,
  currencies,
  className,
}: CurrencyAmountFieldProps) {
  const error = amountError ?? currencyError;
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {optional && <span className="ml-1 text-slate-400 font-normal">(optional)</span>}
      </label>
      <div className="flex gap-2">
        <select
          className={`${inputCls(!!currencyError)} w-28 flex-shrink-0`}
          aria-label="Currency"
          {...currencyRegistration}
        >
          {currencies.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="number"
          min={0}
          placeholder="0"
          className={`${inputCls(!!amountError)} flex-1`}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          {...amountRegistration}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}
