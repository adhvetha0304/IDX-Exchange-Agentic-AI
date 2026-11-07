import json
import re
import sys


def parse_amount(value, suffix=None):
    amount = float(value.replace(",", ""))
    multiplier = {"k": 1000, "m": 1000000}
    return int(amount * multiplier.get((suffix or "").lower(), 1))


def parse_property_query(query):
    city = re.search(
        r"\bin\s+([A-Za-z][A-Za-z\s.-]*?)(?=\s+(?:under|below|with|above|over|at|for|that|and|priced)\b|[,?.!]|$)",
        query, re.I
    )

    hoa = re.search(
        r"\b(?:HOA|association fee)(?:\s+(?:fees?|dues?))?\s+(?:under|below|less than)\s+\$?([\d,]+)",
        query, re.I
    )

    without_hoa = re.sub(
        r"\b(?:HOA|association fee)(?:\s+(?:fees?|dues?))?\s+(?:under|below|less than)\s+\$?[\d,]+(?:\.\d+)?",
        "", query, flags=re.I
    )

    price = re.search(
        r"\b(?:under|below|less than|max(?:imum)?(?: price)?(?: of)?)\s+\$?([\d,]+(?:\.\d+)?)\s*([km])?\b",
        without_hoa, re.I
    )

    beds = re.search(r"\b(\d+)\s*[- ]?\s*(?:bedrooms?|beds?)\b", query, re.I)
    baths = re.search(r"\b(\d+(?:\.\d+)?)\s*[- ]?\s*(?:bathrooms?|baths?)\b", query, re.I)
    sqft = re.search(r"\b([\d,]+)\s*(?:sq\.?\s*ft\.?|sqft|square feet)\b", query, re.I)

    types = {
        "single family": "SingleFamilyResidence",
        "condominiums": "Condominium",
        "condominium": "Condominium",
        "condos": "Condominium",
        "condo": "Condominium",
        "townhouses": "Townhouse",
        "townhouse": "Townhouse",
        "townhomes": "Townhouse",
        "townhome": "Townhouse",
        "land": "UnimprovedLand",
    }

    property_type = next(
        (value for key, value in sorted(types.items(), key=lambda x: -len(x[0]))
         if re.search(r"\b" + re.escape(key) + r"\b", query, re.I)),
        None
    )

    return {
        "city": city.group(1).strip() if city else None,
        "maxPrice": parse_amount(price.group(1), price.group(2)) if price else None,
        "beds": int(beds.group(1)) if beds else None,
        "baths": float(baths.group(1)) if baths else None,
        "sqft": int(sqft.group(1).replace(",", "")) if sqft else None,
        "type": property_type,
        "pool": "True" if re.search(r"\bpool\b", query, re.I) else None,
        "hasView": "True" if re.search(r"\bview\b", query, re.I) else None,
        "maxHOA": int(hoa.group(1).replace(",", "")) if hoa else None,
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("Usage: python3 parser.py 'property search query'")
    print(json.dumps(parse_property_query(" ".join(sys.argv[1:])), indent=2))
