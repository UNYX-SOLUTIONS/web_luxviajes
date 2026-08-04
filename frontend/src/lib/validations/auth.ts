import { z } from "zod";

export const registerSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .max(100, "El correo no puede exceder 100 caracteres"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número"),
  confirmPassword: z.string(),
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .max(15, "El teléfono no puede exceder 15 caracteres")
    .regex(/^[0-9+]+$/, "El teléfono solo puede contener números y el signo +")
    .optional()
    .or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginInput = z.infer<typeof loginSchema>;
