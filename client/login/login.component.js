var app = angular.module('login');

app.component('login', {
    templateUrl: './login/login.template.html'
})


app.controller("loginController", ['$scope', 'userService', '$location', '$rootScope', 'Auth', 'toast',
    function ($scope, userService, $location, $rootScope, Auth, toast) {
        // $scope.style = {
        //     "margin": "50px 0 0 300px"
        // }

        $scope.login = function () {
            // $scope.status = "";
            userService.loginCheck($scope.loginDetails)
                .then((response) => {
                        if (response == 'INVALID') {
                            $location.path('/login')
                            toast.warning('INVALID USERNAME OR PASSWORD !!');
                            // $scope.status = "INVALID USERNAME OR PASSWORD";
                        } else {
                            Auth.setAccessToken(response.role);
                            if (response.role === 'admin') {
                                $location.path('/adminlogin')
                            } else if (response.role === 'user') {
                                $location.path('/userlogin')
                            }
                        }
                    },
                    function (errResponse) {
                        console.error('Error while login.', errResponse);
                    });
        }
    }
])










// if (response == 'INVALID') {
//     $location.path('/login')
//     $scope.status = "INVALID USERNAME OR PASSWORD";
// } else if (response.role == 'admin') {
//     Auth.setUser(response.username)
//     $location.path('/adminlogin')
// } else if (response.role == 'user') {
//     Auth.setUser(response.username)
//     $location.path('/userlogin')
// }else if (response == 'Already Logged In') {
//     $scope.status = response;
//     $location.path('/login')
// }