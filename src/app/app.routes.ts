import { Routes } from '@angular/router';
import { AuthGuard, LoginGuard } from './core/guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { EditComponent } from './pages/item/edit/edit.component';
import { ItemCreateComponent } from './pages/item/item-create/item-create.component';
import { ItemsListComponent } from './pages/items/items-list.component';
import { ProductResolver } from './product.resolver';
import { TesteComponent } from './teste/teste.component';

export const routes: Routes = [
  { path: '', component: ItemsListComponent, canActivate: [AuthGuard] },
  {
    path: 'item/new',
    component: ItemCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'teste/:id',
    component: TesteComponent,
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
  {
    path: 'item/view/:id',
    component: ItemCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'auth', component: AuthComponent, canActivate: [LoginGuard] },
];
