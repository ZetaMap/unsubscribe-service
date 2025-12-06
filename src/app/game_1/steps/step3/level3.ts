import { Component, signal, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../../app.store';

interface CaptchaImage { id: number; src: string; label: string }

@Component({
  selector: 'game1-step3',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './level3.html',
  styleUrls: ['./level3.css']
})
export class Step3Component {
  @Input() modal: boolean = false;
  @Output() solved = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();
  public store = store;
  public amouzounStore = amouzounStore;

  isMenuOpen = signal(false);
  searchQuery = this.amouzounStore.searchBarQuery;

  // internal captcha state
  gridImages: CaptchaImage[] = [];
  selectedIds = new Set<number>();
  targetLabel = '';
  errorMessage = '';
  isSpeaking = signal(false);
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  isLoading = signal(false);

  private pool: CaptchaImage[] = [
    { id: 1, src: 'game_1/planche.jpg', label: 'planche' },
    { id: 2, src: 'game_1/chargeur_taille_crayon.jpg', label: 'chargeur' },
    { id: 3, src: 'game_1/lave_vaisselle.jpg', label: 'lave-vaisselle' },
    { id: 4, src: 'game_1/pvc.jpg', label: 'tuyau pvc' },
    { id: 5, src: 'game_1/spaghetti.jpg', label: 'spaghetti bolognaise' },
    { id: 6, src: 'game_1/lune.jpg', label: 'lune' }
  ];

  constructor(private router: Router) {
    this.prepareGrid();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (this.modal) {
      this.canceled.emit();
    }
  }

  toggleMenu(): void { 
    this.isMenuOpen.set(!this.isMenuOpen()); 
  }
  
  closeMenu(): void { 
    this.isMenuOpen.set(false); 
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


  private randomInt(max: number) { return Math.floor(Math.random() * max); }

  //selectionne les images aleatoirement du captcha 
  private prepareGrid(): void {
    const grid: CaptchaImage[] = [];
    const target = this.pool[this.randomInt(this.pool.length)].label;
    this.targetLabel = target;
    const targetImages = this.pool.filter(p => p.label === target);

    for (let i = 0; i < 2; i++) {
      const base = targetImages[this.randomInt(targetImages.length)];
      grid.push({ ...base, id: Date.now() + this.randomInt(9999) + i });
    }

    while (grid.length < 9) {
      const pick = this.pool[this.randomInt(this.pool.length)];
      grid.push({ ...pick, id: Date.now() + this.randomInt(9999) + grid.length });
    }

    for (let i = grid.length - 1; i > 0; i--) {
      const j = this.randomInt(i + 1);
      [grid[i], grid[j]] = [grid[j], grid[i]];
    }

    this.gridImages = grid;
  }

  toggleSelect(id: number): void {
    if (this.selectedIds.has(id)) this.selectedIds.delete(id);
    else this.selectedIds.add(id);
  }

  handleKey(event: KeyboardEvent, id: number): void {
    const key = event.key;
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.toggleSelect(id);
    }
  }

  verifyCaptcha(): void {
    if (this.isLoading()) return; // permet d'éviter les multiples clics sur le bouton
    this.errorMessage = '';
    this.isLoading.set(true);
    // simulation de chargement pour le captcha avec vérification
    setTimeout(() => {
    const expectedIds = new Set(this.gridImages.filter(g => g.label === this.targetLabel).map(g => g.id));
    const selected = new Set(this.selectedIds);
    if (expectedIds.size === 0) {
      this.errorMessage = 'Erreur interne, réessayez.';
      this.isLoading.set(false);
      return;
    }

    if (expectedIds.size !== selected.size) {
      this.errorMessage = 'Sélection incorrecte, veuillez essayer à nouveau.';
      this.isLoading.set(false);
      return;
    }

    for (const id of expectedIds) {
      if (!selected.has(id)) {
        this.errorMessage = 'Sélection incorrecte, veuillez essayer à nouveau.';
        this.isLoading.set(false);
        return;
      }
    }

    this.errorMessage = '';
    if (this.modal) {
      this.isLoading.set(false);
      this.solved.emit();
      return;
    }
    this.isLoading.set(false);
    this.router.navigate(['amouzoun/account/proume/unsubscribe/confirm/2']);
    }, 1500);
  }

  shuffleGrid(): void { this.selectedIds.clear(); this.prepareGrid(); }

  // synthese vocale pour le captcha
  toggleSpeak(): void {
    if (!('speechSynthesis' in window)) {
      this.errorMessage = 'Synthèse vocale non disponible dans ce navigateur.';
      return;
    }
    if (this.isSpeaking()) {
      window.speechSynthesis.cancel();
      this.isSpeaking.set(false);
      return;
    }
    const text = `Sélectionnez toutes les images contenant ${this.targetLabel}`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    utter.onend = () => { this.isSpeaking.set(false); };
    utter.onerror = () => { this.isSpeaking.set(false); };
    this.currentUtterance = utter;
    window.speechSynthesis.speak(utter);
    this.isSpeaking.set(true);
  }
}
