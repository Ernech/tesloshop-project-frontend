import { UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FiltersProducts, ProductQueryOptions, ValidCategory, ValidGender, ValidSize } from '@products/interfaces/filters.interface';
import { ProductsService } from '@products/services/products.service';
import { startWith } from 'rxjs';

export const priceRangeValidator:ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const min = group.get('minPrice')?.value;
  const max = group.get('maxPrice')?.value;

  // Si ambos tienen valor y el mínimo es mayor al máximo (o viceversa)
  if (min !== null && max !== null && min > max) {
    return { invalidPriceRange: true };
  }

  return null;
};


@Component({
  selector: 'sidebar-filter-component',
  imports: [ReactiveFormsModule, UpperCasePipe],
  templateUrl: './sidebar-filter.html',
})
export class SidebarFilter {

  private readonly productsServices = inject(ProductsService);
  genders:ValidGender[] =['men','women','kid','unisex']
  tags:ValidCategory[] = ['shirt', 'hoodie', 'sweatshirt','hats','jacket'];

  sizes:ValidSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];


  readonly MAX_CATALOG_PRICE = 500;

  minPriceLimit = signal(0);
  maxPriceLimit = signal(this.MAX_CATALOG_PRICE);



  private fb = inject(FormBuilder);

  myFilterForm = this.fb.nonNullable.group({
    selectedGender: this.fb.nonNullable.control<ValidGender>(''),
    minPrice: [0, [Validators.required, Validators.min(0), Validators.max(this.MAX_CATALOG_PRICE)]],
      maxPrice: [this.MAX_CATALOG_PRICE, [Validators.required, Validators.min(0), Validators.max(this.MAX_CATALOG_PRICE)]],
    sizes:this.fb.nonNullable.array<ValidSize>([]),
    categories:this.fb.nonNullable.array<ValidCategory>([])
  },
  {
    validators:priceRangeValidator
  })

   selectedMinPrice = toSignal(
    this.myFilterForm.controls.minPrice.valueChanges.pipe(
      startWith(this.myFilterForm.controls.minPrice.value)
    ),
    { initialValue: 0 }
  );

  selectedMaxPrice = toSignal(
    this.myFilterForm.controls.maxPrice.valueChanges.pipe(
      startWith(this.myFilterForm.controls.maxPrice.value)
    ),
    { initialValue: 250 }
  );

  onChangeMinAndMaxPriceButton(minPrice:number, maxPrice:number){
     this.myFilterForm.patchValue({
      minPrice,
      maxPrice
    });
  }

  get sizesArray() {
    return this.myFilterForm.controls.sizes;
  }

  get categoriesArray(){
    return this.myFilterForm.controls.categories;
  }


  toggleSize(size:ValidSize){
      const index = this.sizesArray.value.indexOf(size);
      if(index===-1){
        this.sizesArray.push(this.fb.nonNullable.control(size));
        return;
      }
      this.sizesArray.removeAt(index)
  }

  toggleCategory(category:ValidCategory){
    const index = this.categoriesArray.value.indexOf(category);
    if(index===-1){
      this.categoriesArray.push(this.fb.nonNullable.control(category))
      return;
    }
    this.categoriesArray.removeAt(index);
  }

  onFilterFormSubmit(){
    if(this.myFilterForm.invalid) return;
    const rawValues = this.myFilterForm.getRawValue();
    const filterParams: ProductQueryOptions = {};
    if(rawValues.selectedGender){
      filterParams.gender = rawValues.selectedGender
    }
    if(rawValues.minPrice>0){
      filterParams.minPrice = rawValues.minPrice;
    }
    if (rawValues.maxPrice < this.MAX_CATALOG_PRICE) {
      filterParams.maxPrice = rawValues.maxPrice;
    }
    if(rawValues.categories && rawValues.categories.length>0){
      filterParams.categories = rawValues.categories;
    }
     if(rawValues.sizes && rawValues.sizes.length>0){
      filterParams.sizes = rawValues.sizes;
    }
  }

  isSizeIncluded(size:ValidSize):boolean{
    return this.sizesArray.value.includes(size);
  }

  isCategoryIncluded(category:ValidCategory){
    return this.categoriesArray.value.includes(category);
  }
}
