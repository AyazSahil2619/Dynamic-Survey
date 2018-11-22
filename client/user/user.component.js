var app = angular.module('user')

app.component('user', {
    templateUrl: './user/user.template.html'
})

app.controller("userController", ['$scope', '$rootScope', '$location', '$compile', '$q', 'userService', 'Auth', 'DTOptionsBuilder', 'DTColumnBuilder',
    function ($scope, $rootScope, $location, $compile, $q, userService, Auth, DTOptionsBuilder, DTColumnBuilder) {

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

            $scope.updatetable = function (tableid) {
                $location.path('/update/' + tableid);
            }

            function reloadData () {
                $scope.dtInstance.reloadData();
            }

            $scope.dtOptions = DTOptionsBuilder
                .fromFnPromise(userService.getTableData())
                .withPaginationType('full_numbers')
                .withOption('createdRow', function (row, data, dataIndex) {
                    $compile(angular.element(row).contents())($scope);
                })
                .withDisplayLength(10);


            $scope.dtInstanceCallback = function (dtInstance) {
                // console.log('dtInstance===', dtInstance);
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
                .withOption('width', '200px').renderWith(function (data, type, full) {
                    return '<button class="btn btn-primary"  ng-click="viewTableData(' + full.id + ')"><i class="fas fa-eye"></i></button>&nbsp;' +
                        '<button class="btn btn-warning" ng-click="addDataToTable(' + full.id + ')"><i class="fas fa-plus-circle"></i></button>&nbsp;' 
                }));

        } else {
            $location.path('/login');
        }
    }
])
