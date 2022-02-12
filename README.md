# Web Feed Parser

Parse RSS/RDF/Atom XML [JSON Feed](https://www.jsonfeed.org/) in a browser environment

Note: This library only exports TypeScript. So you will need a modern compiler to use it. Currently only supporting [vite](https://vitejs.dev/) and [esbuild](https://esbuild.github.io/).

## Get started

```sh
npm i @osmoscraft/web-feed-parser
```

```TypeScript
import { WebFeedParser } from "@osmoscraft/web-feed-parser";

const input = "<?xml..." // feed content in XML string

const feedParser = new WebFeedParser();
const output = feedParser.toJsonFeed(input);
```

## Related

- [Node Feed Parser](https://github.com/osmoscraft/node-feed-parser). Same functionality, but running in the node.js environment.
