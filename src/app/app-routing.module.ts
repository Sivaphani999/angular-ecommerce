import { Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OktaAuth } from '@okta/okta-auth-js'
import myAppConfig from './config/my-app-config';
import { LoginComponent } from './components/login/login.component';
import { ProductService } from './services/product.service';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';


function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector){
  // Use injector to access any services available within your application
  const router = injector.get(Router);

  router.navigate(['/login']);
}

const routes: Routes = [ 
  {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard], data: {onAuthRequired : sendToLoginPage}},
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard], data:{onAuthRequired : sendToLoginPage}},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path : 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path : 'search/:keyword', component: ProductListComponent},
  {path : 'products/:id', component: ProductDetailsComponent},
  {path : 'category/:id', component: ProductListComponent},
  {path : 'category', component: ProductListComponent},
  {path : 'products', component: ProductListComponent},
  {path : '', redirectTo: '/products',pathMatch: 'full'},
  {path : '**', redirectTo: '/products',pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [ProductService ],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
