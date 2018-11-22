var app = angular.module('admin')

app.component('admin', {
    templateUrl: './admin/admin.template.html'
})

app.controller("adminController", ['$scope', '$http', '$q', '$rootScope', '$location', '$compile', 'userService', 'Auth', 'DTOptionsBuilder', 'DTColumnBuilder', 'toast',
    function ($scope, $http, $q, $rootScope, $location, $compile, userService, Auth, DTOptionsBuilder, DTColumnBuilder, toast) {

        if (Auth.isLoggedIn()) {

            $scope.dtInstance;
            $scope.reloadData = reloadData;

            $scope.Create = function () {
                $location.path('/tabledata');
            }

            $scope.addDataToTable = function (tableid) {
                $location.path('/operations/' + tableid);
            }

            $scope.viewTableData = function (tableid) {
                $location.path('/data/' + tableid);
            }

            $scope.tableUpdate = function (tableid) {
                $location.path('/tableupdate/' + tableid);
            }

            function reloadData() {
                $scope.dtInstance.reloadData(null, false);
            };

            $scope.dtOptions = DTOptionsBuilder
                .fromFnPromise(function () {
                    return userService.getTableData();
                })
                .withPaginationType('full_numbers')
                .withOption('createdRow', function (row, data, dataIndex) {
                    $compile(angular.element(row).contents())($scope);
                })
                .withDisplayLength(10);


            $scope.dtInstanceCallback = function (dtInstance) {
                $scope.dtInstance = dtInstance;
            };


            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').withTitle('Id'),
                DTColumnBuilder.newColumn('tablename').withTitle('Table Name'),
                DTColumnBuilder.newColumn('Description').withTitle('Description'),
                DTColumnBuilder.newColumn('modifiedby').withTitle('Modified by'),
                DTColumnBuilder.newColumn('modifiedat').withTitle('Modified At'),
                DTColumnBuilder.newColumn('createdby').withTitle('Created By'),
            ];

            $scope.dtColumns.push(DTColumnBuilder.newColumn('id').withTitle('Actions')
                .withOption('width', '400px').renderWith(function (data, type, full) {
                    return '<button class="btn btn-info"  ng-click="viewTableData(' + full.id + ')"><i class="fas fa-eye"></i></button>&nbsp;' +
                        '<button class="btn btn-warning" ng-click="tableUpdate(' + full.id + ')"><i class="fas fa-edit"></i></button>&nbsp;' +
                        '<button class="btn btn-danger" ng-click="deleteTable(' + full.id + ')"><i class="fas fa-trash-alt"></i></button>';
                }));


            $scope.deleteTable = function (id) {
                userService.delete(id).then((response) => {
                    toast.warning('Deleted Successfully !!');
                    $scope.dtInstance.reloadData(null, false);
                }, (errResponse) => {
                    console.log('Error while deleting table');
                })
            }
        } else {
            $location.path('/login');
        }
    }
])





















// $scope.fetchTableData = function () {
//     userService.fetchData()
//         .then((response) => {
//             $scope.mastertable = response.data;
//         }, ((errResponse) => {
//             console.error('Error while fetching table data.');
//         }));
// };

// $scope.fetchTableData();