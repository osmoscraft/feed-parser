import { JsonFeed } from "@osmoscraft/json-feed-types";
import { atomParser, rssParser } from "./lib/parsers";
import { xmlToJsonFeed } from "./lib/xml-to-json-feed";

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
