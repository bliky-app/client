import React from "react"
import Input, { type InputTheme } from "./Input"
import { Check, X } from "lucide-react"

export interface PasswordValidationResult {
  isValid: boolean
  hasMinLength: boolean
  hasUppercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-ZА-Я]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)

  const errors: string[] = []
  if (!hasMinLength) errors.push("Минимум 8 символов")
  if (!hasUppercase) errors.push("Заглавная буква")
  if (!hasNumber) errors.push("Цифра")
  if (!hasSpecialChar) errors.push("Спецсимвол (!@#$%...)")

  return {
    isValid: hasMinLength && hasUppercase && hasNumber && hasSpecialChar,
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    errors,
  }
}

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "type"> {
  label?: string
  error?: string
  hint?: string
  theme?: InputTheme
  showRules?: boolean
  inputClassName?: string
  className?: string
}

export default function PasswordInput({
  value = "",
  label,
  error,
  hint,
  theme = "panel",
  showRules = false,
  ...rest
}: PasswordInputProps) {
  const strVal = String(value)
  const validation = validatePassword(strVal)

  const rules = [
    { label: "Минимум 8 символов", passed: validation.hasMinLength },
    { label: "Заглавная буква", passed: validation.hasUppercase },
    { label: "Цифра", passed: validation.hasNumber },
    { label: "Спецсимвол (!@#$%...)", passed: validation.hasSpecialChar },
  ]

  return (
    <div className="flex flex-col gap-2">
      <Input
        {...rest}
        type="password"
        label={label}
        error={error}
        hint={hint}
        theme={theme}
        value={value}
      />

      {showRules && strVal.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5 pt-1 px-1">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs font-medium">
              {rule.passed ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-panel-text-subtle shrink-0" />
              )}
              <span className={rule.passed ? "text-emerald-500 font-semibold" : "text-panel-text-subtle"}>
                {rule.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
