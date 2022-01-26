import { reportSummary } from "@osmoscraft/web-testing-library";
import { testChannelParsing, testItemParsing } from "./feed-parser/tests/feed-parser.test";

async function testAll() {
  const start = performance.now();
  await testChannelParsing();
  await testItemParsing();
  const duration = (performance.now() - start) / 1000;
  console.log(`parser test finished in ${duration}`);

  reportSummary();
}

testAll();
