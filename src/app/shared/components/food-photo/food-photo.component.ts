import { Component, Input, OnChanges } from '@angular/core';
import { I18nService } from '@core/services';
import { menuImageManifest } from '../../menu-image-manifest';

@Component({
  selector: 'app-food-photo',
  template: `
    <div class="photo" [class.hero-photo]="hero">
      <img *ngIf="currentUrl && !failed" [src]="src" [attr.srcset]="srcset"
        [attr.sizes]="hero ? '(max-width: 768px) 100vw, 1440px' : '(max-width: 768px) 45vw, 560px'"
        [alt]="alt" [attr.loading]="priority ? 'eager' : 'lazy'"
        [attr.fetchpriority]="priority ? 'high' : 'auto'" decoding="async"
        width="960" height="640" (error)="failed = true">
      <span *ngIf="failed" class="photo-unavailable">{{ i18n.translate('photo_unavailable') }}</span>
      <button *ngIf="urls.length > 1 && !hero" type="button" class="next-photo"
        (click)="next()" [attr.aria-label]="i18n.translate('next_photo') + ': ' + alt">
        <span aria-hidden="true">{{ index + 1 }}/{{ urls.length }} ↻</span>
      </button>
    </div>
  `,
  styles: [`
    :host { display:block; min-width:0; height:100%; }
    .photo { height:100%; position:relative; background:#f7f5f1; overflow:hidden; }
    img { display:block; width:100%; height:100%; object-fit:contain; }
    .hero-photo img { object-fit:contain; object-position:center; }
    .next-photo { position:absolute; right:6px; bottom:6px; min-width:44px; min-height:44px; padding:6px 10px; background:#251d23; color:#fff; border:1px solid #b9b3ac; border-radius:999px; font-size:.8rem; }
    .photo-unavailable { display:grid; place-items:center; height:100%; padding:1rem; color:#49383d; font-size:.85rem; }
  `]
})
export class FoodPhotoComponent implements OnChanges {
  @Input() urls: string[] = [];
  @Input() alt = '';
  @Input() priority = false;
  @Input() hero = false;
  index = 0;
  failed = false;
  constructor(public i18n: I18nService) {}
  ngOnChanges(): void { this.index = 0; this.failed = false; }
  get currentUrl(): string { return this.urls[this.index] || ''; }
  get variants(): Record<number, string> | undefined { return menuImageManifest[this.currentUrl]; }
  get src(): string { return this.variants?.[960] || Object.values(this.variants || {}).at(-1) || this.currentUrl; }
  get srcset(): string | null {
    return this.variants ? Object.entries(this.variants).map(([width, url]) => `${url} ${width}w`).join(', ') : null;
  }
  next(): void { this.index = (this.index + 1) % this.urls.length; this.failed = false; }
}
