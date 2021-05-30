import { NgModule } from '@angular/core';
import { SettingsPage } from './settings-page';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    SettingsPage
  ]
})
export class SettingsPageModule {}
