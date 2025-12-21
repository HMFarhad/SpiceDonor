import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
    data: { title: 'Home' }
  },
  {
    path: 'menu',
    loadChildren: () => import('./features/menu/menu.module').then(m => m.MenuModule),
    data: { title: 'Menu' }
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule),
    data: { title: 'About' }
  },
  {
    path: 'contact',
    loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule),
    data: { title: 'Contact' }
  },
  {
    path: 'catering',
    loadChildren: () => import('./features/catering/catering.module').then(m => m.CateringModule),
    data: { title: 'Catering' }
  },
  {
    path: 'faq',
    loadChildren: () => import('./features/faq/faq.module').then(m => m.FaqModule),
    data: { title: 'FAQ' }
  },
  {
    path: 'privacy',
    loadChildren: () => import('./features/legal/legal.module').then(m => m.LegalModule),
    data: { title: 'Privacy Policy' }
  },
  {
    path: 'terms',
    loadChildren: () => import('./features/legal/legal.module').then(m => m.LegalModule),
    data: { title: 'Terms of Service' }
  },
  {
    path: '**',
    loadChildren: () => import('./features/not-found/not-found.module').then(m => m.NotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    scrollPositionRestoration: 'top',
    preloadingStrategy: undefined // Will be configured for production
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }