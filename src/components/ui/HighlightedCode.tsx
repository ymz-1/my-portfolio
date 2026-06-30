"use client";

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import { cn } from "@/lib/utils";

hljs.registerLanguage("bash", bash);

type Props = {
  code: string;
  language?: string;
  className?: string;
};

export function HighlightedCode({
  code,
  language = "bash",
  className,
}: Props) {
  const highlighted = useMemo(() => {
    const source = code.trimEnd();
    try {
      if (hljs.getLanguage(language)) {
        return hljs.highlight(source, { language }).value;
      }
    } catch {
      // fall through to auto-detect
    }
    return hljs.highlightAuto(source).value;
  }, [code, language]);

  return (
    <div className={cn("article-markdown", className)}>
      <pre className="my-0 overflow-x-auto rounded-xl border border-white/10 bg-black/40">
        <code
          className="hljs block whitespace-pre p-4 font-mono text-[13px] leading-7"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
