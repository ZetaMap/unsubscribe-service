import { Routes } from '@angular/router';
import { Game1Component } from './game_1/game_1';
import { HomePageComponent } from './home/home';
import { ContactComponent } from './game_1/account/contact';
import { AccountComponent } from './game_1/account/account';
import { SubscriptionContractComponent } from './game_1/subscription_contract/subscription_contract';
import { UnsubscribePageComponent } from './game_1/subscription_contract/unsubscribe_page';
import { UnsubscriptionConfirmComponent } from './game_1/subscription_contract/unsubscription_confirmation';
import { Step1Component } from './game_1/steps/step1/level1';
import { Step2Component } from './game_1/steps/step2/level2';

// Ce fichier définie les routes de l'application, c'est a dire les differentes pages accessibles via un URL
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'amouzoun', component: Game1Component },
  { path: 'amouzoun/contact', component: ContactComponent },
  { path: 'amouzoun/account', component: AccountComponent },
  { path: 'amouzoun/account/proume', component: SubscriptionContractComponent },
  { path: 'amouzoun/account/proume/unsubscribe', component: UnsubscribePageComponent },
  { path: 'amouzoun/account/proume/unsubscribe/confirm', component: UnsubscriptionConfirmComponent },
  { path: 'amouzoun/account/proume/unsubscribe/confirm/1', component: Step1Component },
  { path: 'amouzoun/account/proume/unsubscribe/confirm/2', component: Step2Component },
  { path: '**', redirectTo: '' }
];
