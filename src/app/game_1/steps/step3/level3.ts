import { Component, signal, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../../app.store';

interface CaptchaImage { id: number; src: string; label: string; title?: string }
interface CaptchaMalcolm { id: number; src: string; isCasting: boolean }

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
  isSecondStage = false;

  // Images "cibles" : peuvent être demandées (Planche, Avion, etc.)
  private pool: CaptchaImage[] = [
    { id: 1, src: 'game_1/planche.jpg', label: 'Planche' },
    { id: 2, src: 'game_1/captcha/planche1.jpg', label: 'Planche' },
    { id: 3, src: 'game_1/captcha/planche2.jpg', label: 'Planche' },
    { id: 4, src: 'game_1/captcha/planche3.jpg', label: 'Planche' },
    { id: 5, src: 'game_1/captcha/lave-Vaisselle2.jpg', label: 'Lave-vaisselle' },
    { id: 6, src: 'game_1/captcha/lve-vaisselle3.jpg', label: 'Lave-vaisselle' },
    { id: 7, src: 'game_1/captcha/tuyau2.jpg', label: 'Tuyau pvc' },
    { id: 8, src: 'game_1/captcha/spaghetti2.jpg', label: 'Spaghetti bolognaise' },
    { id: 9, src: 'game_1/captcha/spaghetti3.jpg', label: 'Spaghetti bolognaise' },
    { id: 10, src: 'game_1/captcha/spaghetti4.jpg', label: 'Spaghetti bolognaise' },
    { id: 11, src: 'game_1/captcha/lune1.jpg', label: 'Lune' },
    { id: 12, src: 'game_1/captcha/lune2.jpg', label: 'Lune' },
    { id: 13, src: 'game_1/captcha/lune3.jpg', label: 'Lune' },
    { id: 14, src: 'game_1/captcha/alcool.png', label: 'Alcool' },
    { id: 15, src: 'game_1/captcha/alcool2.jpg', label: 'Alcool' },
    { id: 16, src: 'game_1/captcha/alcool3.jpg', label: 'Alcool' },
    { id: 17, src: 'game_1/captcha/alcool4.jpg', label: 'Alcool' },
    { id: 18, src: 'game_1/captcha/alcool5.jpg', label: 'Alcool' },
    { id: 19, src: 'game_1/captcha/avion.jpeg', label: 'Avion' },
    { id: 20, src: 'game_1/captcha/avion2.jpg', label: 'Avion' },
    { id: 21, src: 'game_1/captcha/avion3.jpg', label: 'Avion' },
    { id: 22, src: 'game_1/captcha/avion4.jpg', label: 'Avion' },
    { id: 23, src: 'game_1/captcha/avion5.jpg', label: 'Avion' },
    { id: 24, src: 'game_1/captcha/pain1.jpeg', label: 'Pain' },
    { id: 25, src: 'game_1/captcha/pain2.jpg', label: 'Pain' },
    { id: 26, src: 'game_1/captcha/pain3.jpg', label: 'Pain' },
    { id: 27, src: 'game_1/captcha/pain4.jpg', label: 'Pain' },
    { id: 28, src: 'game_1/captcha/pain5.jpg', label: 'Pain' },
    { id: 29, src: 'game_1/captcha/pain6.jpg', label: 'Pain' },
    { id: 30, src: 'game_1/captcha/chargeur2.jpg', label: 'Chargeur' },
    { id: 31, src: 'game_1/captcha/chargeur3.jpg', label: 'Chargeur' },
    { id: 32, src: 'game_1/captcha/chargeur4.jpg', label: 'Chargeur' },
  ];

  // Images de remplissage : jamais la cible à sélectionner
  private fillerPool: CaptchaImage[] = [
    { id: 1001, src: 'game_1/captcha/remplissage/remplissage1.jpg', label: '__remplissage__', title: 'Image de remplissage' },
    { id: 1002, src: 'game_1/captcha/remplissage/remplissage2.jpg', label: '__remplissage__', title: 'Image de remplissage' },
    { id: 1003, src: 'game_1/captcha/remplissage/remplissage3.jpg', label: '__remplissage__', title: 'Image de remplissage' },
    { id: 1004, src: 'game_1/captcha/remplissage/remplissage4.jpg', label: '__remplissage__', title: 'Image de remplissage' },
    { id: 1005, src: 'game_1/captcha/remplissage/remplissage5.jpg', label: '__remplissage__', title: 'Image de remplissage' },
    { id: 1006, src: 'game_1/captcha/remplissage/remplissage6.jpg', label: '__remplissage__', title: 'Image de remplissage' },
    { id: 1007, src: 'game_1/captcha/remplissage/remplissage7.jpg', label: '__remplissage__', title: 'Image de remplissage' },
    { id: 1008, src: 'game_1/captcha/remplissage/remplissage8.jpg', label: '__remplissage__', title: 'Image de remplissage' },
    { id: 1009, src: 'game_1/captcha/remplissage/remplissage9.jpg', label: '__remplissage__', title: 'Image de remplissage' },
    { id: 1010, src: 'game_1/captcha/remplissage/remplissage10.jpg', label: '__remplissage__', title: 'Image de remplissage' },
  ];

    private C: CaptchaMalcolm[] = [
    { id: 1, src: 'game_1/casting/Bailey.jpeg', isCasting: false },
    { id: 2, src: 'game_1/casting/Berfield.jpeg', isCasting: true },
    { id: 3, src: 'game_1/casting/Christensen.jpeg', isCasting: false },
    { id: 4, src: 'game_1/casting/Cranston.jpeg', isCasting: true },
    { id: 5, src: 'game_1/casting/Evans.jpeg', isCasting: false },
    { id: 6, src: 'game_1/casting/Jabba.jpeg', isCasting: false },
    { id: 7, src: 'game_1/casting/JeffBezos.jpeg', isCasting: false },
    { id: 8, src: 'game_1/casting/Kaczmarek.jpeg', isCasting: true },
    { id: 9, src: 'game_1/casting/Muniz.jpeg', isCasting: true },
    { id: 10, src: 'game_1/casting/okay.jpg', isCasting: false },
    { id: 11, src: 'game_1/casting/Reynolds.jpeg', isCasting: false },
    { id: 12, src: 'game_1/casting/Sullivan.jpeg', isCasting: true },
    { id: 13, src: 'game_1/casting/Johnson.jpeg', isCasting: false },
    { id: 14, src: 'game_1/casting/Theron.jpeg', isCasting: false },
    { id: 15, src: 'game_1/casting/Khalifa.jpg', isCasting: false }
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

    // On choisit la cible uniquement parmi les vraies images (pas le remplissage)
    const target = this.pool[this.randomInt(this.pool.length)].label;
    this.targetLabel = target;
    const targetImages = this.pool.filter(p => p.label === target);

    for (let i = 0; i < 2; i++) {
      const base = targetImages[this.randomInt(targetImages.length)];
      grid.push({ ...base, id: Date.now() + this.randomInt(9999) + i, title: base.label });
    }

    while (grid.length < 15) {
      // Mélange entre vraies images et images de remplissage
      const useFiller = this.fillerPool.length > 0 && Math.random() < 0.5;
      const source = useFiller ? this.fillerPool : this.pool;
      const pick = source[this.randomInt(source.length)];
      grid.push({ ...pick, id: Date.now() + this.randomInt(9999) + grid.length, title: pick.title ?? pick.label });
    }

    for (let i = grid.length - 1; i > 0; i--) {
      const j = this.randomInt(i + 1);
      [grid[i], grid[j]] = [grid[j], grid[i]];
    }

    this.gridImages = grid;
  }

  private prepareMalcolmGrid(): void {
    const grid: CaptchaImage[] = [];
    this.targetLabel = 'Casting de Malcolm';
    // Shuffle the Malcolm casting list to randomize order
    const shuffled = [...this.C];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffled.forEach((c, idx) => {
      const selectionLabel = c.isCasting ? 'Casting de Malcolm' : 'other';
      const actorName = this.extractActorName(c.src);
      grid.push({ id: Date.now() + idx, src: c.src, label: selectionLabel, title: actorName });
    });
    this.gridImages = grid;
  }

  private extractActorName(path: string): string {
    const parts = path.split('/');
    const file = parts[parts.length - 1];
    const nameWithExt = file.replace(/\.[^.]+$/, '');
    return nameWithExt;
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
    // if first stage passed, switch to Malcolm captcha on same page
    if (!this.isSecondStage) {
      this.selectedIds.clear();
      this.prepareMalcolmGrid();
      this.isSecondStage = true;
      this.isLoading.set(false);
      return;
    }
    // second stage passed
    if (this.modal) {
      this.isLoading.set(false);
      this.solved.emit();
      return;
    }
    this.isLoading.set(false);
    this.router.navigate(['amouzoun/account/proume/unsubscribe/confirm/2']);
    }, 1500);
  }

  shuffleGrid(): void {
    if (this.isSecondStage) {
      this.selectedIds.clear();
      this.prepareMalcolmGrid();
      return;
    }
    this.selectedIds.clear();
    this.prepareGrid();
  }

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