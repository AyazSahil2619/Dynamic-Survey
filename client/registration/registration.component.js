var app = angular.module('registration')

app.component('registration', {
    templateUrl: './registration/registration.template.html'
})
app.controller('registrationController', ['$scope', '$location', 'userService', 'toast', function ($scope, $location, userService, toast) {


    $scope.submit = function () {

        userService.register($scope.details)
            .then((response) => {
                    toast.success("You have been registered successfully");
                    $location.path('/login');
                },
                function (errResponse) {
                    toast.error(`${errResponse.data.detail}`);
                    console.error('Error while registering User.');
                });
    }
}])















//     userService.register($scope.details)
//         .then(
//             function () {
//                 toast.success("You have been registered successfully");
//                 $location.path('/login');
//             },
//             function (errResponse) {
//                 toast.error(`${errResponse.data.detail}`);
//                 console.error('Error while registering User.');
//             }
//         );
// };


// $scope.checkUsername = function () {

//     let data = {
//         username: $scope.details.name
//     }
//     console.log(data);
//     userService.checkUser(data)
//         .then((res) => {
//             if (res === true) {

//             } else {
//                 toast.error('Username Already Exists');
//             }
//         }).catch((err) => {
//             window.alert('something went wrong');

//         });