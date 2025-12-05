import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store } from '../../app.store';

@Component({
  selector: 'app-unsubscription-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './unsubscription_confirmation.html',
  styleUrl: '../game_1.css'
})
export class UnsubscriptionConfirmComponent {

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

  goToContact(): void {
    this.closeMenu();
    this.router.navigate(['amouzoun/contact']);
  }

    logout(): void {
    this.closeMenu();
    this.router.navigate(['']);
  }

  goToStep1(): void {
    this.router.navigate(['amouzoun/account/proume/unsubscribe/confirm/1']);
  }
}
