import { JsonFeed } from "../typings";
import { JsonFeedItem } from "../typings/json-feed";

export interface JsonFeedParser {
  isMatch: (root: Document) => boolean;
  selectChannel: (root: Document) => Element;
  resolveChannel: (channelElement: Element) => JsonFeed;
  selectItems: (root: Document) => HTMLCollection;
  resolveItem: (itemElement: Element, channelElement: Element) => JsonFeedItem;
}

export interface XmlToJsonFeedInput {
  xml: string;
  parsers: JsonFeedParser[];
}

const domParser = new DOMParser();

export function xmlToJsonFeed(input: XmlToJsonFeedInput): JsonFeed {
  const dom = domParser.parseFromString(input.xml, "application/xml");
  const parser = input.parsers.find((parser) => parser.isMatch(dom));
  if (!parser) throw new Error("No parser found");

  const { selectChannel, resolveChannel, selectItems, resolveItem } = parser;

  const channelElement = selectChannel(dom);

  return {
    ...resolveChannel(channelElement),
    items: [...selectItems(dom)].map((itemElement) => resolveItem(itemElement, channelElement)),
  };
}
