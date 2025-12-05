import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../../app.store';

@Component({
  selector: 'game1-step1',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './level1.html',
  styleUrls: ['../../game_1.css']
})
export class Step1Component {
  public store = store;
  public amouzounStore = amouzounStore;

  isMenuOpen = signal(false);
  searchQuery = this.amouzounStore.searchBarQuery;

   toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  constructor(private router: Router) {}

  goNext(): void {
    this.closeMenu();
    // go to step 2 (restore original behavior)
    this.router.navigate(['amouzoun/account/proume/unsubscribe/confirm/2']);
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
