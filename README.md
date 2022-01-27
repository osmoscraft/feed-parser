# Web Feed Parser

Parse RSS/RDF/Atom XML into [JSON Feed](https://www.jsonfeed.org/) in a browser environment

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

## Quirk

JSON Feed does not specify how to represent timestamp on the Channel level. This library provides them under `_ext.date_modified` and `_ext.date_published`, which is compliant with JSON Feed extensibility guideline.
