import { reportSummary } from "@osmoscraft/web-testing-library";
import { testParseChannel } from "./tests/parse-channel.test";
import { testParseItems } from "./tests/parse-items.test";

async function testAll() {
  const start = performance.now();
  await testParseChannel();
  await testParseItems();
  const duration = (performance.now() - start) / 1000;
  console.log(`parser test finished in ${duration}`);

  reportSummary();
}

testAll();
