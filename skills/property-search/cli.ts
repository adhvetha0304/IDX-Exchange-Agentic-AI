import { parsePropertyQuery } from "./parser";

async function main() {
  const query = process.argv.slice(2).join(" ").trim();

  if (!query) {
    console.error("Usage: tsx cli.ts \"property search query\"");
    process.exitCode = 1;
    return;
  }

  const filters = await parsePropertyQuery(query);
  console.log(JSON.stringify(filters, null, 2));
}

main().catch((error) => {
  console.error("Property search parsing failed:", error);
  process.exitCode = 1;
});
