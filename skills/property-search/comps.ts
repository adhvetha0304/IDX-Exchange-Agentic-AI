import type { RowDataPacket } from "mysql2/promise";
import { query } from "./db.ts";

export interface SoldRow extends RowDataPacket {
  ListingKey: number;
  UnparsedAddress: string | null;
  City: string;
  CloseDate: string;
  ClosePrice: number | null;
  OriginalListPrice: number | null;
  ListPrice: number | null;
  DaysOnMarket: number | null;
  BedroomsTotal: number | null;
  BathroomsTotalInteger: number | null;
  LivingArea: number | null;
  PropertyType: string | null;
  PropertySubType: string | null;
  YearBuilt: number | null;
  ListOfficeName: string | null;
}

export async function getSoldComps(
  city: string,
  months = 12
): Promise<SoldRow[]> {
  if (!city.trim()) {
    throw new Error("City is required.");
  }

  if (!Number.isSafeInteger(months) || months < 1 || months > 120) {
    throw new Error("Months must be between 1 and 120.");
  }

  const sql = `
    SELECT
      ListingKey, UnparsedAddress, City,
      CloseDate, ClosePrice, OriginalListPrice,
      ListPrice, DaysOnMarket, BedroomsTotal,
      BathroomsTotalInteger, LivingArea,
      PropertyType, PropertySubType,
      YearBuilt, ListOfficeName
    FROM california_sold
    WHERE City = ?
      AND PropertyType = ?
      AND CloseDate BETWEEN
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL ? MONTH), '%Y-%m-%d')
        AND DATE_FORMAT(CURDATE(), '%Y-%m-%d')
    ORDER BY CloseDate DESC, ListingKey DESC
    LIMIT 50
  `;

  return query<SoldRow>(sql, [city.trim(), "Residential", months]);
}
