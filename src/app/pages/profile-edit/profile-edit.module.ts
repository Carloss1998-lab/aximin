import { NgModule } from '@angular/core';
import { ProfileEditPage } from './profile-edit';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
  declarations: [
    ProfileEditPage,
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ProfileEditPage
  ]
})
export class ProfileEditPageModule {}
