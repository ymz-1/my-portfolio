import whatIsToken from "./what-is-token.md";
import promptEngineeringBasics from "./prompt-engineering-basics.md";
import reduceAiApiCost from "./reduce-ai-api-cost.md";
import transformerKvCache from "./transformer-kv-cache.md";
import claudeCodeVsCursorVsCopilot from "./claude-code-vs-cursor-vs-copilot.md";
import aiDevWorkflow from "./ai-dev-workflow.md";
import ragIntro from "./rag-intro.md";
import { parseArticleMarkdown } from "../parse";
import type { ArticleDetail } from "../types";

/** 列表顺序即首页预览与侧边栏顺序，新文章：新建 .md 后在此 import 并加入数组 */
const notes: ArticleDetail[] = [
  parseArticleMarkdown(whatIsToken),
  parseArticleMarkdown(promptEngineeringBasics),
  parseArticleMarkdown(reduceAiApiCost),
  parseArticleMarkdown(transformerKvCache),
  parseArticleMarkdown(claudeCodeVsCursorVsCopilot),
  parseArticleMarkdown(aiDevWorkflow),
  parseArticleMarkdown(ragIntro),
];

export default notes;
