import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PlatformButtonsComponent } from './components/platform-buttons/platform-buttons.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';

const components = [
  HeaderComponent,
  FooterComponent,
  PlatformButtonsComponent,
  LanguageSwitcherComponent,
  CookieBannerComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...components
  ]
})
export class SharedModule { }