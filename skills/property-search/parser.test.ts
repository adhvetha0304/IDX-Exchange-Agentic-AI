import assert from "node:assert/strict";
import { parsePropertyQuery, type PropertyFilters } from "./parser.ts";

const cases: Array<{
  query: string;
  expected: Partial<PropertyFilters>;
}> = [
  {
    query: "Show me 3-bedroom condos in Irvine under $1.5M with a pool",
    expected: { city: "Irvine", beds: 3, type: "Condominium", maxPrice: 1500000, pool: "True" }
  },
  {
    query: "Find 2-bedroom townhouses in Anaheim under $750k",
    expected: { city: "Anaheim", beds: 2, type: "Townhouse", maxPrice: 750000 }
  },
  {
    query: "Show me single family homes in Pasadena under $2M",
    expected: { city: "Pasadena", type: "SingleFamilyResidence", maxPrice: 2000000 }
  },
  {
    query: "Find 4 beds and 3 baths in Los Angeles under $1,200,000",
    expected: { city: "Los Angeles", beds: 4, baths: 3, maxPrice: 1200000 }
  },
  {
    query: "Show condos in Long Beach with a view",
    expected: { city: "Long Beach", type: "Condominium", hasView: "True" }
  },
  {
    query: "Find properties in Santa Monica with 2000 sqft",
    expected: { city: "Santa Monica", sqft: 2000 }
  },
  {
    query: "Find townhomes in San Diego with a pool",
    expected: { city: "San Diego", type: "Townhouse", pool: "True" }
  },
  {
    query: "Show 2-bedroom condominiums in Newport Beach with 2 baths",
    expected: { city: "Newport Beach", beds: 2, baths: 2, type: "Condominium" }
  },
  {
    query: "Find land in Riverside under $500k",
    expected: { city: "Riverside", type: "UnimprovedLand", maxPrice: 500000 }
  },
  {
    query: "Show townhouses in Burbank with a view and a pool",
    expected: { city: "Burbank", type: "Townhouse", hasView: "True", pool: "True" }
  },
  {
    query: "Find 3-bedroom condos in Irvine with HOA under $500",
    expected: { city: "Irvine", beds: 3, type: "Condominium", maxHOA: 500, maxPrice: null }
  },
  {
    query: "Show 4-bedroom houses in Glendale under $900k with 2500 sqft",
    expected: { city: "Glendale", beds: 4, maxPrice: 900000, sqft: 2500 }
  }
];

async function runTests() {
let passed = 0;

for (const [index, test] of cases.entries()) {
  const actual = await parsePropertyQuery(test.query);

  try {
    for (const [key, value] of Object.entries(test.expected)) {
      assert.deepEqual(
        actual[key as keyof PropertyFilters],
        value,
        `Mismatch in ${key}`
      );
    }
    console.log(`PASS ${index + 1}: ${test.query}`);
    passed++;
  } catch (error) {
    console.log(`FAIL ${index + 1}: ${test.query}`);
    console.log(error);
  }
}

console.log(`\nResults: ${passed}/${cases.length} passed`);
if (passed !== cases.length) process.exitCode = 1;

}

runTests().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
