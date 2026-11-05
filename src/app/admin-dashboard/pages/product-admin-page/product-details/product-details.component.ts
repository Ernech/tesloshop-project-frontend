import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from "@shared/components/form-error-label-component/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit{


  product = input.required<Product>()

  productService = inject(ProductsService);
  wasSaved = signal(false);
  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;
  router = inject(Router);
  imagesToCarrousel = computed(()=>{
    return [...this.product().images, ...this.tempImages()]
  });
  fb = inject(FormBuilder)

  productForm = this.fb.group({
    title:['',Validators.required],
    description:['',Validators.required],
    slug:['',[Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price:[0,[Validators.required, Validators.min(0)]],
    stock:[0,[Validators.required, Validators.min(0)]],
    sizes:[['']],
    images:[[]],
    gender:['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
    tags:['']
  })


  sizes = ['XS','S','M','L','XL','XXL']


  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue(formLike:Partial<Product>){

      this.productForm.reset(this.product() as any)
      this.productForm.patchValue({tags:formLike.tags?.join(',')})
  }

  onSizedClicked(size:string){
    const currentSize = this.productForm.value.sizes ?? [];
    if(currentSize.includes(size)){
      currentSize.splice(currentSize.indexOf(size),1)
    }else{
      currentSize.push(size)
    }

    this.productForm.patchValue({sizes:currentSize})
  }

  async onSubmit(){
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if(!isValid) return;
    const formValue =this.productForm.value;
    const productLike:Partial<Product>={
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map(tag=>tag.trim()) ?? []
    };

    if(this.product().id==='new'){
      const product = await firstValueFrom(this.productService.createProduct(productLike,this.imageFileList));
      this.router.navigate(['/admin/products',product.id])
    }else{
       await firstValueFrom(this.productService.updateProduct(this.product().id,productLike,this.imageFileList))
    }

    this.wasSaved.set(true)
    setTimeout(()=>{
      this.wasSaved.set(false);
    },3000)


  }
  onFileChanges(event:Event){
    const fileList =(event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;
    this.tempImages.set([]);
    const imagesURL = Array.from(fileList??[]).map(file=> URL.createObjectURL(file));
    this.tempImages.set(imagesURL);


  }

}
