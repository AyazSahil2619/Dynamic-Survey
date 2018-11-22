angular.module('MyApp', [
    'ngRoute',
    'ngCookies',
    'ngSimpleToast',
    'myService',
    'authfactory',
    'login',
    'logout',
    'registration',
    'admin',
    'user',
    'tabledata',
    'operations',
    'data',
    'updatedata',
    'tableupdate',
    'datatables'
]).config(function (toastProvider) {
    toastProvider.config({
        autoClose: true,
        duration: 5000
    });
});