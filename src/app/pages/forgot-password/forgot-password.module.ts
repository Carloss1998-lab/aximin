import { NgModule } from '@angular/core';
import { ForgotPasswordPage } from './forgot-password';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ForgotPasswordPage,
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ForgotPasswordPage
  ]
})
export class ForgotPasswordPageModule {}
