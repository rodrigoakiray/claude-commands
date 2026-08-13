"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "claude-commands:favorites";
const SERVER_SNAPSHOT: string[] = [];

function readStoredFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

let cached: string[] | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): string[] {
  if (cached === null) cached = readStoredFavorites();
  return cached;
}

function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeFavorites(next: string[]) {
  cached = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  for (const listener of listeners) listener();
}

export function useFavorites() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const favorites = useMemo(() => new Set(stored), [stored]);

  const toggle = useCallback((id: string) => {
    const next = new Set(getSnapshot());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    writeFavorites([...next]);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  return { favorites, toggle, isFavorite, hydrated: stored !== SERVER_SNAPSHOT };
}
