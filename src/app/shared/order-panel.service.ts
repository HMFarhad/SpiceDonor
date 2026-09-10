import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderPanelService {
  readonly requested = new Subject<void>();
  open(): void { this.requested.next(); }
}
