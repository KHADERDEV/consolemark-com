import { z } from "zod";

export type ContactMethods = {
  whatsappNumber: string | null;
  telegramUsername: string | null;
  telegramNumber: string | null;
};

export const optionalPhoneContactSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "")
  .refine(
    (value) => value === "" || /^\+[1-9]\d{7,18}$/.test(value),
    "Use a full number with country code.",
  );

export const optionalTelegramUsernameSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "")
  .refine(
    (value) => value === "" || /^@?[A-Za-z0-9_]{5,32}$/.test(value),
    "Use a valid Telegram username.",
  );

export function normalizeContactValue(value: string | null | undefined) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

export function hasContactMethod(data: {
  whatsapp_number?: string | null;
  telegram_username?: string | null;
  telegram_number?: string | null;
}) {
  return Boolean(
    normalizeContactValue(data.whatsapp_number) ||
      normalizeContactValue(data.telegram_username) ||
      normalizeContactValue(data.telegram_number),
  );
}

export function toContactMethods(data: {
  whatsapp_number?: string | null;
  telegram_username?: string | null;
  telegram_number?: string | null;
}): ContactMethods {
  return {
    whatsappNumber: normalizeContactValue(data.whatsapp_number),
    telegramUsername: normalizeContactValue(data.telegram_username),
    telegramNumber: normalizeContactValue(data.telegram_number),
  };
}
