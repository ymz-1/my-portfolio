import {
  normalizeEmail,
  subscribeResultToStatus,
  subscribeViaButtondown,
} from "../../../src/lib/newsletter/buttondown";

type Env = {
  BUTTONDOWN_API_KEY?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
};

export async function onRequestPost(context: PagesContext): Promise<Response> {
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const email =
    normalizeEmail(
      typeof body === "object" && body !== null && "email" in body
        ? (body as { email?: unknown }).email
        : null,
    ) ?? null;

  if (!email) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const result = await subscribeViaButtondown(email, context.env.BUTTONDOWN_API_KEY);
  const status = subscribeResultToStatus(result);

  if (result.ok) {
    return Response.json(
      { ok: true, status: result.status },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    { error: result.error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
