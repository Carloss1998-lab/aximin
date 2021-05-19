import { Component, Input } from '@angular/core';

@Component({
  selector: 'empty-view',
  templateUrl: 'empty-view.html',
  styleUrls: ['empty-view.scss']
})
export class EmptyView {

  @Input() text: string = '';
  @Input() icon: string = 'alert';
  @Input() image: string = '';
  @Input() imageWidth: string = '';

  constructor() {}

}
