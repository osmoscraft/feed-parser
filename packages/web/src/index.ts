import { atomParser, rssParser } from "./lib/parsers";
import { xmlToJsonFeed } from "./lib/xml-to-json-feed";
import { JsonFeed, JsonFeedItem } from "./typings";

export class WebFeedParser {
  xmlToJsonFeed(xml: string): JsonFeed {
    const jsonFeed = xmlToJsonFeed({
      xml,
      parsers: [rssParser, atomParser],
    });

    return jsonFeed;
  }
}

export { atomParser, rssParser } from "./lib/parsers";
export { xmlToJsonFeed } from "./lib/xml-to-json-feed";
export type { JsonFeed, JsonFeedItem };
