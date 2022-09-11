import { expect } from "chai";
import { Element } from "hast";
import { fromMarkdown } from "mdast-util-from-markdown";
import "mocha";
import remarkParse from "remark-parse";
import { read, writeSync } from "to-vfile";

import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

import debug from "debug";
import { Handler, toHast } from "mdast-util-to-hast";
import remarkRehype from "remark-rehype";

import { toHtml } from "hast-util-to-html";
// @ts-ignore
import { rehypeInlineCodeAttributesPlugin } from "../src/plugin/index.ts";
// import { use } from 'chai'
import { unified } from "unified";

import { compile } from "@mdx-js/mdx";
import { readFile } from "fs/promises";
import { getMDXComponent } from "mdx-bundler/client/index.js";
import { bundleMDX } from "mdx-bundler/dist/index.js";
import { mdxToMd } from "mdx-to-md";
import path from "path";
import { createElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import rehypePrism from "@mapbox/rehype-prism";

const log = debug("test.spec.js");

describe("Test rehypeInlineCodeAttributesPlugin", () => {
  it("should work with properties", async () => {
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeInlineCodeAttributesPlugin)
      .use(rehypeDocument)
      .use(rehypeFormat)
      .use(rehypeStringify)
      .process(await read("./test/example.md"));

    log(JSON.stringify(result, undefined, 4));

    result.basename = "example.html";

    writeSync(result);

    expect(result.value).to.include(
      '<p><code data-test-example="true" class="language-java">this is an example</code></p>'
    );
  });

  it("should work with properties and custom separator", async () => {
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeInlineCodeAttributesPlugin, { separator: "*" })
      .use(rehypeDocument)
      .use(rehypeFormat)
      .use(rehypeStringify)
      .process(await read("./test/example.md"));

    log(JSON.stringify(result, undefined, 4));

    result.basename = "example.html";

    writeSync(result);

    expect(result.value).to.include(
      ' <p><code data-test-example="true" class="language-java">this is an example with custom separator</code></p>'
    );
  });

  it("should work with properties and Prism", async () => {
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeInlineCodeAttributesPlugin)
      .use(rehypeDocument)
      .use(rehypeFormat)
      .use(rehypeStringify)
      .use(rehypePrism)
      .process(await read("./test/example.md"));

    log(JSON.stringify(result, undefined, 4));

    result.basename = "example-prism.html";

    writeSync(result);
  });
});
