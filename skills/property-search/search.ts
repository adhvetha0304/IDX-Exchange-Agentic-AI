import type { RowDataPacket } from "mysql2/promise";
import type { PropertyFilters } from "./parser.ts";
import { query } from "./db.ts";

export interface ListingRow extends RowDataPacket {
  L_ListingID: string;
  L_DisplayId: string | null;
  L_Address: string | null;
  L_City: string | null;
  L_Zip: string | null;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  type: string | null;
  status: string | null;
  AssociationFee: number | null;
  DaysOnMarket: number | null;
  PoolPrivateYN: string | null;
  ViewYN: string | null;
  PhotoCount: number | null;
}

export async function searchActiveListings(
  filters: PropertyFilters,
  page = 1,
  limit = 10
): Promise<ListingRow[]> {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("Page must be a positive integer.");
  }

  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 50) {
    throw new Error("Limit must be between 1 and 50.");
  }

  const offset = (page - 1) * limit;

  let sql = `
    SELECT
      L_ListingID, L_DisplayId, L_Address, L_City, L_Zip,
      L_SystemPrice AS price,
      L_Keyword2 AS beds,
      LM_Dec_3 AS baths,
      LM_Int2_3 AS sqft,
      L_Type_ AS type,
      L_Status AS status,
      AssociationFee, DaysOnMarket,
      PoolPrivateYN, ViewYN, PhotoCount
    FROM rets_property
    WHERE L_Status = ?
  `;

  const params: (string | number)[] = ["Active"];

  const conditions: Array<[string, string | number | null]> = [
    ["L_City = ?", filters.city],
    ["L_SystemPrice <= ?", filters.maxPrice],
    ["L_Keyword2 >= ?", filters.beds],
    ["LM_Dec_3 >= ?", filters.baths],
    ["LM_Int2_3 >= ?", filters.sqft],
    ["L_Type_ = ?", filters.type],
    ["PoolPrivateYN = ?", filters.pool],
    ["ViewYN = ?", filters.hasView],
    ["AssociationFee <= ?", filters.maxHOA]
  ];

  for (const [condition, value] of conditions) {
    if (value !== null && value !== undefined) {
      sql += ` AND ${condition}`;
      params.push(value);
    }
  }

  sql += " ORDER BY L_SystemPrice ASC, L_ListingID ASC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  return query<ListingRow>(sql, params);
}
