import { Routes } from "@angular/router";
import { AdminDashboardLayoutComponentComponent } from "./layout/AdminDashboardLayoutComponent/admin-dashboard-layout-component.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";
import { IsAdminGuard } from "@auth/guards/is-admin.guard";
import { NotAuthenticatedGuard } from "@auth/guards/not-authenticated.guard";


export const adminDashboardRoutes:Routes=[

  {
      path:'',
      component:AdminDashboardLayoutComponentComponent,
      canMatch:[
        IsAdminGuard
      ],
      children:[
        {
          path:'products',
          component:ProductsAdminPageComponent
        },
        {
          path:'products/:id',
          component:ProductAdminPageComponent
        },
        {
          path:'**',
          redirectTo:'products'
        }
      ]
  }

]

export default adminDashboardRoutes;
