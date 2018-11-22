var app = angular.module('data')

app.component('data', {
    templateUrl: './data/data.template.html'
})

app.controller("dataController", ['$scope', '$http', '$q', '$rootScope', '$routeParams', '$location', '$compile', 'userService', 'Auth', 'DTOptionsBuilder', 'DTColumnBuilder', '$timeout', 'toast',
    function ($scope, $http, $q, $rootScope, $routeParams, $location, $compile, userService, Auth, DTOptionsBuilder, DTColumnBuilder, $timeout, toast) {

        if (Auth.isLoggedIn()) {

            $scope.addDataToTable = function (tableid) {
                $location.path('/operations/' + tableid);
            }

            $scope.updatedata = function (uid) {
                $location.path('/updatedata/' + $routeParams.id + '/' + uid);
            }

            userService.getById($routeParams.id)
                .then(function (response) {
                    var colinfo = response;
                    var colinfo1 = [];
                    colinfo.forEach((item, index) => {
                        if (item.fieldname != 'uid') {
                            colinfo1.push({
                                fieldname: unescape(item.fieldname),
                                fieldtype: item.fieldtype
                            })
                        }
                    });
                    var Columns = [];
                    $scope.id = colinfo[0].tableid;

                    colinfo1.forEach((item) => {
                        Columns.push(
                            DTColumnBuilder.newColumn(`${item.fieldname}`).withTitle(`${item.fieldname}`),
                        )
                    });
                    Columns.push(DTColumnBuilder.newColumn('uid').withTitle('Actions')
                        .withOption('width', '400px').renderWith(function (data, type, full) {
                            return '<button class="btn btn-primary" ng-click="updatedata(' + full.uid + ')"><i class="fas fa-edit"></i></button>&nbsp;' +
                                '<button class="btn btn-danger" ng-click="deleteData(' + full.uid + ')"><i class="fas fa-trash-alt"></i></button>';
                        }));


                    $scope.dtColumns = Columns;

                    console.log($scope.dtColumns, "!!!!!!!")

                    $scope.dtInstanceCallback = function (dtInstance) {
                        $scope.dtInstance = dtInstance;
                    };

                    //create options
                    $scope.dtOptions = DTOptionsBuilder
                        .fromFnPromise(function () {
                            return userService.fetchTableData($routeParams.id);
                        })
                        .withPaginationType('full_numbers')
                        .withOption('createdRow', function (row, data, dataIndex) {
                            $compile(angular.element(row).contents())($scope);
                        })
                        .withDisplayLength(10);

                    //initialize the dataTable
                    angular.element('#datatable').attr('datatable', '')
                    $compile(angular.element('#datatable'))($scope)
                })


            function reloadData() {
                $scope.dtInstance.reloadData(null, false);
            };

            $scope.deleteData = function (uid) {
                userService.deleteData($routeParams.id, uid)
                    .then((response) => {
                        toast.warning('Deleted Successfully !!');
                        $scope.dtInstance.reloadData(null, false);
                    }, (errResponse) => {
                        console.log('Error while deleting data');
                    })
            }

        } else {
            $location.path('/login');
        }

    }
])



















// var app = angular.module('data')

// app.component('data', {
//     templateUrl: './data/data.template.html'
// })

// app.controller('dataController', ['$scope', '$routeParams', '$location', 'userService', 'Auth', 'DTOptionsBuilder', 'DTColumnBuilder',
//     function ($scope, $routeParams, $location, userService, Auth, DTOptionsBuilder, DTColumnBuilder) {

//         if (Auth.isLoggedIn()) {

//             $scope.addDataToTable = function (tableid) {
//                 $location.path('/operations/' + tableid);
//             }

//             $scope.fetchData = function () {
//                 userService.fetchTableData($routeParams.id)
//                     .then((response) => {
//                         $scope.information = response;
//                     }, ((errResponse) => {
//                         console.error('Error while fetching table data.');
//                     }));
//             };
//             $scope.fetchData();

//             $scope.fetchTablefield = function () {
//                 userService.getById($routeParams.id)
//                     .then((reslet columns =  $scope.colinfo.forEach((item,index) => {
//     DTColumnBuilder.newColumn(`'${item}'`).withTitle(`'${item}'`)
//   })

//   console.log(columns,"!!!!");ponse) => {
//                             $scope.colinfo = response;
//                             $scope.id = $scope.colinfo[0].tableid;
//                         },
//                         function (errResponse) {
//                             console.error('Error while fetching field.');
//                         }
//                     );
//             };
//             $scope.fetchTablefield();



//             $scope.deleteData = function (dataid) {
//                 userService.deleteData($routeParams.id, dataid)
//                     .then((response) => {
//                         $scope.fetchData();
//                     }, (errResponse) => {
//                         console.log('Error while deleting data');
//                     })
//             }

//             $scope.updatedata = function (uid) {
//                 $location.path('/updatedata/' + $routeParams.id + '/' + uid);
//             }

//         } else {
//             $location.path('/login');
//         }

//     }
// ])