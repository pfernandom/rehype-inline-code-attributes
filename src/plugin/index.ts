import { Element, Root, Text } from "hast";
import { Transformer } from "unified";
import { visit } from "unist-util-visit";

export function rehypeInlineCodeAttributesPlugin(
  options?: Options
): void | Transformer<Root, Root> {
  const separator = options?.separator ?? "^";

  function mapValue(k: string, v: string) {
    if (k.includes("className") && !v.match("[.+]")) {
      return [v];
    }
    return v;
  }

  return function (root) {
    function extract(value: String) {
      const [_, part1, part2] =
        value.match(new RegExp(`(.+)\\${separator}(.+=.+)+`)) ?? [];

      console.log({ part2 });

      const properties = Array.from(
        new URLSearchParams(part2).entries()
      ).reduce((acc, [k, v]) => ({ [k]: mapValue(k, v), ...acc }), {});

      return {
        content: part1,
        properties,
      };
    }

    visit(
      root,
      "element",
      function visitor(node: Element, i: number | null, parent: any) {
        if (node.tagName !== "code") return;
        if (!parent || parent.tagName === "pre") return;

        const [{ value, ...rest }] = node.children as Text[];
        if (value.includes(separator) && value.length > 2) {
          const { properties, content } = extract(value);
          node.children = [{ value: content, ...rest }] as Text[];
          node.properties = properties;
        }
      }
    );
    return root;
  };
}
export type Options =
  | {
      separator: string;
    }
  | void
  | undefined;
