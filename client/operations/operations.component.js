var app = angular.module('operations')

app.component('operations', {
    templateUrl: './operations/operations.template.html'
})
app.controller('operationsController', ['$scope', '$rootScope', '$location', '$routeParams', 'userService', 'Auth', 'toast',
    function ($scope, $rootScope, $location, $routeParams, userService, Auth, toast) {


        if (Auth.isLoggedIn()) {

            $scope.edit = function () {
                userService.getById($routeParams.id)
                    .then((response) => {
                            $scope.colinfo1 = [];
                            $scope.colinfo = response;
                            $scope.colinfo.forEach((item, index) => {
                                if (item.fieldname != 'uid') {
                                    $scope.colinfo1.push({
                                        fieldname: unescape(item.fieldname),
                                        fieldtype: item.fieldtype
                                    })
                                }
                            });
                            $scope.id = response[0].tableid;

                        },
                        function (errResponse) {

                            console.error('Error while fetching field data ');
                        }
                    );
            };
            $scope.edit();

            $scope.data = {};
            $scope.tableinfo = {
                user: $rootScope.CurrentUser,
                time: Date(),
            };

            $scope.submit = function () {
                userService.updateData($routeParams.id, $scope.data)
                    .then((response) => {
                        userService.modified($routeParams.id, $scope.tableinfo)
                            .then((response) => {
                                toast.info('Added data to the table successfully');
                                $location.path('/data/' + $scope.id);
                            }, ((errResponse) => {
                                console.log('Error while modifying')
                            }))
                    }, ((errResponse) => {
                        toast.error(`${errResponse.data.detail}`);
                        console.error('Error while adding data.');
                    }));
            };
        } else {
            $location.path('/login')
        }

    }
])