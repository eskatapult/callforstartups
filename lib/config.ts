import fs from "fs";
import path from "path";
import type { AppConfig, ClientConfig } from "./types";

// Reads config.json fresh on every call — no caching — so edits take
// effect on the next request without a server restart or rebuild.
export function getConfig(): AppConfig {
  const configPath = path.join(process.cwd(), "config.json");
  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw) as AppConfig;
}

// Safe subset to pass to the browser (no secrets, no server paths).
export function getClientConfig(): ClientConfig {
  const { reviewMode, reviewStrictness, maxDeckSizeMb } = getConfig();
  return { reviewMode, reviewStrictness, maxDeckSizeMb };
}
