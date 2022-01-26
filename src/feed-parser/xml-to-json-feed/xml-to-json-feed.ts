import { ParsedJsonFeed } from "../../typings";
import { JsonFeed, JsonFeedItem } from "../../typings/json-feed";

export interface XmlFeedParser {
  isMatch: (root: Document) => boolean;
  selectChannel: (root: Document) => Element;
  resolveChannel: (channelElement: Element) => ParsedJsonFeed;
  selectItems: (root: Document) => HTMLCollection;
  resolveItem: (itemElement: Element, channelElement: Element) => JsonFeedItem;
}

export interface XmlToJsonFeedInput {
  dom: Document;
  parsers: XmlFeedParser[];
}
export function xmlToJsonFeed(input: XmlToJsonFeedInput): JsonFeed {
  const parser = input.parsers.find((parser) => parser.isMatch(input.dom));
  if (!parser) throw new Error("No parser found");

  const { selectChannel, resolveChannel, selectItems, resolveItem } = parser;

  const channelElement = selectChannel(input.dom);

  return {
    ...resolveChannel(channelElement),
    items: [...selectItems(input.dom)].map((itemElement) => resolveItem(itemElement, channelElement)),
  };
}
