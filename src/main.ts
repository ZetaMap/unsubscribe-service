import { bootstrapApplication } from '@angular/platform-browser';
import { runInInjectionContext, effect } from '@angular/core';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { STORE_COOKIE_NAME, PersistedStore, store, gameCheck, amouzounStore } from './app/app.store';

bootstrapApplication(App, appConfig)
  .then(appRef => {
    runInInjectionContext(appRef.injector, () => {
      effect(() => {
        if (typeof document === 'undefined') {
          return;
        }
        const data: PersistedStore = {
          username: store.username(),
          password: store.password(),
          avatarUrl: store.avatarUrl(),
          gameCheck: {
            amouzoun: gameCheck.amouzoun()
          },
          amouzounStore: {
            searchBarQuery: amouzounStore.searchBarQuery()
          }
        };
        const encoded = encodeURIComponent(JSON.stringify(data));
        document.cookie = `${STORE_COOKIE_NAME}=${encoded}; path=/; max-age=31536000`;
      });
    });
  })
  .catch((err) => console.error(err));
