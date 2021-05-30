import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Coupon extends Parse.Object {

  constructor() {
    super('Coupon');
  }

  static getInstance() {
    return this;
  }

  get code(): string {
    return this.get('code');
  }

  get expiresAt(): Date {
    return this.get('expiresAt');
  }

  get status(): string {
    return this.get('status');
  }

  get amount(): number {
    return this.get('amount');
  }

  get minimumOrderAmount(): number {
    return this.get('minimumOrderAmount');
  }

  get usageLimit(): number {
    return this.get('usageLimit');
  }

  get usage(): number {
    return this.get('usage');
  }
}

Parse.Object.registerSubclass('Coupon', Coupon);