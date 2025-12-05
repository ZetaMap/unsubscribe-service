import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../app.store';

@Component({
  selector: 'app-unsubscription-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './unsubscription_confirmation.html',
  styleUrls: ['../game_1.css']
})
export class UnsubscriptionConfirmComponent {
  public store = store;
  public amouzounStore = amouzounStore;

  // signal pour la radio button
  public unsubscribeWhen = signal<'now'|'renewal'>('renewal');

  isMenuOpen = signal(false);
  // Replace component-local searchQuery with centralized searchBarQuery signal
  searchQuery = this.amouzounStore.searchBarQuery;

   toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  constructor(private router: Router) {}

  goToHome(): void {
    this.closeMenu();
    this.router.navigate(['amouzoun']);
  }

  goToAccount(): void {
    this.closeMenu();
    this.router.navigate(['amouzoun/account']);
  }

    logout(): void {
    this.closeMenu();
    this.router.navigate(['']);
  }

  goToStep1(): void {
    this.router.navigate(['amouzoun/account/proume/unsubscribe/confirm/1']);
  }

// change le texte en fonction du choix de l'utilisateur sur la radio button
  public warningText(): string {
    return this.unsubscribeWhen() === 'now'
      ? `Important — L'abonnement prend fin immédiatement et ne sera pas remboursé.`
      : `Important — L'abonnement prendra fin le 15 décembre 2025 et ne sera pas remboursé.`;
  }
}
