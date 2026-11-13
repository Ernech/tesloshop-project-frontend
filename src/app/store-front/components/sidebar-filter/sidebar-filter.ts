import { Component, signal } from '@angular/core';

@Component({
  selector: 'sidebar-filter-component',
  imports: [],
  templateUrl: './sidebar-filter.html',
})
export class SidebarFilter {

  genders =['men','women','kid','unisex']
  tags = ['shirt', 'hoodie', 'pants', 'sweatshirt','hats','jacket','sweatshirt'];

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  selectedGender = signal('');
  selectedTags=signal<string[]>([]);
  selectedSizes = signal<string[]>([]);
  selectedMaxPrice =signal(250);
  selectedMinPrice = signal(0)
  minPrice = signal(0);
  maxPrice = signal(500);

   clearAllFilters() {
    this.selectedGender.set('');
    this.selectedTags.set([]);
    this.selectedSizes.set([]);
    this.maxPrice.set(500);
  }

}
