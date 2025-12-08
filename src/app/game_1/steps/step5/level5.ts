import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { store, amouzounStore } from '../../../app.store';

@Component({
  selector: 'game1-step5',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './level5.html',
  styleUrls: [ './level5.css', '../../game_1.css']
})
export class Step5Component {
  public store = store;
  public amouzounStore = amouzounStore;

  isMenuOpen = signal(false);
  searchQuery = this.amouzounStore.searchBarQuery;

   toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  constructor(private router: Router) {}

  goNext(): void {
    this.closeMenu();
    // go to step 2 (restore original behavior)
    this.router.navigate(['amouzoun/account/proume/unsubscribe/confirm/send']);
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
  
  // Ou est Charlie (Jeff Bezos) logic
  zoom = 4;
  lensRadius = 120;
  isLensVisible = signal(false);
  lensX = 0;
  lensY = 0;
  imgNaturalW = 0;
  imgNaturalH = 0;
  imgDisplayW = 0;
  imgDisplayH = 0;
  // Bezos region in percentages relative to displayed image (tweakable)
  // Example values; adjust if needed based on actual image layout
  bezosRegion = { xPct: 0.62, yPct: 0.28, wPct: 0.06, hPct: 0.10 };
  // Popup
  isConfirmOpen = signal(false);

  onImageLoad(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    this.imgNaturalW = img.naturalWidth;
    this.imgNaturalH = img.naturalHeight;
    const rect = img.getBoundingClientRect();
    this.imgDisplayW = rect.width;
    this.imgDisplayH = rect.height;
  }

  showLens(): void { this.isLensVisible.set(true); }
  hideLens(): void { this.isLensVisible.set(false); }

  onMouseMove(ev: MouseEvent): void {
    const img = document.getElementById('bezosImg');
    if (!img) return;
    const rect = img.getBoundingClientRect();
    this.imgDisplayW = rect.width;
    this.imgDisplayH = rect.height;
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    // clamp inside image
    const cx = Math.max(0, Math.min(x, rect.width));
    const cy = Math.max(0, Math.min(y, rect.height));
    this.lensX = cx;
    this.lensY = cy;
  }

  get backgroundSize(): string {
    // background image scaled by zoom relative to displayed size
    const bw = this.imgDisplayW * this.zoom;
    const bh = this.imgDisplayH * this.zoom;
    return `${bw}px ${bh}px`;
  }

  get backgroundPosition(): string {
    // position so that the point under the cursor appears centered in the lens
    const bx = -(this.lensX * this.zoom - this.lensRadius);
    const by = -(this.lensY * this.zoom - this.lensRadius);
    return `${bx}px ${by}px`;
  }

  onLensClick(): void {
    // Determine if lens center is within Bezos region
    const rx = this.imgDisplayW * this.bezosRegion.xPct;
    const ry = this.imgDisplayH * this.bezosRegion.yPct;
    const rw = this.imgDisplayW * this.bezosRegion.wPct;
    const rh = this.imgDisplayH * this.bezosRegion.hPct;
    const lx = this.lensX;
    const ly = this.lensY;
    const inside = lx >= rx && lx <= rx + rw && ly >= ry && ly <= ry + rh;
    if (inside) {
      this.isConfirmOpen.set(true);
    }
  }

  closeConfirm(): void { this.isConfirmOpen.set(false); }
  confirmAndContinue(): void { this.isConfirmOpen.set(false); this.goNext(); }
}
