import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Card extends Parse.Object {

  constructor() {
    super('Card');
  }

  formatBrand() {
    return this.brand.toLowerCase().replace(' ', '_')
  }

  static getInstance() {
    return this;
  }

  load(): Promise<Card[]> {
    const query = new Parse.Query(Card);
    query.equalTo('user', Parse.User.current());
    query.descending('isDefault');
    query.addAscending('createdAt');
    return query.find();
  }

  create(params: any = {}): Promise<Card> {
    const obj = new Card();
    return obj.save(params);
  }

  delete(card: Card): Promise<Card> {
    return card.destroy();
  }

  get stripeToken(): string {
    return this.get('stripeToken');
  }

  get brand(): string {
    return this.get('brand');
  }

  get expMonth(): number {
    return this.get('expMonth');
  }

  get expYear(): number {
    return this.get('expYear');
  }

  get last4(): string {
    return this.get('last4');
  }

  get isDefault(): boolean {
    return this.get('isDefault');
  }

  toString(): string {
    return `&#8226;&#8226;&#8226;&#8226; ${this.last4}`;
  }

}

Parse.Object.registerSubclass('Card', Card);