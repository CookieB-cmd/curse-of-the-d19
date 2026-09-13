import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const src = fs.readFileSync(new URL("../scripts/d19.js", import.meta.url), "utf8");

test("bridges a Foundry d19 result into a supported DSN d24 visual roll", () => {
  assert.match(src, /diceSoNiceRollStart/);
  assert.match(src, /1d24/);
  assert.match(src, /Math\.min\(24/);
  assert.match(src, /showForRoll/);
});

test("uses the approved curse text for a natural 19", () => {
  assert.match(src, /A natural 19\. You feel cursed\./);
});
