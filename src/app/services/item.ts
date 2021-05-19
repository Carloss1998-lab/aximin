import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { ItemVariation } from './item-variation';
import { Brand } from './brand';
import { Category } from './category';
import { SubCategory } from './sub-category';

@Injectable({
  providedIn: 'root'
})
export class Item extends Parse.Object {

  constructor() {
    super('Item');
  }

  static getInstance() {
    return this;
  }

  hasVariations() {
    return this.variations && this.variations.length;
  }

  loadInCloud(params: any = {}): Promise<Item[]> {
    return Parse.Cloud.run('getItems', params);
  }

  loadOne(id: string): Promise<Item> {
    const query = new Parse.Query(Item);
    query.include(['category', 'subcategory', 'variations', 'relatedItems', 'brand']);
    query.doesNotExist('deletedAt');
    return query.get(id);
  }

  load(params: any = {}): Promise<any> {

    const queries = []

    if (params.tag) {
      const searchQuery = params.tag.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

      const queryTag = new Parse.Query('Item')
      queryTag.contains('tags', searchQuery)
      queries.push(queryTag)

      const queryCanonical = new Parse.Query('Item')
      queryCanonical.contains('canonical', searchQuery)
      queries.push(queryCanonical)
    }

    let mainQuery = new Parse.Query('Item')

    if (queries.length) {
      mainQuery = Parse.Query.or(...queries)
    }

    if (params.priceMin) {
      mainQuery.greaterThanOrEqualTo('netPrice', Number(params.priceMin));
    }

    if (params.priceMax) {
      mainQuery.lessThanOrEqualTo('netPrice', Number(params.priceMax));
    }

    if (params.ratingMin) {
      mainQuery.greaterThanOrEqualTo('ratingAvg', Number(params.ratingMin));
    }

    if (params.ratingMax) {
      mainQuery.lessThanOrEqualTo('ratingAvg', Number(params.ratingMax));
    }

    if (params.canonical) {
      mainQuery.contains('canonical', params.canonical);
    }

    if (params.cat) {

      if (Array.isArray(params.cat)) {

        const categories = params.cat.map((id: string) => {
          const obj = new Category;
          obj.id = id;
          return obj;
        });

        if (categories.length) {
          mainQuery.containedIn('categories', categories);
        }

      } else {

        const category = new Category;
        category.id = params.cat;

        mainQuery.equalTo('categories', category);
      }

    }

    if (params.subcat) {

      if (Array.isArray(params.subcat)) {

        const subcats = params.subcat.map((id: string) => {
          const obj = new SubCategory;
          obj.id = id;
          return obj;
        });

        if (subcats.length) {
          mainQuery.containedIn('subcategories', subcats);
        }

      } else {

        const subcat = new SubCategory;
        subcat.id = params.subcat;

        mainQuery.equalTo('subcategories', subcat);
      }
    }

    if (params.brand) {

      if (Array.isArray(params.brand)) {

        const brands = params.brand.map((id: string) => {
          const obj = new Brand;
          obj.id = id;
          return obj;
        });

        if (brands.length) {
          mainQuery.containedIn('brand', brands);
        }

      } else {

        const brand = new Brand;
        brand.id = params.brand;

        mainQuery.equalTo('brand', brand);
      }

    }

    if (params.sale === '1') {
      mainQuery.greaterThan('salePrice', 0);
    }

    if (params.new === '1') {
      mainQuery.equalTo('isNewArrival', true)
    }

    if (params.featured === '1') {
      mainQuery.equalTo('isFeatured', true)
    }

    if (params.likes) {
      mainQuery.equalTo('likes', Parse.User.current());
    }

    if (params.limit) {
      mainQuery.limit(params.limit);
    }

    if (params.page && params.limit) {
      mainQuery.skip(params.page * params.limit);
    }

    if (params.sortBy) {

      if (params.sortBy === 'asc') {
        mainQuery.ascending(params.sortByField);
      } else if (params.sortBy === 'desc') {
        mainQuery.descending(params.sortByField);
      }

    } else {
      mainQuery.descending('createdAt');
    }

    mainQuery.equalTo('status', 'Active');
    mainQuery.include(['category', 'subcategory', 'variations', 'brand']);
    mainQuery.doesNotExist('deletedAt');

    return mainQuery.find();
  }

  count(params: any = {}): Promise<number> {

    let mainQuery = new Parse.Query(Item);

    if (params.priceRange) {
      mainQuery.greaterThanOrEqualTo('netPrice', params.priceRange.lower);
      mainQuery.lessThanOrEqualTo('netPrice', params.priceRange.upper);
    }

    if (params.rating) {
      mainQuery.greaterThanOrEqualTo('ratingAvg', params.rating.lower);
      mainQuery.lessThanOrEqualTo('ratingAvg', params.rating.upper);
    }

    if (params.isFeatured) {
      mainQuery.equalTo('isFeatured', true);
    }

    if (params.isOnSale) {
      mainQuery.greaterThan('salePrice', 0);
    }

    if (params.cat) {

      if (Array.isArray(params.cat)) {

        const categories = params.cat.map((id: string) => {
          const obj = new Category;
          obj.id = id;
          return obj;
        });

        if (categories.length) {
          mainQuery.containedIn('categories', categories);
        }
      } else {

        const category = new Category;
        category.id = params.cat;

        mainQuery.equalTo('categories', category);
      }

    }

    if (params.brand) {

      if (Array.isArray(params.brand)) {

        const brands = params.brand.map((id: string) => {
          const obj = new Brand;
          obj.id = id;
          return obj;
        });

        if (brands.length) {
          mainQuery.containedIn('brand', brands);
        }

      } else {

        const brand = new Brand;
        brand.id = params.brand;

        mainQuery.equalTo('brand', brand);
      }

    }

    mainQuery.equalTo('status', 'Active');
    mainQuery.doesNotExist('deletedAt');

    return mainQuery.count()
  }

  like(itemId: string) {
    return Parse.Cloud.run('likeItem', { itemId: itemId });
  }

  isLiked(itemId: string): Promise<boolean> {
    return Parse.Cloud.run('isItemLiked', { itemId: itemId });
  }

  trackView(itemId: string) {
    return Parse.Cloud.run('trackViewItem', { itemId: itemId });
  }

  get objectId(): string {
    return this.objectId;
  }

  get name(): string {
    return this.get('name');
  }

  get status(): string {
    return this.get('status');
  }

  get subcategory(): any {
    return this.get('subcategory');
  }

  get images(): any {
    return this.get('images')
  }

  get price(): number {
    return this.get('price')
  }

  get salePrice(): number {
    return this.get('salePrice')
  }

  get isFeatured(): boolean {
    return this.get('isFeatured')
  }

  get isNewArrival(): boolean {
    return this.get('isNewArrival')
  }

  get featuredImageThumb(): any {
    return this.get('featuredImageThumb')
  }

  get featuredImage(): any {
    return this.get('featuredImage')
  }

  get description(): string {
    return this.get('description')
  }

  get category(): any {
    return this.get('category')
  }

  get discount(): number {
    return this.get('discount')
  }

  get slug(): string {
    return this.id + '/' + (this.get('slug') || '');
  }

  get ratingCount() {
    return this.get('ratingCount');
  }

  get ratingTotal() {
    return this.get('ratingTotal');
  }

  get ratingAvg() {
    return this.get('ratingAvg');
  }

  get variations(): ItemVariation[] {
    return this.get('variations');
  }

  get brand(): Brand {
    return this.get('brand');
  }

  get deletedAt(): Date {
    return this.get('deletedAt');
  }

  get relatedItems(): Item[] {
    const relatedItems = this.get('relatedItems') || [];
    return relatedItems.filter((item: Item) => {
      return item.status === 'Active' && typeof item.deletedAt === 'undefined'
    });
  }

  get isNotAvailable(): boolean {
    return this.get('isNotAvailable');
  }

}

Parse.Object.registerSubclass('Item', Item);