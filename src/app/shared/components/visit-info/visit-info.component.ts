import { Component, Input } from '@angular/core';
import { I18nService, MenuDataService } from '@core/services';
import { Hours, SiteSettings } from '@core/models';

@Component({
  selector: 'app-visit-info',
  template: `
    <div *ngIf="data.menuData$ | async as menu" class="visit-info" [class.compact]="compact">
      <div class="visit-address"><strong>{{ menu.settings.addressLine1 }}</strong><span>{{ menu.settings.postalCode }} {{ menu.settings.city }}</span></div>
      <div class="visit-hours">
        <p *ngIf="todayHours(menu.hours) as hours"><strong>{{ i18n.translate('today') }}:</strong> {{ hours.closed ? i18n.translate('closed') : hours.open + '–' + hours.close }}</p>
        <details>
          <summary>{{ i18n.translate('hours_details') }}</summary>
          <ul><li *ngFor="let hours of menu.hours"><span>{{ dayName(hours.day) }}</span><span>{{ hours.closed ? i18n.translate('closed') : hours.open + '–' + hours.close }}</span></li></ul>
        </details>
      </div>
      <div class="visit-actions">
        <a [href]="directionsUrl(menu.settings)" target="_blank" rel="noopener noreferrer" class="btn btn-outline">{{ i18n.translate('directions') }} ↗</a>
        <a *ngIf="menu.settings.phone" [href]="'tel:' + cleanPhone(menu.settings.phone)" class="btn btn-outline">{{ i18n.translate('call') }}</a>
      </div>
      <div *ngIf="!compact" class="contact-links">
        <a *ngIf="menu.settings.phone" [href]="'tel:' + cleanPhone(menu.settings.phone)">{{ menu.settings.phone }}</a>
        <a *ngIf="menu.settings.email" [href]="'mailto:' + menu.settings.email">{{ menu.settings.email }}</a>
      </div>
    </div>
  `,
  styles: [`
    .visit-info { display:grid; gap:1rem; color:var(--text-light); }
    .visit-address { display:grid; }
    .visit-address strong { color:var(--white); }
    .visit-hours p { margin:0; font-size:.9rem; }
    summary { min-height:44px; cursor:pointer; padding:10px 0; color:var(--secondary-color); font-size:.9rem; }
    ul { list-style:none; margin:0; padding:0; font-size:.88rem; }
    li { display:flex; justify-content:space-between; gap:1rem; padding:.35rem 0; }
    .visit-actions { display:flex; flex-wrap:wrap; gap:.6rem; }
    .btn { min-height:44px; font-size:.85rem; padding:.6rem 1rem; }
    .contact-links { display:grid; gap:.65rem; overflow-wrap:anywhere; }
    .compact { grid-template-columns:1fr 1fr auto; align-items:start; }
    @media(max-width:768px) { .compact { grid-template-columns:1fr; gap:.35rem; } .visit-address { display:flex; flex-wrap:wrap; gap:0 .5rem; } }
  `]
})
export class VisitInfoComponent {
  @Input() compact = false;
  constructor(public data: MenuDataService, public i18n: I18nService) {}
  todayHours(hours: Hours[]): Hours | undefined {
    const day = new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'Europe/Helsinki' }).format(new Date());
    return hours.find(hours => hours.day === day);
  }
  dayName(day: string): string {
    const keys: Record<string, string> = {Mon:'monday',Tue:'tuesday',Wed:'wednesday',Thu:'thursday',Fri:'friday',Sat:'saturday_day',Sun:'sunday_day'};
    return this.i18n.translate(keys[day] || day);
  }
  cleanPhone(phone: string): string { return phone.replace(/[\s()-]/g, ''); }
  directionsUrl(settings: SiteSettings): string {
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(
      `${settings.addressLine1}${settings.addressLine2 ? ', ' + settings.addressLine2 : ''}, ${settings.postalCode} ${settings.city}`
    );
  }
}
