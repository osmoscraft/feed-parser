import { WebFeedParser } from "../feed-parser";

export function myParseFeed(input: string) {
  const feedParser = new WebFeedParser();
  return feedParser.toJsonFeed(input.trim());
}
