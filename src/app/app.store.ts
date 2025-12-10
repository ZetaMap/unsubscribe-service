import { signal } from '@angular/core';

export const STORE_COOKIE_NAME = 'unsubscribeStore';

export interface PersistedStore {
  username?: string;
  password?: string;
  avatarUrl?: string;
  gameCheck?: {
    amouzoun?: boolean;
  };
  amouzounStore?: {
    searchBarQuery?: string;
  };
}

function readStoreFromCookie(): PersistedStore {
  if (typeof document === 'undefined') {
    return {};
  }
  const cookies = document.cookie.split(';').map(c => c.trim());
  const prefix = STORE_COOKIE_NAME + '=';
  const raw = cookies.find(c => c.startsWith(prefix));
  if (!raw) {
    return {};
  }
  try {
    const value = decodeURIComponent(raw.substring(prefix.length));
    return JSON.parse(value) as PersistedStore;
  } catch {
    return {};
  }
}

const persisted = readStoreFromCookie();

export const store = {
  username: signal(persisted.username ?? ''),
  password: signal(persisted.password ?? ''),
  avatarUrl: signal(persisted.avatarUrl ?? '')
};

export const gameCheck = {
  amouzoun: signal(persisted.gameCheck?.amouzoun ?? false)
};

export const amouzounStore = {
  searchBarQuery: signal(persisted.amouzounStore?.searchBarQuery ?? '')
};
