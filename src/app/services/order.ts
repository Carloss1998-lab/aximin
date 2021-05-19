import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Order extends Parse.Object {

  constructor() {
    super('Order');
  }

  isShippedOut(): boolean {
    return this.status === 'Shipped Out';
  }

  isDelivered(): boolean {
    return this.status === 'Delivered';
  }

  prettyItems() {
    return this.items.map((item: any) => item.name).join(', ');
  }

  load(): Promise<Order[]> {
    const query = new Parse.Query(Order);
    query.include(['customer', 'items.product']);
    query.equalTo('customer', Parse.User.current());
    query.descending('createdAt');
    query.doesNotExist('deletedAt');
    return query.find();
  }

  loadOne(id: string): Promise<Order> {
    const query = new Parse.Query(Order);
    return query.get(id);
  }

  markAsDelivered(): Promise<Order> {
    const id = this.id;
    return Parse.Cloud.run('markOrderAsDelivered', { id });
  }

  reviewItem(review: any = {}): Promise<Order> {
    const id = this.id;
    return Parse.Cloud.run('reviewOrderItem', { id, ...review });
  }

  get number(): number {
    return this.get('number');
  }

  get customer(): any {
    return this.get('customer');
  }

  get firstItem(): any {
    return this.get('items')[0];
  }

  get items(): any {
    return this.get('items');
  }

  set items(val) {
    this.set('items', val);
  }

  get subtotal() {
    return this.get('subtotal');
  }

  get total() {
    return this.get('total');
  }

  get shipping() {
    return this.get('shipping');
  }

  set shipping(val) {
    this.set('shipping', val);
  }

  get contact() {
    return this.get('contact');
  }

  set contact(val) {
    this.set('contact', val);
  }

  get card() {
    return this.get('card');
  }

  set card(val) {
    this.set('card', val);
  }

  get paymentMethod() {
    return this.get('paymentMethod');
  }

  set paymentMethod(val) {
    this.set('paymentMethod', val);
  }

  get contactNumber(): string {
    return this.get('contactNumber') || '';
  }

  set contactNumber(val) {
    this.set('contactNumber', val);
  }

  get status() {
    return this.get('status');
  }

  set status(val) {
    this.set('status', val);
  }

  get shippingFee(): number {
    return this.get('shippingFee');
  }

  get coupon(): any {
    return this.get('coupon');
  }

  get cancellationReason(): string {
    return this.get('cancellationReason');
  }

  get tracking(): any {
    return this.get('tracking');
  }

}

Parse.Object.registerSubclass('Order', Order);
