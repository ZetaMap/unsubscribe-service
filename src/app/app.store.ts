import { signal } from '@angular/core';

export const store = {
  username: signal('l0rdShr3k')
};

export const amouzounStore = {
  gameFinished: signal(false),
  searchBarQuery: signal('')
};