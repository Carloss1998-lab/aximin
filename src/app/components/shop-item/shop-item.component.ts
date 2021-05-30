import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/services/item';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.scss'],
})
export class ShopItemComponent implements OnInit {

  @Input() item: Item;
  @Input() styles: any;
  @Input('customObservable') scrollObservable: Observable<any>;

  constructor() { }

  ngOnInit() {}

}
