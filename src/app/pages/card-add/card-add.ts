import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Card } from '../../services/card';
import { BasePage } from '../base-page/base-page';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';

@Component({
  selector: 'card-add',
  templateUrl: './card-add.html',
  styleUrls: ['./card-add.scss']
})
export class CardAddPage extends BasePage implements OnInit {

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  public form: FormGroup;
  public isSaving: boolean = false;
  public cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
  };
  public elementsOptions: StripeElementsOptions = {};

  constructor(injector: Injector,
    private stripeService: StripeService,
    private creditCardService: Card) {
    super(injector);
  }

  ngOnInit() {
    this.setupForm();
    this.setupStripeCard();
  }

  enableMenuSwipe() {
    return false;
  }

  setupStripeCard() {
    this.elementsOptions.locale = this.preference.lang;
  }

  setupForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      isDefault: new FormControl(false),
    });
  }

  onDismiss(card: Card = null) {
    this.modalCtrl.dismiss(card);
  }

  async onSubmit() {

    if (this.form.invalid) {
      return this.translate.get('INVALID_FORM').subscribe(str => this.showToast(str));
    }

    try {

      this.isSaving = true;

      const formData = Object.assign({}, this.form.value);

      const { token, error } = await this.stripeService
        .createToken(this.card.getCard(), formData)
        .toPromise();

      if (error) {
        this.isSaving = false;
        return this.showToast(error.message);
      }

      const card = await this.creditCardService.create({
        stripeToken: token.id,
        isDefault: formData.isDefault,
      });

      this.isSaving = false;

      this.onDismiss(card);

    } catch (error) {

      let errorMessage = 'ERROR_NETWORK';

      if (typeof error === 'string' || error.code === 1002) {
        errorMessage = 'CARD_INVALID';
      }

      this.isSaving = false;
      this.translate.get(errorMessage).subscribe(str => this.showToast(str));
    }

  }

}