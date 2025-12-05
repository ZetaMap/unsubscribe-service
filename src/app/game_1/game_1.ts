import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { store } from '../app.store';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image?: string;
}

@Component({
  selector: 'app-game-1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game_1.html',
  styleUrls: ['./game_1.css']
})
export class Game1Component {
  // expose the global store so the template can read signals like `store.username()`
  public store = store;
  isMenuOpen = signal(false);
  searchQuery = signal('');

  products: Product[] = [
    { id: 1, name: 'Planche de sapin', description: 'Belle planche en sapin 20m par 0.5m', price: 39.99, rating: 5, reviews: 245, image: 'game_1/planche.jpg' },
    { id: 2, name: 'Chargeur de taille crayon', description: 'Chargeur de taille crayon electrique de 2A pour taille crayon', price: 24.99, rating: 4, reviews: 128, image: 'game_1/chargeur_taille_crayon.jpg' },
    { id: 3, name: 'Lave-vaisselle', description: 'Gros lave-vaisselle avec une capacité de 8 assiettes et emplacement couverts', price: 1405.99, rating: 5, reviews: 89, image: 'game_1/lave_vaisselle.jpg' },
    { id: 4, name: 'Tuyau pvc', description: 'Un gros tuyau en pvc souple étanche à l\'eau, pour toute goutière', price: 54.99, rating: 3, reviews: 45, image: 'game_1/pvc.jpg' },
    { id: 5, name: 'Spaghetti bolognaise', description: 'Spaghetti Al Dente avec sa sauce bolognaise au boeuf de saison', price: 5.99, rating: 5, reviews: 156, image: 'game_1/spaghetti.jpg' },
    { id: 6, name: 'La Lune', description: 'La lune, capturée ce lundi, avec une pointe de sel', price: 220054864879541.99, rating: 2, reviews: 73, image: 'game_1/lune.jpg' }
  ];

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

  getStarDisplay(rating: number): string {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return fullStars + emptyStars;
  }
}
