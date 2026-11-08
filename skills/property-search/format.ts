import type { ListingRow } from "./search.ts";
import type { SoldRow } from "./comps.ts";

function money(value: number | null): string {
  return value == null ? "Not available" : "$" + Number(value).toLocaleString("en-US");
}

function display(value: string | number | null): string {
  return value == null || value === "" ? "N/A" : String(value);
}

export function formatListingCard(listing: ListingRow): string {
  return [
    "Property: " + display(listing.L_Address) + ", " + display(listing.L_City),
    "Price: " + money(listing.price),
    "Bedrooms: " + display(listing.beds) + " | Bathrooms: " + display(listing.baths),
    "Area: " + display(listing.sqft) + " sqft",
    "Type: " + display(listing.type),
    "Days on market: " + display(listing.DaysOnMarket),
    "Photos available: " + display(listing.PhotoCount),
    "Listing ID: " + display(listing.L_ListingID)
  ].join("\n");
}

export function formatSoldCard(sold: SoldRow): string {
  return [
    "Sold property: " + display(sold.UnparsedAddress) + ", " + display(sold.City),
    "Sale price: " + money(sold.ClosePrice),
    "Closing date: " + display(sold.CloseDate),
    "Bedrooms: " + display(sold.BedroomsTotal) + " | Bathrooms: " + display(sold.BathroomsTotalInteger),
    "Area: " + display(sold.LivingArea) + " sqft",
    "Days on market: " + display(sold.DaysOnMarket)
  ].join("\n");
}
