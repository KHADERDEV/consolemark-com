import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { cancelTransferRequest } from "@/lib/transfer-requests";

export async function POST(
  request: Request,
  context: RouteContext<"/api/transfer-requests/[id]/cancel">,
) {
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

  const { id } = await context.params;
  await cancelTransferRequest(id, user.id);

  return NextResponse.redirect(
    new URL("/my-transfers?cancelled=1", request.url),
    {
      status: 303,
    },
  );
}
