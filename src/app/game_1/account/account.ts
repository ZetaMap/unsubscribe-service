import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store } from '../../app.store';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account_game_1.html',
  styleUrls: ['../game_1.css']
})
export class AccountComponent {
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

  navigateTo(page: string): void {
    switch(page) {
      case 'subscription':
        this.router.navigate(['amouzoun/account/proume']);
        break;
      case 'contact':
        this.router.navigate(['amouzoun/contact']);
        break;
    }
  }

    logout(): void {
    this.closeMenu();
    this.router.navigate(['']);
  }
}
