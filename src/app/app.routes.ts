import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'detail/:type/:id',
    loadComponent: () => import('./pages/movie-detail/movie-detail.page').then( m => m.MovieDetailPage)
  }
];
