import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../app.store';

@Component({
  selector: 'game1-end',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './end.html',
  styleUrls: ['../game_1.css', './end.css']
})
export class EndComponent {
  public store = store;
  public amouzounStore = amouzounStore;

  isMenuOpen = signal(false);
  searchQuery = this.amouzounStore.searchBarQuery;
  isBouncing = signal(false);
  private animId: number | null = null;
  private vx = 0;
  private vy = 0;
  private x = 0;
  private y = 0;
  private btnWidth = 0;
  private btnHeight = 0;
  private keepAnimating = true;
  isProcessing = signal(false);
  isProcessed = signal(false);

   toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  constructor(private router: Router) {}

  goToGameMenu(): void {
    this.closeMenu();
    this.router.navigate(['']);
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

    onConfirmClick(): void {
      const el = document.getElementById('confirmBtn');
      if (!el) return;
      if (this.isProcessing() || this.isProcessed()) return;
      if (!this.isBouncing()) {
        // start bouncing: compute size, position and random velocity
        const rect = el.getBoundingClientRect();
        this.btnWidth = rect.width;
        this.btnHeight = rect.height;
        // lock the width/height so the element stays the same while we make it fixed
        el.style.width = `${this.btnWidth}px`;
        el.style.height = `${this.btnHeight}px`;
        this.x = rect.left;
        this.y = rect.top;
        // small random speed
        this.vx = (Math.random() * 6 + 3) * (Math.random() > 0.5 ? 1 : -1);
        this.vy = (Math.random() * 6 + 3) * (Math.random() > 0.5 ? 1 : -1);
        this.isBouncing.set(true);
        // ensure we switch to fixed so we can animate via left/top
        el.style.position = 'fixed';
        el.style.zIndex = '9999';
        el.style.left = `${this.x}px`;
        el.style.top = `${this.y}px`;
        this.keepAnimating = true;
        this.animLoop();
      } else {
        // stop bouncing and show processing overlay
        this.stopBouncing();
        this.isProcessing.set(true);
        // simulate processing with timeout, then show processed message
        setTimeout(() => {
          this.isProcessing.set(false);
          this.isProcessed.set(true);
          this.focusProcessed();
        }, 1400);
      }
    }

    private animLoop(): void {
      const el = document.getElementById('confirmBtn');
      if (!el) return;
      if (!this.keepAnimating) return;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      this.x += this.vx;
      this.y += this.vy;
      // bounds
      if (this.x <= 0) { this.x = 0; this.vx = -this.vx; }
      if (this.y <= 0) { this.y = 0; this.vy = -this.vy; }
      if (this.x + this.btnWidth >= winW) { this.x = winW - this.btnWidth; this.vx = -this.vx; }
      if (this.y + this.btnHeight >= winH) { this.y = winH - this.btnHeight; this.vy = -this.vy; }
      el.style.left = `${this.x}px`;
      el.style.top = `${this.y}px`;
      // small visual wobble
      el.style.transform = `translateZ(0)`;
      this.animId = requestAnimationFrame(() => this.animLoop());
    }

    private stopBouncing(): void {
      this.keepAnimating = false;
      this.isBouncing.set(false);
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      // reset inline styles so the button returns to normal layout
      const el = document.getElementById('confirmBtn');
      if (el) {
        el.style.left = '';
        el.style.top = '';
        el.style.position = '';
        el.style.zIndex = '';
        el.style.transform = '';
        el.style.width = '';
        el.style.height = '';
      }
    }

    private focusProcessed(): void {
      setTimeout(() => {
        const el = document.getElementById('processedPopup');
        if (el) (el as HTMLElement).focus();
      }, 60);
    }

    closeProcessedAndGoHome(): void {
      this.isProcessed.set(false);
      this.amouzounStore.gameFinished.set(true);
      this.goToGameMenu();
    }
}
