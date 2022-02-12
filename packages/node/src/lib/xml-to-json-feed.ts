import type { JsonFeed, JsonFeedItem } from "@osmoscraft/json-feed-types";
import type { Document, Element } from "cheerio";
import cheerio, { Cheerio } from "cheerio";
import * as htmlparser2 from "htmlparser2";

export interface JsonFeedParser {
  isMatch: (root: Cheerio<Document>) => boolean;
  selectChannel: (root: Cheerio<Document>) => Cheerio<Element>;
  resolveChannel: (channelElement: Cheerio<Element>) => JsonFeed;
  selectItems: (root: Cheerio<Document>) => Cheerio<Element>;
  resolveItem: (itemElement: Cheerio<Element>, channelElement: Cheerio<Element>) => JsonFeedItem;
}

export interface XmlToJsonFeedInput {
  xml: string;
  parsers: JsonFeedParser[];
}
export function xmlToJsonFeed(input: XmlToJsonFeedInput): JsonFeed {
  const dom = htmlparser2.parseDocument(input.xml, { xmlMode: true, decodeEntities: true });
  const $ = cheerio.load(dom, { xmlMode: true, decodeEntities: false });
  const root = $.root();

  const parser = input.parsers.find((parser) => parser.isMatch(root));
  if (!parser) throw new Error("No parser found");

  const { selectChannel, resolveChannel, selectItems, resolveItem } = parser;

  const channelElement = selectChannel(root);

  const results = {
    ...resolveChannel(channelElement),
    items: selectItems(root)
      .toArray()
      .map((itemElement) => resolveItem($(itemElement), channelElement)),
  };

  return results;
}
