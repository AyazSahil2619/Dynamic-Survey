var app = angular.module('logout');

app.component('logout', {
    templateUrl: './logout/logout.template.html'
})


app.controller("logoutController", ['$scope', 'userService', '$location', '$rootScope', 'Auth',
    function ($scope, userService, $location, $rootScope, Auth) {

        if (Auth.isLoggedIn()) {

            $scope.logout = function () {
                Auth.logoutUser();
            //     userService.logout()
            //         .then((response) => {
            //             Auth.logoutUser();
            //         }, (errResponse) => {
            //             console.log(errResponse);
            //             // $location.path('/login');
            //         })
            }

            $scope.logout();

        } else {
            $location.path('/login');
        }
    }
])