import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const currentDir = dirname(fileURLToPath(import.meta.url));

test("dashboard lives do not use bundled static live data", () => {
  const livesClient = readFileSync(join(currentDir, "LivesClient.tsx"), "utf8");
  const liveFilters = readFileSync(join(currentDir, "LiveFilters.tsx"), "utf8");

  assert.equal(existsSync(join(currentDir, "staticLives.ts")), false);
  assert.doesNotMatch(
    livesClient,
    /staticLives|USE_STATIC_LIVES|getStaticDashboardLives|staticDashboardLivePackages/,
  );
  assert.doesNotMatch(liveFilters, /fallbackPackages/);
});
