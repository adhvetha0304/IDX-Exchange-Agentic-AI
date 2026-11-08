export interface PropertyFilters {
  city: string | null;
  maxPrice: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  type: string | null;
  pool: string | null;
  hasView: string | null;
  maxHOA: number | null;
}

function parseAmount(value: string, suffix?: string): number {
  let amount = Number(value.replace(/,/g, ""));
  if (["k", "thousand"].includes(suffix?.toLowerCase() ?? "")) amount *= 1000;
  if (["m", "million"].includes(suffix?.toLowerCase() ?? "")) amount *= 1000000;
  return amount;
}

export async function parsePropertyQuery(
  query: string
): Promise<PropertyFilters> {
  const cityMatch = query.match(
    /\bin\s+([A-Za-z][A-Za-z\s.-]*?)(?=\s+(?:under|below|with|above|over|at|for|that|and|priced)\b|[,?.!]|$)/i
  );

  // Exclude HOA clauses before extracting the property price.
  const queryWithoutHOA = query.replace(
    /\b(?:HOA|association fee)(?:\s+(?:fees?|dues?))?\s+(?:under|below|less than)\s+\$?[\d,]+(?:\.\d+)?/gi,
    ""
  );

  const priceMatch = queryWithoutHOA.match(
    /\b(?:under|below|less than|max(?:imum)?(?: price)?(?: of)?)\s+\$?([\d,]+(?:\.\d+)?)\s*(million|thousand|[km])?(?![\w.])/i
  );

  const bedsMatch = query.match(
    /\b(\d+)\s*[- ]?\s*(?:bedrooms?|beds?)\b/i
  );

  const bathsMatch = query.match(
    /\b(\d+(?:\.\d+)?)\s*[- ]?\s*(?:bathrooms?|baths?)\b/i
  );

  const sqftMatch = query.match(
    /\b([\d,]+)\s*(?:sq\.?\s*ft\.?|sqft|square feet)\b/i
  );

  const hoaMatch = query.match(
    /\b(?:HOA|association fee)(?:\s+(?:fees?|dues?))?\s+(?:under|below|less than)\s+\$?([\d,]+)/i
  );

  const typeMap: Record<string, string> = {
    "single family": "SingleFamilyResidence",
    "condominiums": "Condominium",
    "condos": "Condominium",
    "condominium": "Condominium",
    "condo": "Condominium",
    "townhouses": "Townhouse",
    "townhomes": "Townhouse",
    "townhouse": "Townhouse",
    "townhome": "Townhouse",
    "land": "UnimprovedLand"
  };

  const lower = query.toLowerCase();

  const typeKey = Object.keys(typeMap)
    .sort((a, b) => b.length - a.length)
    .find(key => new RegExp(`\\b${key}\\b`, "i").test(lower));

  return {
    city: cityMatch?.[1]?.trim() || null,
    maxPrice: priceMatch
      ? parseAmount(priceMatch[1], priceMatch[2])
      : null,
    beds: bedsMatch ? Number(bedsMatch[1]) : null,
    baths: bathsMatch ? Number(bathsMatch[1]) : null,
    sqft: sqftMatch
      ? Number(sqftMatch[1].replace(/,/g, ""))
      : null,
    type: typeKey ? typeMap[typeKey] : null,
    pool: /\bpool\b/i.test(query) ? "True" : null,
    hasView: /\bview\b/i.test(query) ? "True" : null,
    maxHOA: hoaMatch
      ? Number(hoaMatch[1].replace(/,/g, ""))
      : null
  };
}
