import { Component } from '@angular/core';
import { I18nService, SupportedLanguage } from '@core/services';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="language-switcher">
      <button 
        class="language-btn"
        [class.active]="(i18n.currentLanguage$ | async) === 'en'"
        (click)="setLanguage('en')"
        [attr.aria-label]="'Switch to English'"
        [attr.aria-pressed]="(i18n.currentLanguage$ | async) === 'en'">
        EN
      </button>
      <button 
        class="language-btn"
        [class.active]="(i18n.currentLanguage$ | async) === 'fi'"
        (click)="setLanguage('fi')"
        [attr.aria-label]="'Vaihda suomeksi'"
        [attr.aria-pressed]="(i18n.currentLanguage$ | async) === 'fi'">
        FI
      </button>
    </div>
  `,
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent {

  constructor(public i18n: I18nService) {}

  setLanguage(language: SupportedLanguage): void {
    this.i18n.setLanguage(language);
  }
}