import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const currentDir = dirname(fileURLToPath(import.meta.url));

test("practice feed does not use static practice fallback data", () => {
  const displayPosts = readFileSync(
    join(currentDir, "DisplayPosts.tsx"),
    "utf8",
  );

  assert.equal(existsSync(join(currentDir, "staticPracticePosts.ts")), false);
  assert.equal(
    existsSync(join(currentDir, "staticPracticePosts.test.mjs")),
    false,
  );
  assert.doesNotMatch(
    displayPosts,
    /staticPractice|getStaticPracticePosts|visiblePosts|shouldShowStaticPracticePosts/,
  );
});
