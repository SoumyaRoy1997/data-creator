// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //base_url: 'http://127.0.0.1:8000/dataCreator'
  base_url: 'https://jdamcub1xj-vpce-0138d10bd9c5561c0.execute-api.us-east-1.amazonaws.com/dev/',
  firebaseConfig : {
    apiKey: "AIzaSyB8dgvnazKRwS-AOeRCMCwb-u8f4s7PiPY",
    authDomain: "data-creator-69d3c.firebaseapp.com",
    projectId: "data-creator-69d3c",
    storageBucket: "data-creator-69d3c.appspot.com",
    messagingSenderId: "265379589066",
    appId: "1:265379589066:web:b4fc75d3a11dc8cd69bd33",
    measurementId: "G-EJ3DKS49SR"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
