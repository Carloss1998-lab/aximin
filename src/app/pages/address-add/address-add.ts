import { Component, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BasePage } from '../base-page/base-page';
import { CustomerAddress } from '../../services/customer-address';
import { Zone } from '../../services/zone';

@Component({
  selector: 'address-add',
  templateUrl: './address-add.html',
  styleUrls: ['./address-add.scss']
})
export class AddressAddPage extends BasePage {

  public form: FormGroup;
  public zones: Zone[] = [];
  public subzones: Zone[] = [];

  constructor(injector: Injector,
    private zoneService: Zone,
    private customerAddressService: CustomerAddress) {
    super(injector);
  }

  ngOnInit() {
    this.setupForm();
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ionViewDidEnter() {
    this.loadZones();
  }

  setupForm() {
    this.form = new FormGroup({
      zone: new FormControl(null, Validators.required),
      subzone: new FormControl(null, Validators.required),
      city: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      isDefault: new FormControl(false),
    });
  }

  onDismiss(address: CustomerAddress = null) {
    this.modalCtrl.dismiss(address);
  }

  async loadZones() {
    try {
      this.zones = await this.zoneService.load({ type: 'Parent' });
    } catch (error) {
      console.warn(error.message);
    }
  }

  async onZoneChanged() {
    try {
      this.form.controls.subzone.setValue(null);
      this.subzones = await this.zoneService.load({ parent: this.form.value.zone });
    } catch (error) {
      console.warn(error.message);
    }
  }

  async onSubmit() {

    if (this.form.invalid) {
      return this.translate.get('INVALID_FORM').subscribe(str => this.showToast(str));
    }

    try {

      await this.showLoadingView({ showOverlay: false });
      
      const formData = Object.assign({}, this.form.value);
      const address = await this.customerAddressService.create(formData);
      
      this.showContentView();
      this.onDismiss(address);
      
    } catch (error) {
      this.showContentView();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }

  }

}
