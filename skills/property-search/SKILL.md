---
name: property-search
description: Search California MLS property listings using natural-language filters, return formatted property cards, and retrieve recent sold comparables. Use when a user asks to find homes, condos, townhouses, land, or recent property sales.
---

# Property Search

Convert a user's property search request into structured filters using the local TypeScript parser.

## Supported filters

- City
- Maximum property price
- Bedrooms
- Bathrooms
- Square footage
- Property type
- Private pool
- View
- Maximum HOA fee

## Execution

From the IDX project directory, run:

    python3 /workspace/property-search-parser.py "USER QUERY"

Replace USER QUERY with the actual property search request, passed as one safely quoted command-line argument.

The command returns JSON with these fields:

city, maxPrice, beds, baths, sqft, type, pool, hasView, maxHOA.

Do not invent missing filters. A null value means the user did not specify that filter.

## Week 3: MLS property search

For actual property listings, use the sandbox client:

    python3 /workspace/idx-property-search.py "USER QUERY"

To include recent sold-property comparables:

    python3 /workspace/idx-property-search.py "USER QUERY" --comps

Replace USER QUERY with the user's complete property-search request as one safely quoted argument.

The client submits a validated request to the local IDX database worker through the shared workspace. The worker performs parameterized, read-only searches and returns formatted property cards.

The response contains:
- city: searched city
- listingCount: number of active listings returned on the first page
- listingCards: up to 10 formatted active-property listings
- soldCards: up to 5 formatted sold comparables when --comps is requested

A city must be specified. If the search returns zero listings, report that no properties matched the requested filters. Do not invent listings or prices.

The local database worker must be running on the Mac for the search to succeed.

The sandbox has no network access and must not be given database credentials. Do not execute arbitrary SQL or modify MLS records.

The standalone Python parser remains available for parsing-only requests:

    python3 /workspace/property-search-parser.py "USER QUERY"
