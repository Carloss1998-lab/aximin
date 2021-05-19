
import { Component, Injector } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { User } from '../../services/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ParseFile } from 'src/app/services/parse-file';

@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
  styleUrls: ['profile-edit.scss']
})
export class ProfileEditPage extends BasePage {

  public photo: ParseFile;
  public user: User;
  public form: FormGroup;

  constructor(injector: Injector) {
    super(injector);
    this.user = User.getCurrent();
  }

  enableMenuSwipe() {
    return true;
  }

  ngOnInit() {
    this.setupForm();
  }

  onFileUploaded(file: ParseFile) {
    this.photo = file;
  }

  setupForm() {

    let formGroupParams: any = {
      name: new FormControl(this.user.name, Validators.required),
      email: new FormControl(this.user.email)
    };

    // Show the username field if user logged in with username/password
    if (!this.user.authData) {
      formGroupParams.username = new FormControl(this.user.username, Validators.required);
    }

    this.form = new FormGroup(formGroupParams);
  }

  onDismiss() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {

    try {

      if (this.form.invalid) {
        return this.translate.get('INVALID_FORM')
        .subscribe(str => this.showToast(str));
      }

      this.showLoadingView({ showOverlay: false });

      const formData = Object.assign({}, this.form.value);

      if (formData.name) {
        formData.name = formData.name.trim();
      }

      if (formData.username) {
        formData.username = formData.username.trim();
      }

      if (this.photo) {
        formData.photo = this.photo;
      }

      if (formData.email) {
        formData.email = formData.email.trim();
      } else {
        delete formData.email;
      }

      const user = User.getCurrent();

      await user.save(formData);
      this.showContentView();
      this.translate.get('SAVED').subscribe(str => this.showToast(str));
      this.onDismiss();

    } catch (error) {

      console.log(error);

      if (error.code === 202) {
        this.translate.get('USERNAME_TAKEN').subscribe(str => this.showToast(str));
      } else if (error.code === 203) {
        this.translate.get('EMAIL_TAKEN').subscribe(str => this.showToast(str));
      } else if (error.code === 125) {
        this.translate.get('EMAIL_INVALID').subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      }

      this.showContentView();
    }
  }

}
