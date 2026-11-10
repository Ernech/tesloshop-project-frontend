import { Component, inject } from '@angular/core';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SplitHero } from '@store-front/components/split-hero/split-hero';
import { SidebarFilter } from '@store-front/components/sidebar-filter/sidebar-filter';


@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent, SplitHero, SidebarFilter],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  private productsService = inject(ProductsService);

  paginationService = inject(PaginationService);

  productResource = rxResource({
   params:()=>({page:this.paginationService.currentPage()}),
   stream:({params})=>this.productsService.getProducts({
    page: params.page
   })
 });

}
