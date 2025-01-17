import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ItemsListComponent } from './pages/items-list/items-list.component';

export const routes: Routes = [
  { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard] },
];
