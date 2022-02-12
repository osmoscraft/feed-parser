import { WebFeedParser } from "..";

export function myParseFeed(input: string) {
  const feedParser = new WebFeedParser();
  return feedParser.xmlToJsonFeed(input.trim());
}
