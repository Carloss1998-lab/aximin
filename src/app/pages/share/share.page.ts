import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  @Input() url: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  onDismiss() {
    this.modalCtrl.dismiss();
  }

}
