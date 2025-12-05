import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store } from '../../../app.store';

interface Choix {
  raison: string;
}

@Component({
  selector: 'game1-step1',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './level2.html',
  styleUrl: '../../game_1.css'
})
export class Step2Component {

  choix: Choix[] = [
    {raison: 'Le prix est trop bas'},
    {raison: 'Mes capacités cognitives sont limités'},
    {raison: 'Je n\'en ai pas l\'utilité pour le moment'},
    {raison: 'Le service est trop avantageux'},
    {raison: 'Le service client ne répond plus'},
  ];

  isMenuOpen = signal(false);
  searchQuery = signal('');

   toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  constructor(private router: Router) {}

  goNext(): void {
    this.closeMenu();
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
   goToContact(): void {
    this.closeMenu();
    this.router.navigate(['amouzoun/contact']);
  }

    logout(): void {
    this.closeMenu();
    this.router.navigate(['']);
  }
}
