import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { CustomerAddress } from './customer-address';

@Injectable({
  providedIn: 'root'
})
export class Cart extends Parse.Object {

  constructor() {
    super('Cart');
    this.items = this.items || [];
  }

  new(): Cart {
    return new Cart();
  }

  empty(): boolean {
    return this.items.length === 0;
  }

  applyCoupon(couponCode: string) {
    return Parse.Cloud.run('applyCoupon', { couponCode });
  }

  removeCoupon() {
    return Parse.Cloud.run('removeCoupon');
  }

  getOne(): Promise<Cart> {
    const query = new Parse.Query(Cart);
    query.include('customer');
    query.equalTo('customer', Parse.User.current());
    return query.first();
  }

  calculateSubtotal() {
    const subtotal = this.items.reduce((sum: number, item: any) => {
      return sum + item.amount;
    }, 0);
    return subtotal;
  }

  get items(): any {
    return this.get('items');
  }

  set items(val) {
    this.set('items', val);
  }

  get subtotal(): number {
    return this.get('subtotal') || 0;
  }

  set subtotal(val) {
    this.set('subtotal', val);
  }

  get shipping(): CustomerAddress {
    return this.get('shipping');
  }

  set shipping(val) {
    this.set('shipping', val);
  }

  get shippingFee(): number {
    return this.get('shippingFee') || 0;
  }

  set shippingFee(val) {
    this.set('shippingFee', val);
  }

  get total(): number {
    return this.get('total') || 0;
  }

  set total(val) {
    this.set('total', val);
  }

  get customer(): any {
    return this.get('customer');
  }

  get status(): string {
    return this.get('status');
  }

  set status(val: string) {
    this.set('status', val);
  }

  get coupon(): any {
    return this.get('coupon');
  }

}

Parse.Object.registerSubclass('Cart', Cart);
