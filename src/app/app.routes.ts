import { Routes } from '@angular/router';
import { AuthGuard, LoginGuard } from './core/guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { ItemsListComponent } from './pages/items-list/items-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/items', pathMatch: 'full' },
  { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent, canActivate: [LoginGuard] },
];
