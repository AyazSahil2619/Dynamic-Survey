var app = angular.module('tabledata');

app.component('tabledata', {
    templateUrl: './tabledata/tabledata.template.html'
})

app.controller('tabledataController', ['$scope', '$rootScope', '$location', 'userService', 'Auth', 'toast',
    function ($scope, $rootScope, $location, userService, Auth, toast) {
        if (Auth.isLoggedIn()) {
            $scope.showtable = true;
            $scope.ColInfo = [];


            $scope.showColoumns = function () {

                let data = {
                    tablename: $scope.tableInfo.tablename
                }
                userService.checkTablename(data).then((response) => {
                    if (response) {
                        $scope.showtable = false;
                    } else {
                        toast.error('Table with this name Exists !!');
                        $scope.showtable = true;
                    }
                }, ((errResponse) => {
                    console.log(errResponse, "Error while chcking tablename");
                }))
            }

            $scope.submit = function () {

                for (let i = 0; i < $scope.columns.length; i++) {
                    if ($scope.columns[i].ColInfo.constraints) {
                        let data = {
                            name: $scope.columns[i].ColInfo.name,
                            type: $scope.columns[i].ColInfo.type,
                            constraint: $scope.columns[i].ColInfo.constraints
                        }
                        $scope.ColInfo.push(data);
                    } else {
                        let data = {
                            name: $scope.columns[i].ColInfo.name,
                            type: $scope.columns[i].ColInfo.type
                        }
                        $scope.ColInfo.push(data);
                    }

                    console.log($scope.ColInfo, "111")
                }

                $scope.tableInfo.currentUser = $rootScope.CurrentUser;
                $scope.tableInfo.ColInfo = $scope.ColInfo;

                userService.create($scope.tableInfo)
                    .then((response) => {
                            toast.info('Table created successfully !!')
                            $location.path('/adminlogin');
                        },
                        function (errResponse) {
                            if (errResponse.data == '42701') {
                                toast.error('Sorry ! Table not created .. Each COLUMN NAME must be unique');
                                $location.path('/adminlogin');
                            } else {
                                toast.error('Sorry! Table not created')
                                console.error('Error while creating table.');

                            }
                        }
                    );
            };

            $scope.columns = [];

            $scope.addNewColumn = function () {
                var newItemNo = $scope.columns.length + 1;
                $scope.columns.push({
                    'colId': 'col' + newItemNo
                });
            };

            $scope.removeColumn = function () {
                var newItemNo = $scope.columns.length - 1;
                $scope.columns.splice(newItemNo, 1);
            }


        } else {
            $location.path('/login');
        }

    }
])









// var app = angular.module('tabledata');

// app.component('tabledata', {
//     templateUrl: './tabledata/tabledata.template.html'
// })

// app.controller('tabledataController', ['$scope', '$rootScope', '$location', 'userService', 'Auth',
//     function ($scope, $rootScope, $location, userService, Auth) {
//         if (Auth.isLoggedIn()) {
//             $scope.showtable = true;
//             $scope.ColInfo = [];
//             $scope.showColoumns = function () {
//                 $scope.showtable = false;
//             }

//             $scope.submit = function () {

//                 for (let i = 0; i < $scope.columns.length; i++) {
//                     let data = {
//                         name: $scope.columns[i].ColInfo.name,
//                         type: $scope.columns[i].ColInfo.type
//                     }
//                     $scope.ColInfo.push(data);
//                 }


//                 $scope.tableInfo.currentUser = $rootScope.CurrentUser;
//                 $scope.tableInfo.ColInfo = $scope.ColInfo;


//                 userService.create($scope.tableInfo)
//                     .then((response) => {
//                             $location.path('/adminlogin');
//                         },
//                         function (errResponse) {
//                             console.error('Error while creating table.');
//                         }
//                     );
//             };

//             $scope.columns = [];

//             $scope.addNewColumn = function () {
//                 var newItemNo = $scope.columns.length + 1;
//                 $scope.columns.push({
//                     'colId': 'col' + newItemNo
//                 });
//             };
//         } else {
//             $location.path('/login');
//         }

//     }
// ])