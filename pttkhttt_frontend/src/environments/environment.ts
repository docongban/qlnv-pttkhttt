// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

const DOMAIN: string = browserWindowEnv['DOMAIN'] || '';

export const environment = {
  production: false,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',

  AUTH_SERVER: DOMAIN,
  API_GATEWAY_ENDPOINT: DOMAIN+'/api/',
  // goi den link service cua unitel chu khong phai cua laosedu
  //API_GATEWAY_ENDPOINT: 'http://localhost:8084/api/',
  // SCHOOL_NAME: 'Trường THPT Chuyên Nguyễn Huệ',
  SCHOOL_NAME: 'ໂຮງຮຽນມິດຕະພາບລາວ-ຫວຽດນາມ',
  SCHOOL_CODE: 'THPT_NH_HN',
  UNITEL_NAME:'HỆ THỐNG QUẢN LÝ GIÁO DỤC',
  timer: 120, // seconds,
  ROLE: {
    // admin
    ADMIN: 'ROLE_ADMIN', // qua ly
    GV_CN: 'ROLE_GVCN', // giao vien chu nhiem
    GV_BM: 'ROLE_GVBM', // giao vien bo mon
    TK: 'ROLE_TK', // giao vien bo mon
    HP: 'ROLE_HP', // hieu pho
    HT: 'ROLE_HT', // hieu truongzz
    PH: 'ROLE_USER', // phu huynh
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
