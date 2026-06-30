type Env = {
  ARTICLE_VIEWS: KVNamespace;
};

type PagesContext = {
  env: Env;
};

async function parseCount(raw: string | null): Promise<number> {
  if (!raw) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

export async function onRequestGet({ env }: PagesContext): Promise<Response> {
  const views: Record<string, number> = {};
  let cursor: string | undefined;

  do {
    const list = await env.ARTICLE_VIEWS.list({ cursor });
    for (const key of list.keys) {
      views[key.name] = await parseCount(await env.ARTICLE_VIEWS.get(key.name));
    }
    cursor = list.list_complete ? undefined : list.cursor;
  } while (cursor);

  return Response.json(
    { views },
    { headers: { "Cache-Control": "no-store" } },
  );
}
