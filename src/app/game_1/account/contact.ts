import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../app.store';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact.html',
  styleUrls: ['../game_1.css']
})
export class ContactComponent {
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
