var app = angular.module('updatedata')

app.component('updatedata', {
    templateUrl: './updatedata/updatedata.template.html'
})

app.controller("updatedataController", ['$scope', '$rootScope', '$location', '$routeParams', 'userService', 'Auth', 'toast',
    function ($scope, $rootScope, $location, $routeParams, userService, Auth, toast) {

        if (Auth.isLoggedIn()) {

            $scope.edit = function () {
                userService.getById($routeParams.tableid)
                    .then((response) => {
                            $scope.colinfo = response;
                            // console.log($scope.colinfo, "111TEST");

                            $scope.colinfo1 = [];
                            $scope.colinfo.forEach((item, index) => {
                                if (item.fieldname != 'uid') {
                                    $scope.colinfo1.push({
                                        fieldname: unescape(item.fieldname),
                                        label: item.label,
                                        fieldtype: item.fieldtype
                                    })
                                }
                            });
                            //console.log($scope.colinfo1, "TEST");

                        },
                        function (errResponse) {
                            console.error('Error while fetching field data ');
                        }
                    );
            };
            $scope.edit();

            $scope.datainfo = function () {
                userService.dataToEdit($routeParams.tableid, $routeParams.uid)
                    .then((response) => {

                        // $scope.data = response;
                        $scope.data1 = response;
                        $scope.data2 = [];
                        $scope.data1.forEach((item) => {
                            let datas = {};
                            for (var key in item) {
                                let keys = unescape(key)
                                datas[keys] = item[key];
                            }
                            $scope.data2.push(datas);
                        });
                        $scope.data = $scope.data2[0];
                        // console.log($scope.data, "!@#$%^&*()");
                    }, ((errResponse) => {
                        console.log(errResponse, "Error while fetching data ");
                    }))
            }
            $scope.datainfo();

            $scope.dropdownInfo = function () {
                userService.fetchddValue($routeParams.tableid)
                    .then((response) => {
                        if(response){
                            $scope.ddinfo1 = [];
                            $scope.ddinfo = response;
                            $scope.ddinfo.forEach((item, index) => {
                                $scope.ddinfo1.push({
                                    ddValue: item.options,
                                    colname: item.colname
                                })
                            });
                            console.log($scope.ddinfo1, "ddinfo1");
                        }else{
                            console.log(response);
                        }
                        },
                        function (errResponse) {
                            console.error('Error while fetching dropdown data ');
                        }
                    );
            }
            $scope.dropdownInfo();

            $scope.modifiedUser = {
                user: $rootScope.CurrentUser,
                time: Date(),
            };

            $scope.updateData = function () {

                userService.tableRowEdit($routeParams.tableid, $scope.data)
                    .then((response) => {
                        userService.modified($routeParams.tableid, $scope.modifiedUser)
                            .then((response) => {
                                toast.success('Data Updated Successfully !!');
                                $location.path('/data/' + $routeParams.tableid);
                            }, (errResponse) => {
                                console.log('Error while modifying')
                            })
                    }, (errResponse) => {
                        toast.error(`${errResponse.data.detail}`)
                        console.error('Error while updating data.');
                    });
            }
        } else {
            $location.path('/login');
        }
    }
])

// Directive to parse string to number
app.directive('stringToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseFloat(value, 10);
            });
        }
    };
});

// Directive to parse string to Date

app.directive('dateInput', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            //Angular 1.3 insert a formater that force to set model to date object, otherwise throw exception.
            //Reset default angular formatters/parsers
            ngModel.$formatters.length = 0;
            ngModel.$parsers.length = 0;
        }
    };
});


// app.directive('date', function (dateFilter) {
//     return {
//         require:'ngModel',
//         link:function (scope, elm, attrs, ctrl) {

//             var dateFormat = attrs['date'] || 'yyyy-MM-dd';

//             ctrl.$formatters.unshift(function (modelValue) {
//                 return dateFilter(modelValue, dateFormat);
//             });
//         }
//     };
// })