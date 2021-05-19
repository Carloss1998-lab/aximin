import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfilePage } from './profile-page';
import { SharedModule } from '../../shared.module';
import { SignInPageModule } from '../sign-in/sign-in.module';
import { ChangePasswordPageModule } from '../change-password/change-password.module';
import { SettingsPageModule } from '../settings-page/settings-page.module';
import { ProfileEditPageModule } from '../profile-edit/profile-edit.module';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePage
      }
    ]),
    SharedModule,
    SignInPageModule,
    ChangePasswordPageModule,
    SettingsPageModule,
    ProfileEditPageModule
  ],
})
export class ProfilePageModule {}
