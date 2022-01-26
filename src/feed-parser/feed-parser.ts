import { JsonFeed } from "../typings/json-feed";
import { atomParser, rssParser } from "./xml-to-json-feed/parsers";
import { xmlToJsonFeed } from "./xml-to-json-feed/xml-to-json-feed";

export class WebFeedParser {
  private domParser = new DOMParser();

  toJsonFeed(xml: string): JsonFeed {
    const dom = this.domParser.parseFromString(xml, "application/xml");
    const jsonFeed = xmlToJsonFeed({
      dom,
      parsers: [rssParser, atomParser],
    });

    return jsonFeed;
  }
}
