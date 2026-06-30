import roocodeRetrospective from "./roocode-retrospective.md";
import { parseArticleMarkdown } from "../parse";
import type { ArticleDetail } from "../types";

/** 列表顺序即首页预览与侧边栏顺序，新文章：新建 .md 后在此 import 并加入数组 */
const stories: ArticleDetail[] = [
  parseArticleMarkdown(roocodeRetrospective),
];

export default stories;
