import { readFile, writeFile, rename, lstat, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { homedir } from "node:os";
import { parsePropertyQuery } from "./parser.ts";
import { searchActiveListings } from "./search.ts";
import { getSoldComps } from "./comps.ts";
import { formatListingCard, formatSoldCard } from "./format.ts";
import { pool } from "./db.ts";

const workspace = join(
  homedir(),
  ".openclaw-idx-internship",
  "sandboxes",
  "workspace-18a1dc58f08c28157fa44e9a89e4b866"
);

const requestPath = join(workspace, "idx-search-request.json");
const responsePath = join(workspace, "idx-search-response.json");

async function main(): Promise<void> {
  const fileInfo = await lstat(requestPath);

  if (!fileInfo.isFile() || fileInfo.isSymbolicLink() || fileInfo.size > 2048) {
    throw new Error("Invalid request file.");
  }

  const request = JSON.parse(await readFile(requestPath, "utf8"));

  if (
    !request ||
    typeof request !== "object" ||
    Array.isArray(request) ||
    Object.keys(request).some(k => !["query", "includeComps"].includes(k)) ||
    typeof request.query !== "string" ||
    request.query.length < 3 ||
    request.query.length > 500 ||
    (request.includeComps !== undefined && typeof request.includeComps !== "boolean")
  ) {
    throw new Error("Invalid property-search request.");
  }

  const filters = await parsePropertyQuery(request.query);

  if (!filters.city) {
    throw new Error("A city must be specified.");
  }

  const listings = await searchActiveListings(filters, 1, 10);

  const result: {
    city: string;
    listingCount: number;
    listingCards: string[];
    soldCards?: string[];
  } = {
    city: filters.city,
    listingCount: listings.length,
    listingCards: listings.map(formatListingCard)
  };

  if (request.includeComps === true) {
    const comps = await getSoldComps(filters.city, 12);
    result.soldCards = comps.slice(0, 5).map(formatSoldCard);
  }

  const temporaryPath = responsePath + "." + randomUUID() + ".tmp";
  try {
    await writeFile(temporaryPath, JSON.stringify(result, null, 2), {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx"
    });
    await rename(temporaryPath, responsePath);
  } finally {
    await unlink(temporaryPath).catch(error => {
      if (error.code !== "ENOENT") throw error;
    });
  }

  console.log("SUCCESS: Property-search response created.");
  console.log("Listings:", result.listingCards.length);
  console.log("Sold cards:", result.soldCards?.length ?? 0);
}

try {
  await main();
} catch (error) {
  console.error("Bridge failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
} finally {
  await pool.end();
}
