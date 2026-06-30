const BUTTONDOWN_API = "https://api.buttondown.com/v1/subscribers";

export type SubscribeResult =
  | { ok: true; status: "subscribed" | "pending_confirmation" }
  | { ok: false; error: "invalid_email" | "duplicate" | "rate_limit" | "not_configured" | "upstream_error" };

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export async function subscribeViaButtondown(
  email: string,
  apiKey: string | undefined,
): Promise<SubscribeResult> {
  if (!apiKey) {
    return { ok: false, error: "not_configured" };
  }

  const response = await fetch(BUTTONDOWN_API, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (response.status === 201) {
    return { ok: true, status: "pending_confirmation" };
  }

  if (response.status === 429) {
    return { ok: false, error: "rate_limit" };
  }

  let payload: { detail?: string; code?: string } = {};
  try {
    payload = (await response.json()) as { detail?: string; code?: string };
  } catch {
    // ignore parse errors
  }

  const detail = (payload.detail ?? "").toLowerCase();

  if (
    response.status === 400 &&
    (detail.includes("already") ||
      detail.includes("exist") ||
      detail.includes("collision") ||
      payload.code === "subscriber_already_exists")
  ) {
    return { ok: false, error: "duplicate" };
  }

  if (!response.ok) {
    console.error("Buttondown subscribe failed", response.status, payload);
    return { ok: false, error: "upstream_error" };
  }

  return { ok: true, status: "pending_confirmation" };
}

export function subscribeResultToStatus(result: SubscribeResult): number {
  if (result.ok) return 200;
  switch (result.error) {
    case "invalid_email":
      return 400;
    case "duplicate":
      return 409;
    case "rate_limit":
      return 429;
    case "not_configured":
      return 503;
    default:
      return 502;
  }
}
