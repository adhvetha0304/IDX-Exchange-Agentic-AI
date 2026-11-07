---
name: property-search
description: Parse natural-language California property search requests into structured MLS filters. Use when a user asks to find or filter homes, condos, townhouses, or land.
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

This skill parses requests only. It does not query MLS databases or return actual listings. Database integration is handled separately.
