import { NgModule } from '@angular/core';
import { SignInPage } from './sign-in';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordPageModule } from '../forgot-password/forgot-password.module';

@NgModule({
  declarations: [
    SignInPage,
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ForgotPasswordPageModule
  ],
})
export class SignInPageModule {}
