import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsTableComponent } from "@products/components/products-tables/products-table-component";
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductsTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService)
  productsPerPage = signal(10);


  productResource = rxResource({
   params:()=>({page:this.paginationService.currentPage(),limit:this.productsPerPage()}),
   stream:({params})=>this.productsService.getProducts({
    page: params.page,
    limit: params.limit
   })
 });

  onSelectionChange(selectedValue:number) {
    this.productsPerPage.set(selectedValue);
  }

}
