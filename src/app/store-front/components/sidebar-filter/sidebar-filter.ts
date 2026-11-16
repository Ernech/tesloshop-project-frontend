import { UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs';

@Component({
  selector: 'sidebar-filter-component',
  imports: [ReactiveFormsModule, UpperCasePipe],
  templateUrl: './sidebar-filter.html',
})
export class SidebarFilter {

  genders =['men','women','kid','unisex']
  tags = ['Shirt', 'Hoodie', 'Sweatshirt','Hats','Jacket'];

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];



  minPriceLimit = signal(0);
  maxPriceLimit = signal(500);



  private fb = inject(FormBuilder);

  myFilterForm = this.fb.nonNullable.group({
    selectedGender: [''],
    minPrice:[0],
    maxPrice:[250],
    sizes:this.fb.array<string>([]),
    categories:this.fb.array<string>([])
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


  toggleSize(size:string){
      const index = this.sizesArray.value.indexOf(size);
      if(index===-1){
        this.sizesArray.push(this.fb.nonNullable.control(size));
        return;
      }
      this.sizesArray.removeAt(index)
  }

  toggleCategory(category:string){
    const index = this.categoriesArray.value.indexOf(category);
    if(index===-1){
      this.categoriesArray.push(this.fb.control(category))
      return;
    }
    this.categoriesArray.removeAt(index);
  }

  onFilterFormSubmit(){
    console.log(this.myFilterForm.value);
  }

  isSizeIncluded(size:string):boolean{
    return this.sizesArray.value.includes(size);
  }

  isCategoryIncluded(category:string){
    return this.categoriesArray.value.includes(category);
  }
}
