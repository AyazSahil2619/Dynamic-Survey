angular.module('MyApp').config(['$routeProvider', '$locationProvider',
    function config($routeProvider, $locationProvider) {

        $routeProvider.
        when('/login', {
                template: '<login></login>',
                authenticated: false
            })
            .when('/logout', {
                template: '<logout></logout>',
                authenticated: false
            })
            .when('/registration', {
                template: '<registration></registration>',
                authenticated: false
            })
            .when('/adminlogin', {
                template: '<admin></admin>',
                authenticated: 'admin',
            })
            .when('/userlogin', {
                template: '<user></user>',
                authenticated: 'user',
            })
            .when('/tabledata', {
                template: '<tabledata></tabledata>',
                authenticated: 'admin',
            })
            .when('/operations/:id', {
                template: '<operations></operations>',
                authenticated: false
            })
            .when('/data/:id', {
                template: '<data></data>',
                authenticated: false
            })
            .when('/updatedata/:tableid/:uid', {
                template: '<updatedata></updatedata>',
                authenticated: false
            })
            .when('/tableupdate/:tableid', {
                template: '<tableupdate></tableupdate>',
                authenticated: 'admin',
            })
            .otherwise({
                redirectTo: '/login',
                authenticated: false
            });
        // $locationProvider.html5Mode(true);
    }
]).run(['$rootScope', '$location', 'Auth', 'toast', function ($rootScope, $location, Auth, toast) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        if (next.$$route && next.$$route.authenticated) {
            var userAuth = Auth.getAccessToken();
            console.log(userAuth,"USERAUTH");
            if (next.$$route.authenticated == userAuth) {
            } else {
                $location.path(`/${userAuth}login`);
                toast.error('YOU ARE NOT AUTHORIZED FOR THE REQUESTED PAGE');
            }
        }
    })
}])








// angular.module('MyApp').
// run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
//     $rootScope.$on('$routeChangeStart', function (event) {

//         if (!Auth.isLoggedIn()) {
//             console.log('DENY');
//             // $rootScope.showlogin = true;
//             $rootScope.Role = false;
//            $location.path('/login');
//         }
//         else {
//             console.log('ALLOW');
//             // $rootScope.showlogin = false;
//         }
//     });
// }]);






