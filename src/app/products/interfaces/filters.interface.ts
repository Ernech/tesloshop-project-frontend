export type ValidGender = 'men' | 'women' | 'kid' | 'unisex' | '';
export type ValidSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ValidCategory = 'shirt' | 'hoodie' | 'sweatshirt' | 'hats' | 'jacket';

export interface FiltersProducts{
  gender:ValidGender;
  minPrice: number;
  maxPrice: number;
  sizes: ValidSize[];
  categories: ValidCategory[];
}
