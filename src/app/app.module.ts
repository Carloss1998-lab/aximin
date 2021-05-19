import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';

const icons = [faFacebookF, faTwitter, faWhatsapp];
library.add(...icons);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxStripeModule } from 'ngx-stripe';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';
import { ImgFallbackModule } from 'ngx-img-fallback';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

import localeAr from '@angular/common/locales/ar';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeAr, 'ar');
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      backButtonText: '',
    }),
    NgxStripeModule.forRoot(environment.stripePublicKey),
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    ImgFallbackModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion,
    Camera,
    Device,
    Facebook,
    InAppBrowser,
    NativeAudio,
    SocialSharing,
    HeaderColor,
    SafariViewController,
    SignInWithApple,
    GooglePlus,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.fbId)
          },
        ],
      } as SocialAuthServiceConfig,
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
