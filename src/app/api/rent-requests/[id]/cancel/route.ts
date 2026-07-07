import { NextResponse } from "next/server";

import { cancelRentRequest } from "@/lib/rent-requests";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/rent-requests/[id]/cancel">,
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
  await cancelRentRequest(id, user.id);

  return NextResponse.json({ ok: true });
}
