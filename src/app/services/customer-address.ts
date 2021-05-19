import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class CustomerAddress extends Parse.Object {

  constructor() {
    super('CustomerAddress');
  }

  create(params: any = {}): Promise<CustomerAddress> {
    const obj = new CustomerAddress();
    return obj.save(params);
  }

  load(): Promise<CustomerAddress[]> {
    const query = new Parse.Query(CustomerAddress);
    query.include(['zone', 'subzone']);
    query.equalTo('customer', Parse.User.current());
    query.descending('isDefault');
    query.addDescending('createdAt');
    return query.find();
  }

  get address(): string {
    return this.get('address');
  }

  set address(val) {
    this.set('address', val);
  }

  get zone(): any {
    return this.get('zone');
  }

  set zone(val) {
    this.set('zone', val);
  }

  get subzone(): any {
    return this.get('subzone');
  }

  set subzone(val) {
    this.set('subzone', val);
  }

  get city(): string {
    return this.get('city');
  }

  set city(val) {
    this.set('city', val);
  }

  get zipcode(): string {
    return this.get('zipcode');
  }

  set zipcode(val) {
    this.set('zipcode', val);
  }

  get name(): string {
    return this.get('name');
  }

  set name(val) {
    this.set('name', val);
  }

  get phone(): string {
    return this.get('phone');
  }

  set phone(val) {
    this.set('phone', val);
  }

  get isDefault(): boolean {
    return this.get('isDefault');
  }

  set isDefault(val) {
    this.set('isDefault', val);
  }

  toString(): string {
    return `${this.address}, ${this.city}, ${this.subzone.name}, ${this.zipcode}, ${this.zone.name}`;
  }

}

Parse.Object.registerSubclass('CustomerAddress', CustomerAddress);

