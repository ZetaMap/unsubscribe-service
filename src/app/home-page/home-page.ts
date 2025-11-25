import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Composant pour la page d'accueil de l'application
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: '../app.html',
  styleUrl: '../app.css'
})
export class HomePageComponent {
  protected readonly title = signal('unsubscribe-service');
}
