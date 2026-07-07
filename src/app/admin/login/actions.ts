"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { loginAdmin } from "@/lib/admin/auth";

type LoginState = {
  error?: string;
};

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function loginAction(_state: LoginState, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Enter a valid admin email and password.",
    } satisfies LoginState;
  }

  const result = await loginAdmin(parsed.data.email, parsed.data.password);

  if (!result.ok) {
    return { error: "Invalid admin credentials." } satisfies LoginState;
  }

  redirect("/admin");
}
