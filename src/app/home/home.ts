import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { store, gameCheck } from '../app.store';

interface Game {
  id: number;
  name: string;
  url: string;
  checked: boolean;
  isImplemented: boolean;
  prix: number;
  typePrix?: 'weekly' | 'monthly' | 'yearly';  
}

// Composant pour la page d'accueil de l'application
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomePageComponent implements OnInit {
  constructor(private http: HttpClient) {}

  public store = store;
  public isChecked = gameCheck;
  protected readonly title = signal('unsubscribe-service');

  // État pour le choix du pseudo
  isUsernameModalOpen = false;
  usernameInput = '';
  passwordInput = '';

    // État pour le popup "jeu non disponible"
    notImplementedModalOpen = false;
    notImplementedGameName = '';

  rows: Game[] = [
    { id: 1, name: 'Amouzoun Proume',  url: '/amouzoun', checked: this.isChecked.amouzoun(), isImplemented: true, prix: 24.99, typePrix: 'monthly' },
    { id: 2, name: 'Foundher Premioum',   url: '', checked: false, isImplemented: false, prix: 79.85, typePrix: 'monthly' },
    { id: 3, name: 'ForteKnight Club',  url: '', checked: false, isImplemented: false, prix: 14.98, typePrix: 'weekly' },
    { id: 4, name: 'DOZN Ligue 1.1', url: '', checked: false, isImplemented: false, prix: 64.99, typePrix: 'monthly' },
    { id: 5, name: 'MacDonold Plousse',    url: '', checked: false, isImplemented: false, prix: 12.99, typePrix: 'monthly' },
    { id: 6, name: 'Gogole One',  url: '', checked: false, isImplemented: false, prix: 184.89, typePrix: 'yearly' },
    { id: 7, name: 'Netflouxe',  url: '', checked: false, isImplemented: false, prix: 24.98, typePrix: 'monthly' },

  ];

  pageSize = 4;
  currentPage = 1;

  ngOnInit(): void {
    // Le popup de pseudo sera ouvert via le menu "Mon compte"
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.rows.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedRows(): Game[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  get totalPrice(): number {
    return this.rows
      .filter(row => !row.checked)
      .reduce((sum, row) => sum + this.getPricePerMonth(row), 0);
  }

  get totalYear(): number {
    return this.rows
      .filter(row => !row.checked)
      .reduce((sum, row) => sum + this.getPricePerYear(row), 0);
  }

  get isConnected(): boolean {
    return this.store.username().trim() !== '';
  }

  get passwordErrorMessage(): string | null {
    const password = this.passwordInput;
    if (!password) {
      return 'Le mot de passe est requis.';
    }
    if (password.length <= 8) {
      return 'Le mot de passe doit contenir plus de 8 caractères.';
    }
    return null;
  }

  // Prix convertis en équivalent mensuel
  getPricePerMonth(row: Game): number {
    switch (row.typePrix) {
      case 'weekly':
        // 52 semaines par an, ramené au mois
        return (row.prix * 52) / 12;
      case 'yearly':
        return row.prix / 12;
      case 'monthly':
      default:
        return row.prix;
    }
  }

  // Prix convertis en équivalent annuel
  getPricePerYear(row: Game): number {
    switch (row.typePrix) {
      case 'weekly':
        return row.prix * 52;
      case 'yearly':
        return row.prix;
      case 'monthly':
      default:
        return row.prix * 12;
    }
  }

  // Libellé à afficher sur la carte (/ mois, / semaine, / an)
  getPriceUnitLabel(row: Game): string {
    switch (row.typePrix) {
      case 'weekly':
        return '/ semaine';
      case 'yearly':
        return '/ an';
      case 'monthly':
      default:
        return '/ mois';
    }
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  confirmUsername(): void {
    const value = this.usernameInput.trim();
    const password = this.passwordInput;

    if (!value) {
      return;
    }
    if (!password || password.length <= 8) {
      return;
    }
    this.store.username.set(value);
    this.store.password.set(password);
    this.fetchAvatarFromGravatar(value);
    this.isUsernameModalOpen = false;
  }

  private fetchAvatarFromGravatar(username: string): void {
    const url = `https://api.gravatar.com/v3/profiles/${encodeURIComponent(username)}`;
    this.http.get<{ avatar_url?: string }>(url).subscribe({
      next: (profile) => {
        if (profile && profile.avatar_url) {
          this.store.avatarUrl.set(profile.avatar_url);
        } else {
          this.setFallbackAvatar(username);
        }
      },
      error: () => {
        this.setFallbackAvatar(username);
      }
    });
  }

  private setFallbackAvatar(username: string): void {
    const avatar =
      'https://api.dicebear.com/9.x/identicon/svg?seed=' +
      encodeURIComponent(username.toLowerCase());
    this.store.avatarUrl.set(avatar);
  }

  openAccountModalFromMenu(): void {
    this.usernameInput = this.store.username();
    this.passwordInput = this.store.password();
    this.isUsernameModalOpen = true;
  }

  logout(): void {
    this.store.username.set('');
    this.store.password.set('');
    this.store.avatarUrl.set('');
    this.usernameInput = '';
    this.passwordInput = '';
  }

  showGameNotAvailable(row: Game): void {
    this.notImplementedGameName = row.name;
    this.notImplementedModalOpen = true;
  }

  closeNotImplementedModal(): void {
    this.notImplementedModalOpen = false;
  }
}
