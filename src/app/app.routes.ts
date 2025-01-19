import { Routes } from '@angular/router';
import { AuthGuard, LoginGuard } from './core/guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateComponent } from './pages/item/create/create.component';
import { EditComponent } from './pages/item/edit/edit.component';
import { ProductResolver } from './product.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'item/new',
    component: CreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'item/edit/:id',
    component: EditComponent,
    canActivate: [AuthGuard],
    resolve: {
      product: ProductResolver,
    },
  },
  { path: 'auth', component: AuthComponent, canActivate: [LoginGuard] },
  { path: '**', redirectTo: '/home' },
];
