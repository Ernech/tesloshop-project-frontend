import { Component, inject, signal } from '@angular/core';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";
import { ProductsService } from '@products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SplitHero } from '@store-front/components/split-hero/split-hero';
import { SidebarFilter } from '@store-front/components/sidebar-filter/sidebar-filter';
import { ProductQueryOptions, ValidCategory, ValidGender, ValidSize } from '@products/interfaces/filters.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';


@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent, SplitHero, SidebarFilter],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  private productsService = inject(ProductsService);
  private router = inject(Router);
  route = inject(ActivatedRoute);

  paginationService = inject(PaginationService);
  activeFilters = toSignal(
    this.route.queryParamMap.pipe(
      map((params):ProductQueryOptions=>{
        const filters:ProductQueryOptions={}

        const gender = params.get('gender');
        if (gender) filters.gender = gender as ValidGender;

        const minPrice = params.get('minPrice');
        if (minPrice !== null) filters.minPrice = Number(minPrice);

        const maxPrice = params.get('maxPrice');
        if (maxPrice !== null) filters.maxPrice = Number(maxPrice);

        const sizes = params.get('sizes');
        if (sizes) filters.sizes = sizes.split(',') as ValidSize[];

        const categories = params.get('categories');
        if (categories) filters.categories = categories.split(',') as ValidCategory[];

        return filters
      })
    ),{initialValue:{} as ProductQueryOptions});

  productResource = rxResource({
   params:()=>({page:this.paginationService.currentPage(),...this.activeFilters()}),
   stream:({params})=>this.productsService.getProducts(params)
 });

 onFiltersChanged(filters: ProductQueryOptions){
    this.router.navigate([],{
      relativeTo: this.route,
      queryParams:{
        page: 1,
        gender: filters.gender ?? null,
        minPrice: filters.minPrice ?? null,
        maxPrice: filters.maxPrice ?? null,
        sizes: filters.sizes?.length ? filters.sizes.join(',') : null,
        categories: filters.categories?.length ? filters.categories.join(',') : null,
      },
       queryParamsHandling: 'merge'

    })
 }

}
