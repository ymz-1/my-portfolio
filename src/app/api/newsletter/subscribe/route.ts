import { NextRequest, NextResponse } from "next/server";
import {
  normalizeEmail,
  subscribeResultToStatus,
  subscribeViaButtondown,
} from "@/lib/newsletter/buttondown";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const email =
    normalizeEmail(
      typeof body === "object" && body !== null && "email" in body
        ? (body as { email?: unknown }).email
        : null,
    ) ?? null;

  if (!email) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const result = await subscribeViaButtondown(email, process.env.BUTTONDOWN_API_KEY);
  const status = subscribeResultToStatus(result);

  if (result.ok) {
    return NextResponse.json(
      { ok: true, status: result.status },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { error: result.error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
