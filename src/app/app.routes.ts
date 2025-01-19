import { Routes } from '@angular/router';
import { AuthGuard, LoginGuard } from './core/guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((mod) => mod.HomeComponent),
    canActivate: [AuthGuard],
  },

  {
    path: 'item/new',
    loadComponent: () =>
      import('./pages/item/create/create.component').then(
        (mod) => mod.CreateComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'product/new',
    loadComponent: () =>
      import('./pages/item/create/create.component').then(
        (mod) => mod.CreateComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'product/edit/:id',
    loadComponent: () =>
      import('./pages/item/edit/edit.component').then(
        (mod) => mod.EditComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((mod) => mod.AuthComponent),
    canActivate: [LoginGuard],
  },

  { path: 'auth', component: AuthComponent, canActivate: [LoginGuard] },
  //{ path: '**', redirectTo: '/home' },
];
