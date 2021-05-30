import { Component, Injector, OnInit, Input } from '@angular/core';
import { Category } from '../../services/category';
import { BasePage } from '../base-page/base-page';
import { Item } from 'src/app/services/item';
import { Brand } from 'src/app/services/brand';
import Utils from 'src/app/utils/utils';

interface CheckboxOption {
  id: string,
  name: string,
  isChecked: boolean;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterPage extends BasePage implements OnInit {

  @Input() params: any = {};

  public categories: CheckboxOption[] = [];
  public brands: CheckboxOption[] = [];

  public query: any = {
    priceRange: { lower: 10, upper: 10000 },
    rating: { lower: 0, upper: 5 },
  };

  public minPrice: number = 10;
  public maxPrice: number = 10000;

  public minRating: number = 0;
  public maxRating: number = 5;

  public isLoading: boolean;

  public isLoadingCategories: boolean;
  public isLoadingBrands: boolean;
  public isQueryChanged: boolean;
  public isRangeChanged: boolean;

  public count: number = 0;

  constructor(injector: Injector,
    private itemService: Item,
    private brandService: Brand,
    private categoryService: Category) {
    super(injector);
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ngOnInit() {

    this.query.isFeatured = this.params.featured === '1' ? true : false;
    this.query.isOnSale = this.params.sale === '1' ? true : false;

    if (this.params.ratingMin) {
      this.query.rating.lower = Number(this.params.ratingMin);
    }

    if (this.params.ratingMax) {
      this.query.rating.upper = Number(this.params.ratingMax);
    }

    if (this.params.priceMin) {
      this.query.priceRange.lower = Number(this.params.priceMin);
    }

    if (this.params.priceMax) {
      this.query.priceRange.upper = Number(this.params.priceMax);
    }

    this.loadData();
  }

  onDismiss(query: any = null) {
    this.modalCtrl.dismiss(query);
  }

  async loadData() {

    try {
      const promise1 = this.categoryService.load();
      const promise2 = this.brandService.load({
        categories: this.params.cat
      });

      const [categories, brands] = await Promise.all([promise1, promise2]);

      this.categories = categories.map(category => {

        let isChecked = false;

        if (this.params.cat) {

          if (Array.isArray(this.params.cat)) {
            isChecked = this.params.cat.includes(category.id);
          } else {
            isChecked = this.params.cat === category.id;
          }

        }

        const option: CheckboxOption = {
          id: category.id,
          name: category.name,
          isChecked: isChecked,
        };
        return option;
      });

      this.brands = brands.map(brand => {

        let isChecked = false;

        if (this.params.brand) {

          if (Array.isArray(this.params.brand)) {
            isChecked = this.params.brand.includes(brand.id);
          } else {
            isChecked = this.params.brand === brand.id;
          }

        }

        const option: CheckboxOption = {
          id: brand.id,
          name: brand.name,
          isChecked: isChecked,
        };
        return option;
      });

      this.loadCount();

    } catch (error) {
      console.log(error.message);
    }

  }

  async loadBrands(params: any = {}) {

    const brands = await this.brandService.load(params);

    this.brands = brands.map(brand => {
      const option: CheckboxOption = {
        id: brand.id,
        name: brand.name,
        isChecked: false
      };
      return option;
    });
  }

  async onCategoryChanged(event: any = {}) {

    if (event.target.className.includes('interactive')) {

      const categories = this.categories
        .filter(category => category.isChecked)
        .map(category => category.id);

      this.query.cat = categories;
      delete this.query.brand;

      this.loadBrands({ categories });

      this.loadCount();

    }

  }

  async onBrandChanged(event: any = {}) {

    if (event.target.className.includes('interactive')) {

      const brands = this.brands
      .filter(brand => brand.isChecked)
      .map(brand => brand.id);

      this.query.brand = brands;

      this.loadCount();
    }

  }

  async onQueryChanged(event: any = {}) {
    if (event.target.className.includes('interactive')) {
      this.loadCount();
    }
  }

  async onRangeChanged(event: any = {}) {
    this.loadCount();
  }

  async loadCount() {
    try {
      this.isLoading = true;
      await Utils.sleep(1500);
      this.count = await this.itemService.count(this.query);
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
    }
  }

  onApplyButtonTouched() {

    const params: any = {};

    params.featured = this.query.isFeatured ? '1' : '0';
    params.sale = this.query.isOnSale ? '1' : '0';
    params.ratingMin = this.query.rating.lower.toString();
    params.ratingMax = this.query.rating.upper.toString();
    params.priceMin = this.query.priceRange.lower.toString();
    params.priceMax = this.query.priceRange.upper.toString();

    params.cat = this.query.cat;
    params.brand = this.query.brand;

    this.onDismiss(params);
  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}
