import { parsePropertyQuery } from "./parser.ts";
import { searchActiveListings } from "./search.ts";
import { getSoldComps } from "./comps.ts";
import { formatListingCard, formatSoldCard } from "./format.ts";
import { pool } from "./db.ts";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const includeComps = args.includes("--comps");
  const userQuery = args.filter(arg => arg !== "--comps").join(" ").trim();

  if (!userQuery) {
    throw new Error('Usage: node ... run.ts "property search" [--comps]');
  }

  const filters = await parsePropertyQuery(userQuery);
  const listings = await searchActiveListings(filters, 1, 10);

  console.log(`Found ${listings.length} listings on page 1.`);

  if (listings.length === 0) {
    console.log("No listings matched all requested filters.");
  } else {
    console.log(listings.map(formatListingCard).join("\n\n---\n\n"));
  }

  if (includeComps) {
    if (!filters.city) {
      console.log("Sold comparables require a specified city.");
    } else {
      const comps = await getSoldComps(filters.city, 12);
      console.log(`\nFound ${comps.length} recent sold comparables.`);
      console.log(comps.slice(0, 5).map(formatSoldCard).join("\n\n---\n\n"));
    }
  }
}

try {
  await main();
} catch (error) {
  console.error("Property search failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
