import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../app.store';

@Component({
  selector: 'app-subscription-contract',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subscription_contract.html',
  styleUrls: ['../game_1.css']
})
export class SubscriptionContractComponent {
  public store = store;
  public amouzounStore = amouzounStore;

  isMenuOpen = signal(false);
  isManageDropdownOpen = signal(false);
  searchQuery = this.amouzounStore.searchBarQuery;

   toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  toggleManageDropdown(): void {
    this.isManageDropdownOpen.set(!this.isManageDropdownOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  closeManageDropdown(): void {
    this.isManageDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const card = target.closest('.card');
    if (!card) {
      this.closeManageDropdown();
    }
  }

  constructor(private router: Router) {}

  goToUnsubscribe(): void {
    this.closeMenu();
    this.router.navigate(['amouzoun/account/proume/unsubscribe']);
  }

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
}
