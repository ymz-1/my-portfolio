"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  cloneTemplate,
  createEmptyParam,
  formatOutput,
  functionTemplates,
  PARAM_TYPES,
  validateDefinition,
  type FunctionDefinition,
  type FunctionParam,
  type OutputFormat,
} from "@/lib/llm/function-calling";
import { cn } from "@/lib/utils";

const OUTPUT_TABS: { id: OutputFormat; label: { zh: string; en: string } }[] = [
  { id: "openai", label: { zh: "OpenAI Tools", en: "OpenAI Tools" } },
  { id: "claude", label: { zh: "Claude Tools", en: "Claude Tools" } },
  { id: "langchain", label: { zh: "LangChain", en: "LangChain" } },
  { id: "json-schema", label: { zh: "JSON Schema", en: "JSON Schema" } },
];

const DEFAULT_DEF: FunctionDefinition = {
  name: "get_weather",
  description: "获取指定城市的当前天气信息",
  parameters: [
    {
      id: "default-1",
      name: "city",
      type: "string",
      description: "城市名称",
      required: true,
    },
  ],
};

export function FunctionCallingBuilderView() {
  const { pick } = useLanguage();
  const [def, setDef] = useState<FunctionDefinition>(DEFAULT_DEF);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("openai");
  const [copied, setCopied] = useState(false);

  const validationError = useMemo(() => validateDefinition(def), [def]);

  const output = useMemo(
    () => (validationError ? "" : formatOutput(def, outputFormat)),
    [def, outputFormat, validationError],
  );

  const updateParam = (id: string, patch: Partial<FunctionParam>) => {
    setDef((d) => ({
      ...d,
      parameters: d.parameters.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    }));
  };

  const removeParam = (id: string) => {
    setDef((d) => ({
      ...d,
      parameters: d.parameters.filter((p) => p.id !== id),
    }));
  };

  const addParam = () => {
    setDef((d) => ({
      ...d,
      parameters: [...d.parameters, createEmptyParam()],
    }));
  };

  const applyTemplate = (index: number) => {
    setDef(cloneTemplate(functionTemplates[index]));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
      <Link
        href="/#social"
        className="mb-8 inline-flex text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {pick({ zh: "返回小工具", en: "Back to gadgets" })}
      </Link>

      <header className="mb-8 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/15 via-surface/80 to-surface/40 px-6 py-8 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          {pick({ zh: "AI Developer Toolkit", en: "AI Developer Toolkit" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {pick({
            zh: "工具调用构建器",
            en: "Function Calling Builder",
          })}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {pick({
            zh: "可视化设计 AI 可调用的函数与参数结构，自动生成 OpenAI、Claude、LangChain 及 JSON Schema 格式。",
            en: "Visually design functions and parameters for AI tool calling — export OpenAI, Claude, LangChain, and JSON Schema formats.",
          })}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <section className="space-y-5 rounded-2xl border border-white/10 bg-surface/50 p-5 sm:p-6">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
              {pick({ zh: "模板库", en: "Templates" })}
            </p>
            <div className="flex flex-wrap gap-2">
              {functionTemplates.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => applyTemplate(i)}
                  className="rounded-lg border border-white/10 bg-background/40 px-3 py-1.5 text-xs transition-colors hover:border-brand/30 hover:bg-brand/10"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              {pick({ zh: "函数名", en: "Function name" })}
            </label>
            <input
              value={def.name}
              onChange={(e) => setDef((d) => ({ ...d, name: e.target.value }))}
              placeholder="get_weather"
              className="mt-2 w-full rounded-xl border border-white/10 bg-background/60 px-3 py-2.5 font-mono text-sm outline-none ring-brand/40 focus:ring-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              {pick({ zh: "描述", en: "Description" })}
            </label>
            <textarea
              value={def.description}
              onChange={(e) =>
                setDef((d) => ({ ...d, description: e.target.value }))
              }
              rows={3}
              placeholder={pick({
                zh: "获取指定城市的当前天气信息",
                en: "Get current weather for a city",
              })}
              className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-background/60 px-3 py-2.5 text-sm outline-none ring-brand/40 focus:ring-2"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium">
                {pick({ zh: "参数", en: "Parameters" })}
              </p>
              <button
                type="button"
                onClick={addParam}
                className="rounded-lg border border-brand/30 px-3 py-1 text-xs text-brand transition-colors hover:bg-brand/10"
              >
                + {pick({ zh: "添加参数", en: "Add parameter" })}
              </button>
            </div>

            <div className="space-y-3">
              {def.parameters.map((param) => (
                <div
                  key={param.id}
                  className="rounded-xl border border-white/10 bg-background/30 p-3"
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={param.name}
                      onChange={(e) =>
                        updateParam(param.id, { name: e.target.value })
                      }
                      placeholder={pick({ zh: "参数名", en: "Name" })}
                      className="rounded-lg border border-white/10 bg-background/60 px-2.5 py-1.5 font-mono text-xs outline-none focus:ring-1 focus:ring-brand/40"
                    />
                    <select
                      value={param.type}
                      onChange={(e) =>
                        updateParam(param.id, {
                          type: e.target.value as FunctionParam["type"],
                        })
                      }
                      className="rounded-lg border border-white/10 bg-background/60 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-brand/40"
                    >
                      {PARAM_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    value={param.description}
                    onChange={(e) =>
                      updateParam(param.id, { description: e.target.value })
                    }
                    placeholder={pick({ zh: "参数描述", en: "Description" })}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-background/60 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-brand/40"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-xs text-muted">
                      <input
                        type="checkbox"
                        checked={param.required}
                        onChange={(e) =>
                          updateParam(param.id, { required: e.target.checked })
                        }
                        className="accent-brand"
                      />
                      {pick({ zh: "必填", en: "Required" })}
                    </label>
                    <button
                      type="button"
                      onClick={() => removeParam(param.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      {pick({ zh: "删除", en: "Remove" })}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {validationError && (
            <p className="text-xs text-amber-300">
              {validationError.includes("identifier")
                ? pick({
                    zh: "函数名需为合法标识符（字母、数字、下划线）",
                    en: validationError,
                  })
                : validationError.includes("unique")
                  ? pick({
                      zh: "参数名不能重复",
                      en: validationError,
                    })
                  : pick({
                      zh: "请填写函数名",
                      en: validationError,
                    })}
            </p>
          )}
        </section>

        {/* Output */}
        <section className="flex flex-col rounded-2xl border border-white/10 bg-surface/50 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
            <div className="flex flex-wrap gap-1">
              {OUTPUT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setOutputFormat(tab.id)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                    outputFormat === tab.id
                      ? "bg-brand/20 text-brand"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {pick(tab.label)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => void handleCopy()}
              disabled={!output}
              className="rounded-lg border border-white/15 px-3 py-1 text-xs transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              {copied
                ? pick({ zh: "已复制", en: "Copied" })
                : pick({ zh: "复制", en: "Copy" })}
            </button>
          </div>
          <pre className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground/90">
            {output ||
              pick({
                zh: "请完善函数定义后查看输出",
                en: "Complete the function definition to see output",
              })}
          </pre>
        </section>
      </div>

      <p className="mt-6 text-center text-[11px] text-muted">
        {pick({
          zh: "纯前端生成，Schema 实时更新。导出后粘贴到 OpenAI / Anthropic / LangChain 项目即可使用。",
          en: "Client-side only — schema updates live. Paste into your OpenAI, Anthropic, or LangChain project.",
        })}
      </p>
    </div>
  );
}
