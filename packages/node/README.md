# Node Feed Parser

Parse RSS/RDF/Atom XML into JSON Feed in node.js environment

Note: This library only exports TypeScript. So you will need a modern compiler to use it. Currently only supporting [vite](https://vitejs.dev/) and [esbuild](https://esbuild.github.io/).

## Get started

```sh
npm i @osmoscraft/node-feed-parser
```

```TypeScript
import { NodeFeedParser } from "@osmoscraft/node-feed-parser";

const input = "<?xml..." // feed content in XML string

const feedParser = new NodeFeedParser();
const output = feedParser.toJsonFeed(input);
```

## Related

- [Web Feed Parser](https://github.com/osmoscraft/web-feed-parser). Same functionality, but running in the browser environment.
