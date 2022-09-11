# rehype-inline-code-attributes

A [unified](http://unifiedjs.com/explore/package/unified/)([rehype](http://unifiedjs.com/explore/project/rehypejs/rehype/)) plugin to support adding HTML attributes to inline code blocks.

## Description

This plugin takes inline code blocks in Markdown, and allows users to add HTML attributes to it in a URL query params format:

The following Markdown:

```md
`this is an example^className=language-java&data-test-example=true`
```

Gets converted to:

```html
<code data-test-example="true" class="language-java"
  >this is an example with custom separator</code
>
```

The separator by default is `^`, but it can be changed in the configuration.

### Configuration

- config.separator: [String] The character that separates the class name from the content.

#### Option: separator

Using a custom separator:

```js
const result = await unified()
  // using '*' as the separator
  .use(rehypeInlineCodeAttributesPlugin, { separator: "*" });
```

The markdown:

```md
`this is an example with custom separator*className=language-java&data-test-example=true`
```

Is parsed as:

```html
<code data-test-example="true" class="language-java"
  >this is an example with custom separator</code
>
```

### Using unified

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { read } from "to-vfile";

import rehypeInlineCodeAttributesPlugin from "rehype-inline-code-attributes";

const result = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeInlineCodeAttributesPlugin)
  // add more plugins
  .process(await read("./test/example.md"));
```

### Using MDX factory (for Next.js)

```js
import withMDXFactory from "@next/mdx";
import rehypeInlineCodeAttributesPlugin from "rehype-inline-code-attributes";

const withMDX = withMDXFactory({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [rehypeInlineCodeAttributesPlugin],
    providerImportSource: "@mdx-js/react",
  },
});

const nextConfig = withMDX({
  // next.js configuration
});

export default nextConfig;
```

## Extending even further

If you need to add attributes to more elements, you might want to check (remark-directive)[https://github.com/remarkjs/remark-directive].
