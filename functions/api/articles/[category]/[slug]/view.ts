type Env = {
  ARTICLE_VIEWS: KVNamespace;
};

type PagesContext = {
  env: Env;
  params: { category?: string; slug?: string };
};

function articleKey(category: string, slug: string) {
  return `${category}/${slug}`;
}

async function getCount(env: Env, key: string): Promise<number> {
  const raw = await env.ARTICLE_VIEWS.get(key);
  if (!raw) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const category = context.params.category;
  const slug = context.params.slug;
  if (!category || !slug) {
    return Response.json({ error: "Missing category or slug" }, { status: 400 });
  }

  const count = await getCount(context.env, articleKey(category, slug));
  return Response.json({ count }, { headers: { "Cache-Control": "no-store" } });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const category = context.params.category;
  const slug = context.params.slug;
  if (!category || !slug) {
    return Response.json({ error: "Missing category or slug" }, { status: 400 });
  }

  const key = articleKey(category, slug);
  const next = (await getCount(context.env, key)) + 1;
  await context.env.ARTICLE_VIEWS.put(key, String(next));

  return Response.json({ count: next }, { headers: { "Cache-Control": "no-store" } });
}
