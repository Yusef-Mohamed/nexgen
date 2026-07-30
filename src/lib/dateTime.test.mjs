import assert from "node:assert/strict";
import test from "node:test";

import { formatMessageTime } from "./dateTime.ts";

const sampleDate = new Date("2026-06-27T13:05:00Z");

test("formatMessageTime localizes Arabic day period labels", () => {
  const formatted = formatMessageTime(sampleDate, "ar");

  assert.doesNotMatch(formatted, /\b(?:am|pm)\b/i);
});

test("formatMessageTime keeps English 12-hour chat time", () => {
  const formatted = formatMessageTime(sampleDate, "en");

  assert.match(formatted, /\b(?:am|pm)\b/i);
});
