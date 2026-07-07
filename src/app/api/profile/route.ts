import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseRest } from "@/lib/admin/supabase-rest";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  display_name: z.string().trim().min(1).max(80),
  whatsapp_number: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .refine(
      (value) => value === "" || /^\+[1-9]\d{7,18}$/.test(value),
      "Use a full WhatsApp number with country code.",
    ),
});

function getMetadataString(
  metadata: Record<string, unknown> | undefined | null,
  keys: string[],
) {
  for (const key of keys) {
    const value = metadata?.[key];

    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return null;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name"),
    whatsapp_number: formData.get("whatsapp_number"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid profile update." },
      { status: 400 },
    );
  }

  const whatsappNumber = parsed.data.whatsapp_number || null;
  const avatarUrl =
    getMetadataString(user.user_metadata, ["avatar_url", "picture"]) ??
    user.identities
      ?.map((identity) =>
        getMetadataString(identity.identity_data, ["avatar_url", "picture"]),
      )
      .find((value): value is string => Boolean(value)) ??
    null;

  await supabaseRest("user_profiles", {
    method: "POST",
    query: {
      on_conflict: "id",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      id: user.id,
      email: user.email ?? null,
      display_name: parsed.data.display_name,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      whatsapp_number: whatsappNumber,
    },
  });

  await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      full_name: parsed.data.display_name,
      name: parsed.data.display_name,
      ...(avatarUrl
        ? {
            avatar_url: avatarUrl,
            picture: avatarUrl,
          }
        : {}),
    },
  });

  return NextResponse.json({
    ok: true,
    profile: {
      display_name: parsed.data.display_name,
      whatsapp_number: whatsappNumber,
    },
  });
}
