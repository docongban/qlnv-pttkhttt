const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};
const DOMAIN: string = browserWindowEnv['DOMAIN'] || '';
export const environment = {
	production: true,
	isMockEnabled: true, // You have to switch this, when your real back-end is done
	authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
  // AUTH_SERVER: 'https://unitel-api.migitek.com',
  // API_GATEWAY_ENDPOINT: 'https://unitel-api.migitek.com/api/',

  AUTH_SERVER: DOMAIN,
  API_GATEWAY_ENDPOINT: DOMAIN+'/api/',
  // SCHOOL_NAME: 'Trường THPT Chuyên Nguyễn Huệ',
  SCHOOL_NAME: 'ໂຮງຮຽນມິດຕະພາບລາວ-ຫວຽດນາມ',
  SCHOOL_CODE: 'THPT_NH_HN',
  UNITEL_NAME:'HỆ THỐNG QUẢN LÝ NHÀ TRƯỜNG',
  timer: 120, // seconds
  ROLE: {
    // admin
    ADMIN: 'ROLE_ADMIN', // qua ly
    GV_CN: 'ROLE_GVCN', // giao vien chu nhiem
    GV_BM: 'ROLE_GVBM', // giao vien bo mon
    TK: 'ROLE_TK', // giao vien bo mon
    HP: 'ROLE_HP', // hieu pho
    HT: 'ROLE_HT', // hieu truong
    PH: 'ROLE_USER', // phu huynh
  }
};
