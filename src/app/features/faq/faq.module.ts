import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FaqComponent } from '../placeholder.components';

@NgModule({
  declarations: [FaqComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: FaqComponent }])
  ]
})
export class FaqModule { }