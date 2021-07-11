// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverUrl: 'http://localhost:1337/api',
  appUrl: 'https://www.missebo.fr',
  appImageUrl: 'https://www.missebo.fr/assets/imgs/missebo.png',
  appId: 'com.calebaguida.aximin',
  fbId: '517337643012906',
  stripePublicKey: 'pk_test_51IsCV7IQQMVaWvxeBLwvoacTtudt69nRZO1FxKaVNwMPcB2NHoccQ76vubjM8r1QZVVVDJ3zZw4I4cZgBzzKWj8X00ZXjqZBV1',
  androidHeaderColor: '#222428',
  defaultLang: 'fr',
  googleClientId: '1008548436945-jibhcdcr2qet0dqjqmmne9puajmn7a1f.apps.googleusercontent.com',
  currency: {
    code: 'USD',
    display: 'symbol',
    digitsInfo: '1.2-2',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
 //import 'zone.js/dist/zone-error'; // OK