import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  @Input() name: string;
  @Input() description: string;
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  public isOpen: boolean = false;

  constructor() { }

  ngOnInit() { }

  public toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }

  public broadcastName(name: string): void {
    this.change.emit(name);
  }

}
