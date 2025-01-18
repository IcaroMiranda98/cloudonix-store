import { Routes } from '@angular/router';
import { AuthGuard, LoginGuard } from './core/guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { ItemCreateComponent } from './pages/items-list/item-create/item-create.component';
import { ItemsListComponent } from './pages/items-list/items-list.component';

export const routes: Routes = [
  { path: '', component: ItemsListComponent, canActivate: [AuthGuard] },
  {
    path: 'item/new',
    component: ItemCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'item/edit/:id',
    component: ItemCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'item/view/:id',
    component: ItemCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'auth', component: AuthComponent, canActivate: [LoginGuard] },
];
