import type { Locale } from "@/lib/i18n/LanguageProvider";
import type { Localized } from "@/lib/i18n/LanguageProvider";

export type PromptPurpose = "writing" | "coding" | "analysis";

export type PurposeOption = {
  id: PromptPurpose;
  label: Localized;
  description: Localized;
  hint: Localized;
};

export const purposeOptions: PurposeOption[] = [
  {
    id: "writing",
    label: { zh: "写作", en: "Writing" },
    description: {
      zh: "文章、文案、邮件、总结",
      en: "Articles, copy, emails, summaries",
    },
    hint: {
      zh: "侧重清晰结构、语气与读者对象",
      en: "Focus on structure, tone, and audience",
    },
  },
  {
    id: "coding",
    label: { zh: "编程", en: "Coding" },
    description: {
      zh: "代码生成、审查、重构、调试",
      en: "Code gen, review, refactor, debug",
    },
    hint: {
      zh: "侧重语言栈、约束条件与可执行输出",
      en: "Focus on stack, constraints, executable output",
    },
  },
  {
    id: "analysis",
    label: { zh: "分析", en: "Analysis" },
    description: {
      zh: "数据分析、对比、决策建议",
      en: "Data analysis, comparison, decisions",
    },
    hint: {
      zh: "侧重推理步骤、证据与结论格式",
      en: "Focus on reasoning steps, evidence, conclusion format",
    },
  },
];

const SYSTEM_PROMPT_ZH = `你是一个 Prompt 设计专家，请根据用户输入生成结构化 Prompt 模板。

要求：
1. 必须包含以下章节（使用 Markdown 二级标题）：角色、目标、输入、输出格式、示例、可选变量
2. 模板应可直接复制到大模型中使用
3. 语言清晰、具体、可执行
4. 输出必须是 Markdown，不要包裹在代码块中
5. 可选变量用 {{variable_name}} 格式标注`;

const SYSTEM_PROMPT_EN = `You are a prompt design expert. Generate a structured prompt template from the user's input.

Requirements:
1. Include these sections (Markdown h2): Role, Goal, Input, Output Format, Example, Optional Variables
2. The template must be ready to paste into an LLM
3. Be clear, specific, and actionable
4. Output Markdown only — do not wrap in code fences
5. Mark optional variables as {{variable_name}}`;

export function buildGeneratorMessages(
  purpose: PromptPurpose,
  userInput: string,
  lang: Locale,
): { role: "system" | "user"; content: string }[] {
  const option = purposeOptions.find((p) => p.id === purpose)!;
  const system = lang === "zh" ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN;

  const purposeLabel = lang === "zh" ? option.label.zh : option.label.en;
  const purposeHint = lang === "zh" ? option.hint.zh : option.hint.en;

  const userContent =
    lang === "zh"
      ? `用途类别：${purposeLabel}\n场景提示：${purposeHint}\n\n用户需求：\n${userInput.trim()}`
      : `Category: ${purposeLabel}\nScene hint: ${purposeHint}\n\nUser request:\n${userInput.trim()}`;

  return [
    { role: "system", content: system },
    { role: "user", content: userContent },
  ];
}

export function getPurposeById(id: PromptPurpose): PurposeOption {
  return purposeOptions.find((p) => p.id === id) ?? purposeOptions[0];
}

const ROLE_BY_PURPOSE: Record<
  PromptPurpose,
  { zh: string; en: string }
> = {
  writing: {
    zh: "你是一位专业的写作助手，擅长根据给定要求产出结构清晰、语气得体的高质量文本。",
    en: "You are a professional writing assistant who produces clear, well-structured text with an appropriate tone.",
  },
  coding: {
    zh: "你是一位资深软件工程师，擅长代码编写、审查、重构与问题排查，输出可直接使用的代码与说明。",
    en: "You are a senior software engineer skilled in writing, reviewing, refactoring, and debugging code.",
  },
  analysis: {
    zh: "你是一位严谨的分析顾问，擅长基于给定信息进行逻辑推理、对比分析并给出可执行建议。",
    en: "You are a rigorous analyst who reasons logically, compares options, and gives actionable recommendations.",
  },
};

/** Offline fallback when WebLLM model download fails (no network). */
export function generateLocalTemplate(
  purpose: PromptPurpose,
  userInput: string,
  lang: Locale,
): string {
  const option = getPurposeById(purpose);
  const role = lang === "zh" ? ROLE_BY_PURPOSE[purpose].zh : ROLE_BY_PURPOSE[purpose].en;
  const purposeLabel = lang === "zh" ? option.label.zh : option.label.en;
  const need = userInput.trim();

  if (lang === "zh") {
    return `## 角色

${role}

## 目标

针对「${purposeLabel}」场景，完成以下任务：

${need}

## 输入

请提供：
- **核心主题**：{{topic}}
- **背景信息**：{{context}}
- **约束条件**：{{constraints}}
- **补充要求**：${need}

## 输出格式

- 使用 Markdown 排版
- 结构清晰，分点或分段呈现
- 长度约 {{length}}（可按需调整）
- 语气：{{tone}}

## 示例

**输入示例：**
> 主题：{{example_topic}}
> 背景：{{example_context}}

**输出示例：**
> （在此描述期望的输出样式与质量水准）

## 可选变量

- \`{{topic}}\` — 主题
- \`{{context}}\` — 背景信息
- \`{{audience}}\` — 目标读者
- \`{{tone}}\` — 语气（如：专业 / 友好 / 简洁）
- \`{{length}}\` — 期望长度
- \`{{constraints}}\` — 其他约束`;
  }

  return `## Role

${role}

## Goal

For **${purposeLabel}**, accomplish:

${need}

## Input

Provide:
- **Topic**: {{topic}}
- **Context**: {{context}}
- **Constraints**: {{constraints}}
- **Extra requirements**: ${need}

## Output Format

- Markdown layout
- Clear structure with bullets or sections
- Length around {{length}}
- Tone: {{tone}}

## Example

**Sample input:**
> Topic: {{example_topic}}
> Context: {{example_context}}

**Sample output:**
> (Describe the expected output style and quality here)

## Optional Variables

- \`{{topic}}\` — main topic
- \`{{context}}\` — background
- \`{{audience}}\` — target audience
- \`{{tone}}\` — tone (e.g. professional / friendly)
- \`{{length}}\` — desired length
- \`{{constraints}}\` — other constraints`;
}
