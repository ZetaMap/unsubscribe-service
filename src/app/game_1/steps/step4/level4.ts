import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../../app.store';

interface Reponse {
  valeur: string | number;
}

@Component({
  selector: 'game1-step4',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './level4.html',
  styleUrls: ['../../game_1.css', './level4.css']
})
export class Step4Component {
  public store = store;
  public amouzounStore = amouzounStore;


    reponse: Reponse[] = [
      { valeur: 1860 },
      { valeur: 2720 },
      { valeur: 1980 },
      { valeur: 2870 },
      { valeur: 3010 },
      { valeur: 'Je ne sait pas' }
    ];

  isMenuOpen = signal(false);
  searchQuery = this.amouzounStore.searchBarQuery;
  isHelpOpen = signal(false);
  isFailurePopupOpen = signal(false);
    // selected option (radio box)
  selectedAnswer = signal<string | number | null>(null);
  isCorrect = signal<boolean | null>(null);
  errorMessage = '';
    readonly correctAnswer = 2870; // correct structured reply value per request
  // helper: if you want a separate options list, it's available via `reponse` above

  constructor(private router: Router) { }

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

  selectAnswer(value: string | number | null): void {
    this.selectedAnswer.set(value);
  }

  validateAnswer(): void {
    this.errorMessage = '';
    const val = this.selectedAnswer();
    if (val === null) { this.errorMessage = 'Veuillez sélectionner une option.'; this.isCorrect.set(false); return; }
    if (val === this.correctAnswer || (typeof val === 'string' && val === 'Je ne sait pas')) {
      this.isCorrect.set(true);
      // navigate or give feedback, for now show success alert and navigate back home
      setTimeout(() => {
        this.router.navigate(['amouzoun/account/proume/unsubscribe/confirm/5']);
      }, 750);
      // close help if visible
      this.isHelpOpen.set(false);
      // close failure popup if visible
      this.isFailurePopupOpen.set(false);
      return;
    }
    this.isCorrect.set(false);
    // show visible popup for failure
    this.isFailurePopupOpen.set(true);
    this.focusFailurePopup();
    setTimeout(() => {
        this.isFailurePopupOpen.set(false);
        this.router.navigate(['amouzoun/account/proume/']);
    }, 5000);
  }

  toggleHelp(): void { const opening = !this.isHelpOpen(); this.isHelpOpen.set(opening); if (opening) this.focusHelp(); }
  

    private focusFailurePopup(): void {
      setTimeout(() => {
        const el = document.getElementById('failurePopup');
        if (el) (el as HTMLElement).focus();
      }, 60);
    }
  
  private focusHelp(): void {
    setTimeout(() => {
      const el = document.getElementById('helpBox');
      if (el) (el as HTMLElement).focus();
    }, 60);
  }

  private focusValidateBtn(): void {
    setTimeout(() => {
      const el = document.getElementById('validateBtn');
      if (el) (el as HTMLElement).focus();
    }, 60);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: any): void {
    if (this.isHelpOpen()) {
      this.isHelpOpen.set(false);
    }
    if (this.isFailurePopupOpen()) {
      this.isFailurePopupOpen.set(false);
    }
  }
}
