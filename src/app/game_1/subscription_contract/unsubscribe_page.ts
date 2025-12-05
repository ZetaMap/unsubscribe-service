import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store } from '../../app.store';

@Component({
  selector: 'app-unsubscribe-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './unsubscribe_page.html',
  styleUrls: ['../game_1.css']
})
export class UnsubscribePageComponent {
  public store = store;

  isMenuOpen = signal(false);
  searchQuery = signal('');

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

  confirmUnsubscribe(): void {
    this.closeMenu();
    this.router.navigate(['amouzoun/account/proume/unsubscribe/confirm']);
  }

    logout(): void {
    this.closeMenu();
    this.router.navigate(['']);
  }
}
