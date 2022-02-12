import { atomParser, rssParser } from "./lib/parsers";
import { xmlToJsonFeed } from "./lib/xml-to-json-feed";
import type { JsonFeed, JsonFeedItem } from "./typings";

export class NodeFeedParser {
  async xmlToJsonFeed(input: string): Promise<JsonFeed> {
    return xmlToJsonFeed({
      xml: input,
      parsers: [rssParser, atomParser],
    });
  }
}

export { atomParser, rssParser } from "./lib/parsers";
export { xmlToJsonFeed } from "./lib/xml-to-json-feed";
export type { JsonFeed, JsonFeedItem };
