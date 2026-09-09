import { Component } from '@angular/core';

@Component({
  selector: 'app-brand-wordmark',
  template: `
    <span class="brand-wordmark" role="img" aria-label="Spice Döner">
      <span class="brand-copy" aria-hidden="true">Sp</span>
      <img
        class="brand-i"
        src="assets/images/brand-chili.png"
        alt=""
        aria-hidden="true">
      <span class="brand-copy" aria-hidden="true">ce Döner</span>
    </span>
  `,
  styleUrls: ['./brand-wordmark.component.scss']
})
export class BrandWordmarkComponent {}
