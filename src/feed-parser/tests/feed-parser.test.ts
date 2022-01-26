import { WebFeedParser } from "../feed-parser";
import { describe, it, expect } from "@osmoscraft/web-testing-library";

export const testChannelParsing = describe("Channel parsing", () => {
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
    ).toEqual(["_ext", "items", "title", "version"]);
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
    ).toEqual(["_ext", "items", "title", "version"]);
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
    ).toEqual(["_ext", "items", "title", "version"]);
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

  it("Channel timestamps/No date/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
        </channel>
      </rss>
    `);

    await expect(result._ext.date_published).toEqual(undefined);
    await expect(result._ext.date_modified).toEqual(undefined);
  });

  it("Channel timestamps/Publish only/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <pubDate>Sat, 01 Jan 2000 00:00:00 GMT</pubDate>
        </channel>
      </rss>
    `);

    await expect(result._ext.date_published).toEqual("2000-01-01T00:00:00.000Z");
    await expect(result._ext.date_modified).toEqual("2000-01-01T00:00:00.000Z");
  });

  it("Channel timestamps/Update only/RSS", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <lastBuildDate>Tue, 12 Dec 2000 12:12:12 GMT</lastBuildDate>
        </channel>
      </rss>
    `);

    await expect(result._ext.date_published).toEqual("2000-12-12T12:12:12.000Z");
    await expect(result._ext.date_modified).toEqual("2000-12-12T12:12:12.000Z");
  });

  it("Channel timestamps/Publish and update/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <pubDate>Sat, 01 Jan 2000 00:00:00 GMT</pubDate>
          <lastBuildDate>Tue, 12 Dec 2000 12:12:12 GMT</lastBuildDate>
        </channel>
      </rss>
    `);

    await expect(result._ext.date_published).toEqual("2000-01-01T00:00:00.000Z");
    await expect(result._ext.date_modified).toEqual("2000-12-12T12:12:12.000Z");
  });

  it("Channel timestamps/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <channel rdf:about="http://mock-domain.com/rss">
          <dc:date>2000-12-12T12:12:12Z</dc:date>
        </channel>
      </rdf:RDF>
    `);

    await expect(result._ext.date_published).toEqual("2000-12-12T12:12:12.000Z");
    await expect(result._ext.date_modified).toEqual("2000-12-12T12:12:12.000Z");
  });

  it("Channel timestamps/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <updated>2000-12-12T12:12:12Z</updated>
      </feed>
    `);

    await expect(result._ext.date_published).toEqual("2000-12-12T12:12:12.000Z");
    await expect(result._ext.date_modified).toEqual("2000-12-12T12:12:12.000Z");
  });
});

export const testItemParsing = describe("Item parsing", () => {
  it("Missing fields/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item></item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].id).toEqual("");
    await expect(result.items[0].content_text).toEqual("");
    await expect(result.items[0].content_html).toEqual("");
    await expect(
      Object.keys(Object.fromEntries(Object.entries(result.items[0]).filter((entry) => entry[1] !== undefined))).sort()
    ).toEqual(["content_html", "content_text", "id"]);
  });

  it("Missing fields/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <channel></channel>
        <item></item>
      </rdf:RDF>
    `);

    await expect(result.items[0].id).toEqual("");
    await expect(result.items[0].content_text).toEqual("");
    await expect(result.items[0].content_html).toEqual("");
    await expect(
      Object.keys(Object.fromEntries(Object.entries(result.items[0]).filter((entry) => entry[1] !== undefined))).sort()
    ).toEqual(["content_html", "content_text", "id"]);
  });

  it("Missing fields/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry></entry>
      </feed>
    `);

    await expect(result.items[0].id).toEqual("");
    await expect(result.items[0].content_text).toEqual("");
    await expect(result.items[0].content_html).toEqual("");
    await expect(
      Object.keys(Object.fromEntries(Object.entries(result.items[0]).filter((entry) => entry[1] !== undefined))).sort()
    ).toEqual(["content_html", "content_text", "id"]);
  });

  it("Id/Link only/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <link>http://mock-domain.com/item/1</link>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].id).toEqual("http://mock-domain.com/item/1");
  });

  it("Id/Guid only/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <guid>1234-abcd</guid>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].id).toEqual("1234-abcd");
  });

  it("Id/Guid and link/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <link>http://mock-domain.com/item/1</link>
            <guid>1234-abcd</guid>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].id).toEqual("1234-abcd");
  });

  it("Id/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <channel>
        </channel>
        <item>
          <link>http://mock-domain.com/item/1</link>
        </item>
      </rdf:RDF>
    `);

    await expect(result.items[0].id).toEqual("http://mock-domain.com/item/1");
  });

  it("Id/Id only/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <id>1234-abcd</id>
        </entry>
      </feed>
    `);

    await expect(result.items[0].id).toEqual("1234-abcd");
  });

  it("Id/Link only/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <link href="http://mock-domain.com/item/1"/>
        </entry>
      </feed>
    `);

    await expect(result.items[0].id).toEqual("http://mock-domain.com/item/1");
  });

  it("Id/Id and link/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <id>1234-abcd</id>
          <link href="http://mock-domain.com/item/1"/>
        </entry>
      </feed>
    `);

    await expect(result.items[0].id).toEqual("1234-abcd");
  });

  it("Url/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <link>http://mock-domain.com/item/1</link>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].url).toEqual("http://mock-domain.com/item/1");
  });

  it("Url/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <channel>
        </channel>
        <item>
          <link>http://mock-domain.com/item/1</link>
        </item>
      </rdf:RDF>
    `);

    await expect(result.items[0].url).toEqual("http://mock-domain.com/item/1");
  });

  it("Url/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <link href="http://mock-domain.com/item/1"/>
        </entry>
      </feed>
    `);

    await expect(result.items[0].url).toEqual("http://mock-domain.com/item/1");
  });

  it("Title/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <title>Mock item title 1</title>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].title).toEqual("Mock item title 1");
  });

  it("Title/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <channel>
        </channel>
        <item>
          <title>Mock item title 1</title>
        </item>
      </rdf:RDF>
    `);

    await expect(result.items[0].title).toEqual("Mock item title 1");
  });

  it("Title/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <title>Mock item title 1</title>
        </entry>
      </feed>
    `);

    await expect(result.items[0].title).toEqual("Mock item title 1");
  });

  it("Content/Plaintext", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description>Plaintext description</description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].content_text).toEqual("Plaintext description");
    await expect(result.items[0].content_html).toEqual("Plaintext description");
  });

  it("Content/Space trimming", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description> \r\n\t Plaintext description \r\n\t </description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].content_text).toEqual("Plaintext description");
    await expect(result.items[0].content_html).toEqual("Plaintext description");
  });

  it("Content/Ampersand", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description>&amp;</description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].content_text).toEqual("&");
    await expect(result.items[0].content_html).toEqual("&");
  });

  it("Content/Angle bracket", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description>&amp;lt;</description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].content_text).toEqual("<");
    await expect(result.items[0].content_html).toEqual("&lt;");
  });

  it("Content/HTML tags", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description>&lt;b&gt;bold&lt;/b&gt;</description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].content_text).toEqual("bold");
    await expect(result.items[0].content_html).toEqual("<b>bold</b>");
  });

  it("Content/Double-escaped entities", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description>&amp;lt;b&amp;gt;bold&amp;lt;/b&amp;gt;</description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].content_text).toEqual("<b>bold</b>");
    await expect(result.items[0].content_html).toEqual("&lt;b&gt;bold&lt;/b&gt;");
  });

  it("Content/CDATA without escape", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description><![CDATA[<b>bold</b>]]></description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].content_text).toEqual("bold");
    await expect(result.items[0].content_html).toEqual("<b>bold</b>");
  });

  it("Content/CDATA with escape", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description><![CDATA[&lt;b&gt;bold&lt;/b&gt;]]></description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].content_text).toEqual("<b>bold</b>");
    await expect(result.items[0].content_html).toEqual("&lt;b&gt;bold&lt;/b&gt;");
  });

  it("Content/HTML", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description><b>bold</b></description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].content_text).toEqual("bold");
    await expect(result.items[0].content_html).toEqual("<b>bold</b>");
  });

  it("Content/Atom/Default type", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <summary>&lt;b&gt;bold&lt;/b&gt;</summary>
        </entry>
      </feed>
    `);

    await expect(result.items[0].content_text).toEqual("<b>bold</b>");
    await expect(result.items[0].content_html).toEqual("&lt;b&gt;bold&lt;/b&gt;");
  });

  it("Content/Atom/text type", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <summary type="text">&lt;b&gt;bold&lt;/b&gt;</summary>
        </entry>
      </feed>
    `);

    await expect(result.items[0].content_text).toEqual("<b>bold</b>");
    await expect(result.items[0].content_html).toEqual("&lt;b&gt;bold&lt;/b&gt;");
  });

  it("Content/Atom/html type", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <summary type="html">&lt;b&gt;bold&lt;/b&gt;</summary>
        </entry>
      </feed>
    `);

    await expect(result.items[0].content_text).toEqual("bold");
    await expect(result.items[0].content_html).toEqual("<b>bold</b>");
  });

  it("Content/Atom/xhtml type", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <summary type="xhtml">
            <div xmlns="http://www.w3.org/1999/xhtml">
              AT&amp;T bought <b>by SBC</b>
            </div>
          </summary>
        </entry>
      </feed>
    `);

    await expect(result.items[0].content_text).toEqual("AT&T bought by SBC");
    await expect(result.items[0].content_html).toEqual(
      `AT&T bought <b xmlns="http://www.w3.org/1999/xhtml">by SBC</b>`
    );
  });

  it("Summary and content/Summary only/RSS", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <description>summary</description>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].summary).toEqual("summary");
    await expect(result.items[0].content_text).toEqual("summary");
  });

  it("Summary and content/Summary only/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <summary>summary</summary>
        </entry>
      </feed>
    `);

    await expect(result.items[0].summary).toEqual("summary");
    await expect(result.items[0].content_text).toEqual("summary");
  });

  it("Summary and content/Content only/RSS", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <channel>
          <item>
            <content:encoded>content</content:encoded>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].summary).toEqual("content");
    await expect(result.items[0].content_text).toEqual("content");
  });

  it("Summary and content/Content only/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <content>content</content>
        </entry>
      </feed>
    `);

    await expect(result.items[0].summary).toEqual("content");
    await expect(result.items[0].content_text).toEqual("content");
  });

  it("Summary and content/Both/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <channel>
          <item>
            <description>summary</description>
            <content:encoded>content</content:encoded>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].summary).toEqual("summary");
    await expect(result.items[0].content_text).toEqual("content");
  });

  it("Summary and content/Both/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <summary>summary</summary>
          <content>content</content>
        </entry>
      </feed>
    `);

    await expect(result.items[0].summary).toEqual("summary");
    await expect(result.items[0].content_text).toEqual("content");
  });

  it("Image/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <enclosure url="http://mock-domain.com/item-image-1.png" length="1000" type="image/png" />
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].image).toEqual("http://mock-domain.com/item-image-1.png");
  });

  it("Image/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:enc="http://purl.oclc.org/net/rss_2.0/enc#"
      >
        <channel>
        </channel>
        <item>
          <enc:enclosure rdf:resource="http://mock-domain.com/item-image-1.png" enc:type="image/png" enc:length="1000" />
        </item>
      </rdf:RDF>
    `);

    await expect(result.items[0].image).toEqual("http://mock-domain.com/item-image-1.png");
  });

  it("Image/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <link rel="enclosure" type="image/png" href="http://mock-domain.com/item-image-1.png" />
        </entry>
      </feed>
    `);

    await expect(result.items[0].image).toEqual("http://mock-domain.com/item-image-1.png");
  });

  it("Timestamps/RSS2", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss>
        <channel>
          <item>
            <pubDate>Sat, 01 Jan 2000 00:00:00 GMT</pubDate>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].date_published).toEqual("2000-01-01T00:00:00.000Z");
    await expect(result.items[0].date_modified).toEqual("2000-01-01T00:00:00.000Z");
  });

  it("Timestamps/RDF", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <rss xmlns:dc="http://purl.org/dc/elements/1.1/">
        <channel>
          <item>
            <dc:date>2000-01-01T00:00:00Z</dc:date>
          </item>
        </channel>
      </rss>
    `);

    await expect(result.items[0].date_published).toEqual("2000-01-01T00:00:00.000Z");
    await expect(result.items[0].date_modified).toEqual("2000-01-01T00:00:00.000Z");
  });

  it("Timestamps/Publish only/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <published>2000-01-01T00:00:00Z</published>
        </entry>
      </feed>
    `);

    await expect(result.items[0].date_published).toEqual("2000-01-01T00:00:00.000Z");
    await expect(result.items[0].date_modified).toEqual("2000-01-01T00:00:00.000Z");
  });

  it("Timestamps/Update only/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <updated>2000-12-12T12:12:12Z</updated>
        </entry>
      </feed>
    `);

    await expect(result.items[0].date_published).toEqual("2000-12-12T12:12:12.000Z");
    await expect(result.items[0].date_modified).toEqual("2000-12-12T12:12:12.000Z");
  });

  it("Timestamps/Publish and update/Atom", async () => {
    const result = myParseFeed(`
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <published>2000-01-01T00:00:00Z</published>
          <updated>2000-12-12T12:12:12Z</updated>
        </entry>
      </feed>
    `);

    await expect(result.items[0].date_published).toEqual("2000-01-01T00:00:00.000Z");
    await expect(result.items[0].date_modified).toEqual("2000-12-12T12:12:12.000Z");
  });
});

function myParseFeed(input: string) {
  const feedParser = new WebFeedParser();
  return feedParser.toJsonFeed(input.trim());
}
