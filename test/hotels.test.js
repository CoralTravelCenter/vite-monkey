import assert from "node:assert/strict";
import test from "node:test";

import { filterUniqueMatchingHotels } from "../brands/coral/podborky-cen/src/lib/hotels.js";

test("filterUniqueMatchingHotels keeps requested hotels unique by id", () => {
  const responses = [
    {
      result: {
        locations: [
          { id: 1, name: "Hotel One" },
          { id: 2, name: "Another Hotel" },
        ],
      },
    },
    {
      result: {
        locations: [
          { id: 1, name: "HOTEL ONE" },
          { id: 3, name: "Hotel Three" },
        ],
      },
    },
  ];

  assert.deepEqual(
    filterUniqueMatchingHotels(responses, ["hotel one", "hotel three"]),
    [
      { id: 1, name: "Hotel One" },
      { id: 3, name: "Hotel Three" },
    ],
  );
});
