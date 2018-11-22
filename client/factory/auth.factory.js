angular.module('authfactory', ['ngCookies', 'myService'])
    .factory('Auth', ['$cookies', 'userService', '$rootScope', '$location',
        function ($cookies, userService, $rootScope, $location) {
            var user;
            var role;
            var authToken;
            return {
                isLoggedIn: function () {
                    return userService.islogin().then((response) => {
                        user = response.username;
                        role = response.role;
                        $rootScope.Role = role;
                        $rootScope.CurrentUser = user;
                        return (user) ? user : false;
                    }, ((err) => {
                        console.log(err, "IN LOGGED IN ERROR in auth factory");
                    }))

                },
                logoutUser: function () {
                    return userService.logout().then((response) => {
                        $cookies.remove('authToken');
                        $rootScope.Role = false;
                        $rootScope.CurrentUser = false;
                        $location.path('/login');
                    }, ((err) => {
                        console.log(err, "in logout");

                    }))
                },
                setAccessToken: function (role) {
                    $cookies.put('authToken', role);
                    // authToken = role;
                },
                getAccessToken: function () {
                   return $cookies.get('authToken');
                    // return authToken;
                },
            }
        }
    ]);














// angular.module('authfactory', ['ngCookies']).factory('Auth', ['$cookies', '$rootScope', '$location', '$q',
//     function ($cookies, $rootScope, $location, $q) {
//         var user;
//         var role;
//         var authToken;
//         return {
//             setUser: function (aUser) {
//                 $cookies.put('user', aUser.username);
//                 $cookies.put('role', aUser.role);
//             },
//             isLoggedIn: function () {
//                 user = $cookies.get('user');
//                 role = $cookies.get('role');
//                 $rootScope.Role = $cookies.get('role');
//                 $rootScope.CurrentUser = $cookies.get('user');
//                 return (user) ? user : false;
//             },
//             logoutUser: function () {
//                 $cookies.remove('user');
//                 $cookies.remove('role');
//                 $cookies.remove('authToken');
//                 // user = '';
//                 // role = '';
//                 $rootScope.Role = false;
//                 $rootScope.CurrentUser = false;
//                 $location.path('/login');
//                 return (user) ? user : false;
//             },
//             setAccessToken: function (token) {
//                 $cookies.put('authToken',token);
//                 console.log($cookies.get('authToken'),"111");
//             },
//             getAccessToken: function () {
//                 return $cookies.get('authToken');
//             },
//         }
//     }
// ]);