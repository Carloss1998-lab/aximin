import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../services/guards/auth.guard';

const routes: Routes = [
  {
    path: '1',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'search',
            loadChildren: () => import('../pages/search/search.module').then(m => m.SearchPageModule)
          },
          {
            path: 'search/:term',
            loadChildren: () => import('../pages/search/search.module').then(m => m.SearchPageModule)
          },
          {
            path: 'items',
            loadChildren: () => import('../pages/item-list/item-list.module').then(m => m.ItemListPageModule)
          },
          {
            path: 'brands',
            loadChildren: () => import('../pages/brand-list/brand-list.module').then(m => m.BrandListPageModule)
          },
          {
            path: 'categories',
            loadChildren: () => import('../pages/category-list/category-list.module').then(m => m.CategoryListPageModule)
          },
          {
            path: 'subcategories',
            loadChildren: () => import('../pages/sub-category-list/sub-category-list.module').then(m => m.SubCategoryListPageModule)
          },
          {
            path: 'items/:itemId',
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
          {
            path: 'items/:itemId/reviews',
            loadChildren: () => import('../pages/review-list/review-list.module').then(m => m.ReviewListPageModule)
          },
          {
            path: 'items/:itemId/:slug',
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
          {
            path: 'items/:itemId/:slug/reviews',
            loadChildren: () => import('../pages/review-list/review-list.module').then(m => m.ReviewListPageModule)
          },
        ]
      },
      {
        path: 'browse',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/category-list/category-list.module').then(m => m.CategoryListPageModule)
          },
          {
            path: 'subcategories',
            loadChildren: () => import('../pages/sub-category-list/sub-category-list.module').then(m => m.SubCategoryListPageModule)
          },
          {
            path: 'items',
            loadChildren: () => import('../pages/item-list/item-list.module').then(m => m.ItemListPageModule)
          },
          {
            path: 'items/:itemId/:slug',
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
          {
            path: 'items/:itemId/reviews',
            loadChildren: () => import('../pages/review-list/review-list.module').then(m => m.ReviewListPageModule)
          },
          {
            path: 'items/:itemId/:slug/reviews',
            loadChildren: () => import('../pages/review-list/review-list.module').then(m => m.ReviewListPageModule)
          },
        ]
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/cart-page/cart-page.module').then(m => m.CartPageModule)
          },
          {
            path: 'items/:itemId/:slug',
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
          {
            path: 'items/:itemId/:slug/reviews',
            loadChildren: () => import('../pages/review-list/review-list.module').then(m => m.ReviewListPageModule)
          },
          {
            path: 'checkout',
            loadChildren: () => import('../pages/checkout-page/checkout-page.module').then(m => m.CheckoutPageModule)
          },
          {
            path: 'checkout/thanks/:orderId',
            loadChildren: () => import('../pages/thanks-page/thanks-page.module').then(m => m.ThanksPageModule)
          }
        ]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/profile-page/profile-page.module').then(m => m.ProfilePageModule)
          },
          {
            path: 'payment',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/card-list/card-list.module').then(m => m.CardListPageModule)
          },
          {
            path: 'addresses',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/address-list/address-list.module').then(m => m.AddressListPageModule)
          },
          {
            path: 'help',
            loadChildren: () => import('../pages/about/about.module').then(m => m.AboutPageModule)
          },
          {
            path: 'favorites',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/favorite/favorite.module').then(m => m.FavoritePageModule)
          },
          {
            path: 'favorites/:itemId/:slug',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
          {
            path: 'favorites/:itemId/:slug/reviews',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/review-list/review-list.module').then(m => m.ReviewListPageModule)
          },
          {
            path: 'orders',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/order-list-page/order-list-page.module').then(m => m.OrderListPageModule)
          },
          {
            path: 'orders/:id',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/order-detail-page/order-detail-page.module').then(m => m.OrderDetailPageModule)
          },
          {
            path: 'pages/:id/:slug',
            loadChildren: () => import('../pages/page/page.module').then(m => m.PageViewModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/1/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/1/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
