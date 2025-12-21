import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CateringComponent } from '../placeholder.components';

@NgModule({
  declarations: [CateringComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: CateringComponent }])
  ]
})
export class CateringModule { }