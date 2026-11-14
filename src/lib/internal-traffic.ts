/**
 * Internal-traffic flag for analytics exclusion.
 *
 * - `?internal=1` → persist in localStorage (`internal_traffic = "true"`)
 * - `?internal=0` → remove it
 * - Anything that sends analytics must check `isInternalTraffic()` first.
 *
 * In-memory fallback covers storage that throws (private mode / quota) so the
 * flag still holds for the current page session.
 */

const STORAGE_KEY = "internal_traffic";

type Listener = () => void;

const listeners = new Set<Listener>();

/** Set when the URL toggled the flag; null = defer to localStorage. */
let memoryFlag: boolean | null = null;

function readStorage(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function notify(): void {
  for (const listener of listeners) listener();
}

/** Parse `?internal=1|0`; anything else (or a bad string) means "no change". */
function parseUrlFlag(search: string): boolean | null {
  try {
    const value = new URLSearchParams(search).get("internal");
    if (value === "1") return true;
    if (value === "0") return false;
  } catch {
    // ignore malformed search strings
  }
  return null;
}

/** Persist the flag. In-memory copy keeps the session correct if storage throws. */
function applyFlag(next: boolean): void {
  memoryFlag = next;
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, "true");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore quota / private mode
  }
}

let initialized = false;

/**
 * First client read applies the landing URL once, so the very first render
 * already knows about `?internal=1|0` (no effect + extra render needed).
 */
function initFromLandingUrl(): void {
  if (initialized) return;
  initialized = true;
  const fromUrl = parseUrlFlag(window.location.search);
  if (fromUrl !== null) applyFlag(fromUrl);
}

export function isInternalTraffic(): boolean {
  if (typeof window === "undefined") return false;
  initFromLandingUrl();
  if (memoryFlag !== null) return memoryFlag;
  return readStorage();
}

/**
 * Apply `?internal=1|0` from a search string (default: current URL).
 * Call it on every client-side navigation. Notifies subscribers when the
 * flag value changes.
 */
export function syncInternalFlagFromUrl(search?: string): void {
  if (typeof window === "undefined") return;

  const next = parseUrlFlag(search ?? window.location.search);
  if (next === null) return;

  const before = isInternalTraffic();
  applyFlag(next);
  if (before !== next) notify();
}

/** For `useSyncExternalStore`. Also reacts to other tabs changing the flag. */
export function subscribeInternalTraffic(listener: Listener): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    // Storage is the source of truth again once another tab changed it.
    memoryFlag = null;
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
