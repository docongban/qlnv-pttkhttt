(function (window) {
    window.__env = window.__env || {};


    /*================================================================================================================*/
    var DOMAIN = 'http://localhost:8084';
    // var DOMAIN= 'http://13.212.112.239:8087';
    var SCHOOL_CODE = 'THPT_NH_HN';

    window.__env.DOMAIN = DOMAIN;
    window.__env.SCHOOL_CODE = SCHOOL_CODE;

    console.log("DOMAIN: " + window.__env.DOMAIN);
    console.log("SCHOOL_CODE: " + window.__env.SCHOOL_CODE);

    // Whether or not to enable production mode
    // Setting this to production will disable console output
    window.__env.production = true;
}(this));
