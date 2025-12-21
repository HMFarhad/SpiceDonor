import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NotFoundComponent } from '../placeholder.components';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: NotFoundComponent }])
  ]
})
export class NotFoundModule { }