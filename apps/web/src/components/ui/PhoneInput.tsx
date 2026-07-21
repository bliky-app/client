/* eslint-disable react-refresh/only-export-components */
import React from "react"
import Input, { type InputTheme } from "./Input"

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "className"> {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  hint?: string
  theme?: InputTheme
  inputClassName?: string
  className?: string
}

export function formatPhoneNumber(val: string): string {
  if (!val) return ""

  let digits = val.replace(/\D/g, "")

  if (digits.length === 0) {
    return ""
  }

  if (digits.startsWith("7") || digits.startsWith("8")) {
    digits = digits.slice(1)
  }

  digits = digits.slice(0, 10)

  if (digits.length === 0) {
    return "+7"
  }

  let result = "+7 (" + digits.slice(0, 3)

  if (digits.length > 3) {
    result += ") " + digits.slice(3, 6)
  }
  if (digits.length > 6) {
    result += "-" + digits.slice(6, 8)
  }
  if (digits.length > 8) {
    result += "-" + digits.slice(8, 10)
  }

  return result
}

export default function PhoneInput({
  value,
  onChange,
  label,
  error,
  hint,
  theme = "panel",
  placeholder = "+7 (999) 000-00-00",
  ...rest
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    onChange(formatted)
  }

  return (
    <Input
      {...rest}
      type="tel"
      label={label}
      error={error}
      hint={hint}
      theme={theme}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  )
}
