"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

const signUpSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export async function registerUser(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese email" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: { name, email, passwordHash },
  });

  // Auto sign in after register
  try {
    await signIn("credentials", { email, password, redirectTo: "/explore" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Error al iniciar sesión automáticamente" };
    }
    throw error;
  }
}

export async function loginUser(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", { email, password, redirectTo: "/explore" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email o contraseña incorrectos" };
        default:
          return { error: "Algo salió mal, intenta de nuevo" };
      }
    }
    throw error;
  }
}
