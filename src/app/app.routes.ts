import { Routes } from '@angular/router';
import { Game1Component } from './game_1/game_1';
import { HomePageComponent } from './home-page/home-page';
import { ContactComponent } from './game_1/account/contact';
import { AccountComponent } from './game_1/account/account';
import { SubscriptionContractComponent } from './game_1/subscription_contract/subscription_contract';
import { UnsubscribePageComponent } from './game_1/subscription_contract/unsubscribe_page';
// Ce fichier définie les routes de l'application, c'est a dire les differentes pages accessibles via un URL
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'amouzoun', component: Game1Component },
  { path: 'amouzoun/account', component: AccountComponent },
  { path: 'amouzoun/contact', component: ContactComponent },
  { path: 'amouzoun/account/subscription-contract', component: SubscriptionContractComponent },
  { path: 'amouzoun/account/unsubscribe-page', component: UnsubscribePageComponent },
  { path: '**', redirectTo: '' }
];
