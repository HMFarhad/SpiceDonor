import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuData } from '@core/models';
import { MenuDataService, I18nService } from '@core/services';

@Component({
  selector: 'app-header',
  template: `
    <header class="header" role="banner">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a routerLink="/" class="logo-link">
              <img src="assets/images/logo.jpg" alt="" class="logo-image">
              <app-brand-wordmark class="logo-text"></app-brand-wordmark>
            </a>
          </div>

          <nav id="main-navigation" class="nav" [class.nav-open]="isMenuOpen" role="navigation" aria-label="Main navigation">
            <ul class="nav-list">
              <li class="nav-item">
                <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" (click)="closeMenu()">
                  {{ i18n.translate('home') }}
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/menu" routerLinkActive="active" class="nav-link" (click)="closeMenu()">
                  {{ i18n.translate('menu') }}
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/about" routerLinkActive="active" class="nav-link" (click)="closeMenu()">
                  {{ i18n.translate('about') }}
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/contact" routerLinkActive="active" class="nav-link" (click)="closeMenu()">
                  {{ i18n.translate('contact') }}
                </a>
              </li>
            </ul>
          </nav>

          <div class="header-actions">
            <app-language-switcher></app-language-switcher>
            <app-platform-buttons [variant]="'compact'" class="hide-mobile"></app-platform-buttons>
            
            <button 
              class="mobile-menu-toggle hide-desktop"
              aria-controls="main-navigation"
              [attr.aria-expanded]="isMenuOpen"
              [attr.aria-label]="isMenuOpen ? 'Close menu' : 'Open menu'"
              (click)="toggleMenu()">
              <span class="hamburger" [class.active]="isMenuOpen">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  menuData$: Observable<MenuData | null>;

  constructor(
    private menuDataService: MenuDataService,
    public i18n: I18nService
  ) {
    this.menuData$ = this.menuDataService.menuData$;
  }

  ngOnInit(): void {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
