import { Component, inject, Signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { map } from 'rxjs';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

  route = inject(ActivatedRoute);

  gender:Signal<string> = toSignal(
    this.route.params.pipe(map(({gender})=>gender))
  );
  private productsService = inject(ProductsService);
paginationService = inject(PaginationService);
  productResource = rxResource({
   params:()=>({gender:this.gender(),page:this.paginationService.currentPage()}),
   stream:({params})=>this.productsService.getProducts({gender:params.gender, page:params.page})
 });
}
