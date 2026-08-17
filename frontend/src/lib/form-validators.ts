const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldValidator = (value: string) => string | undefined;

export function validateRequiredField(
  value: string,
  message = "Requerido",
): string | undefined {
  if (!value.trim()) return message;
  return undefined;
}

export function validateFullName(value: string): string | undefined {
  return validateRequiredField(value);
}

export function validateEmailField(value: string): string | undefined {
  const requiredError = validateRequiredField(value);
  if (requiredError) return requiredError;
  if (!EMAIL_REGEX.test(value.trim())) return "Email inválido";
  return undefined;
}

export function validateEcuadorianPhone(value: string): string | undefined {
  const requiredError = validateRequiredField(value);
  if (requiredError) return requiredError;
  const digits = value.trim().replace(/[\s\-().+]/g, "");
  const localDigits = digits.startsWith("593") ? digits.slice(3) : digits;
  if (!/^(09\d{8}|0[2-7]\d{7})$/.test(localDigits)) {
    return "Ingresa un teléfono válido (09XXXXXXXX)";
  }
  return undefined;
}

export function validateEcuadorianCedula(value: string): string | undefined {
  const requiredError = validateRequiredField(value);
  if (requiredError) return requiredError;
  if (!/^\d{10}$/.test(value.trim())) {
    return "Cédula debe tener 10 dígitos";
  }
  return undefined;
}
