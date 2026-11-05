import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: null|string | string[]): string {
    const noImagePath ='./assets/images/no-image.jpg';

    if(value === null){
      return noImagePath
    }
    if(Array.isArray(value)){
        if(value.length>=1){
          return `${baseUrl}/files/product/${value[0]}`
        }
        return noImagePath
    }else if(typeof value ==="string"){
      if(value.startsWith('blob:')){
        return value;
      }
      return `${baseUrl}/files/product/${value}`
    }
    else{
      return noImagePath;
    }
  }
}
