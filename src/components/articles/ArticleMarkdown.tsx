"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { extractHeadings } from "@/lib/articles/headings";
import { fixTightEmphasis } from "@/lib/articles/fix-tight-emphasis";
import { rehypeHeadingIds } from "@/lib/articles/rehype-heading-ids";
import { cn } from "@/lib/utils";

const components: Components = {
  h1: ({ id, children }) => (
    <h1
      id={id}
      className="scroll-mt-24 mt-10 mb-4 text-2xl font-bold tracking-tight text-foreground first:mt-0"
    >
      {children}
    </h1>
  ),
  h2: ({ id, children }) => (
    <h2
      id={id}
      className="scroll-mt-24 mt-8 mb-4 text-xl font-bold tracking-tight text-foreground"
    >
      {children}
    </h2>
  ),
  h3: ({ id, children }) => (
    <h3
      id={id}
      className="scroll-mt-24 mt-6 mb-3 text-lg font-semibold text-foreground"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[15px] leading-8 text-foreground/90">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-[15px] leading-8 text-foreground/90">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-[15px] leading-8 text-foreground/90">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-brand underline-offset-2 hover:underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-brand/40 pl-4 text-muted italic">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-foreground/95 italic">{children}</em>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/10 bg-surface/40">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-brand/12">{children}</thead>,
  tbody: ({ children }) => (
    <tbody className="[&_tr]:border-b [&_tr]:border-white/8 [&_tr:last-child]:border-0 [&_tr:hover]:bg-white/[0.02]">
      {children}
    </tbody>
  ),
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-brand">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm leading-relaxed text-foreground/85 align-top">
      {children}
    </td>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code
          className={cn(
            "block overflow-x-auto p-4 font-mono text-[13px] leading-6",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-brand/10 px-1.5 py-0.5 font-mono text-[13px] text-foreground">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-5 overflow-hidden rounded-xl border border-white/10 bg-surface/60">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-white/10" />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      className="my-6 w-full rounded-xl border border-white/10"
    />
  ),
};

type Props = {
  content: string;
};

export function ArticleMarkdown({ content }: Props) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const normalized = useMemo(() => fixTightEmphasis(content), [content]);
  const rehypePlugins = useMemo(
    () => [rehypeHeadingIds(headings), rehypeHighlight],
    [headings],
  );

  return (
    <div className="article-markdown space-y-5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
