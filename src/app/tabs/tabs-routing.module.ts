import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'products',
        loadChildren: () => import('../products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'shopping-list',
        loadChildren: () => import('../shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'prices',
        loadChildren: () => import('../prices/prices.module').then(m => m.PricesModule)
      },
      {
        path: 'statistics',
        loadChildren: () => import('../statistics/statistics.module').then(m => m.StatisticsModule)
      },
      {
        path: '',
        redirectTo: '/tabs/products',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/products',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
