import { visit } from "unist-util-visit";
import type { Root } from "hast";
import type { ArticleHeading } from "./headings";

export function rehypeHeadingIds(headings: ArticleHeading[]) {
  return function rehypeHeadingIdsPlugin() {
    return (tree: Root) => {
      let index = 0;

      visit(tree, "element", (node) => {
        if (node.tagName !== "h1" && node.tagName !== "h2" && node.tagName !== "h3") {
          return;
        }

        node.properties ??= {};
        node.properties.id = headings[index++]?.id ?? "section";
      });
    };
  };
}
