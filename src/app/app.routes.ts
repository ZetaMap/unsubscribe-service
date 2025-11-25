import { Routes } from '@angular/router';
import { Game1Component } from './game_1/game_1';
import { HomePageComponent } from './home-page/home-page';
// Ce fichier définie les routes de l'application, c'est a dire les differentes pages accessibles via un URL
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'amouzoun', component: Game1Component },
  { path: '**', redirectTo: '' }
];
