import { NgModule } from '@angular/core';
import { ChangePasswordPage } from './change-password';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
  declarations: [
    ChangePasswordPage,
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ChangePasswordPage
  ]
})
export class ChangePasswordPageModule {}
