import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../../app.store';
import { Step3Component } from '../step3/level3';

interface Choix {
  raison: string;
}

@Component({
  selector: 'game1-step1',
  standalone: true,
  imports: [CommonModule, RouterModule, Step3Component],
  templateUrl: './level2.html',
  styleUrls: ['../../game_1.css']
})
export class Step2Component {
  public store = store;
  public amouzounStore = amouzounStore;

  choix: Choix[] = [
    {raison: 'Le prix est trop bas'},
    {raison: 'Mes capacités cognitives sont limités'},
    {raison: 'Je n\'en ai pas l\'utilité pour le moment'},
    {raison: 'Le service est trop avantageux'},
    {raison: 'Le service client ne répond plus'},
  ];

  isMenuOpen = signal(false);
  isCaptchaOpen = signal(false);
  searchQuery = this.amouzounStore.searchBarQuery;

   toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  constructor(private router: Router) {}

  openCaptcha(): void {
    this.closeMenu();
    this.isCaptchaOpen.set(true);
  }

  onCaptchaSolved(): void {
    this.isCaptchaOpen.set(false);
    // proceed to final confirmation
    this.router.navigate(['amouzoun/account/proume/unsubscribe/confirm']);
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
