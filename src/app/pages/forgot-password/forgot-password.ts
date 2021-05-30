import { Component, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BasePage } from '../base-page/base-page';
import { User } from '../../services/user';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
  styleUrls: ['forgot-password.scss']
})
export class ForgotPasswordPage extends BasePage {

  public form: FormGroup;

  constructor (injector: Injector,
    private userService: User) {
    super(injector);

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  enableMenuSwipe () {
    return false;
  }

  onDismiss () {
    this.modalCtrl.dismiss();
  }

  async onSubmit () {

    if (this.form.invalid) {
      const message = await this.getTrans('INVALID_FORM');
      return this.showToast(message);
    }

    try {

      await this.showLoadingView({ showOverlay: false });
      
      const email = this.form.value.email;
      
      await this.userService.recoverPassword(email);

      this.showContentView();

      this.translate.get('FORGOT_PASSWORD_SUCCESS')
        .subscribe((str: string) => this.showAlert(str));

    } catch (err) {

      if (err.code === 205) {
        this.translate.get('EMAIL_NOT_FOUND').subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      }

      this.showContentView();

    }

  }

}
