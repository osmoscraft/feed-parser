import { describe, expect, it } from "vitest";
import { atomParser, rssParser, xmlToJsonFeed } from "..";

describe("Parse channel", () => {
  it("Throws for Non-feed XML", async () => {
    await expect(() => myParseFeed(`<?xml version="1.0"?>`)).toThrow();
  });

  it("Missings fields/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel></channel>
      </rss>
    `);

    await expect(result.title).toEqual("");
    await expect(result.items).toEqual([]);
    await expect(
      Object.keys(Object.fromEntries(Object.entries(result).filter((entry) => entry[1] !== undefined))).sort()
    ).toEqual(["items", "title", "version"]);
  });

  it("Missing fields/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <channel></channel>
      </rdf:RDF>
    `);

    await expect(result.title).toEqual("");
    await expect(result.items).toEqual([]);
    await expect(
      Object.keys(Object.fromEntries(Object.entries(result).filter((entry) => entry[1] !== undefined))).sort()
    ).toEqual(["items", "title", "version"]);
  });

  it("Missing fields/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom"></feed>
    `);

    await expect(result.title).toEqual("");
    await expect(result.items).toEqual([]);
    await expect(
      Object.keys(Object.fromEntries(Object.entries(result).filter((entry) => entry[1] !== undefined))).sort()
    ).toEqual(["items", "title", "version"]);
  });

  it("JSON Feed version/RSS", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <title></title>
        </channel>
      </rss>
    `);

    await expect(result.version).toEqual("https://jsonfeed.org/version/1.1");
  });

  it("JSON Feed version/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <channel>
          <title></title>
        </channel>
      </rdf:RDF>
    `);

    await expect(result.version).toEqual("https://jsonfeed.org/version/1.1");
  });

  it("JSON Feed version/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title></title>
      </feed>
    `);

    await expect(result.version).toEqual("https://jsonfeed.org/version/1.1");
  });

  it("Title/RSS", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <title>Mock channel title</title>
        </channel>
      </rss>
    `);

    await expect(result.title).toEqual("Mock channel title");
  });

  it("Title/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Mock channel title</title>
      </feed>
    `);

    await expect(result.title).toEqual("Mock channel title");
  });

  it("Summary/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <description>Mock channel description</description>
        </channel>
      </rss>
    `);

    await expect(result.description).toEqual("Mock channel description");
  });

  it("Summary/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <subtitle>Mock channel description</subtitle>
      </feed>
    `);

    await expect(result.description).toEqual("Mock channel description");
  });

  it("Home page url/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <link>http://mock-domain.com</link>
        </channel>
      </rss>
    `);

    await expect(result.home_page_url).toEqual("http://mock-domain.com");
  });

  it("Home page url/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <link href="http://mock-domain.com"/>
      </feed>
    `);

    await expect(result.home_page_url).toEqual("http://mock-domain.com");
  });

  it("Home page url with self/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <link rel="self" href="http://mock-domain.com/feed.xml"/>
        <link rel="alternate" href="http://mock-domain.com"/>
      </feed>
    `);

    await expect(result.home_page_url).toEqual("http://mock-domain.com");
  });

  it("Channel icon/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <image>
            <url>http://mock-domain.com/channel-image.png</url>
            <title>Mock channel image title</title>
            <link>http://mock-domain.com</link>
          </image>
        </channel>
      </rss>
    `);

    await expect(result.icon).toEqual("http://mock-domain.com/channel-image.png");
  });

  it("Channel icon/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <channel rdf:about="http://mock-domain.com/rss">
          <image rdf:resource="http://mock-domain.com/channel-image.png" />
        </channel>
        <image rdf:about="https://mock-domain.com/channel.image.png">
          <url>http://mock-domain.com/channel-image.png</url>
          <title>Mock channel image title</title>
          <link>http://mock-domain.com</link>
        </image>
      </rdf:RDF>
    `);

    await expect(result.icon).toEqual("http://mock-domain.com/channel-image.png");
  });

  it("Channel icon/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <icon>http://mock-domain.com/channel-image.png</icon>
      </feed>
    `);

    await expect(result.icon).toEqual("http://mock-domain.com/channel-image.png");
  });
});

function myParseFeed(input: string) {
  return xmlToJsonFeed({
    xml: input,
    parsers: [rssParser, atomParser],
  });
}
