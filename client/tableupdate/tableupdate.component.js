var app = angular.module('tableupdate')

app.component('tableupdate', {
    templateUrl: './tableupdate/tableupdate.template.html'
})

app.controller("tableupdateController", ['$scope', '$rootScope', '$location', '$routeParams', 'userService', 'Auth', 'toast',
    function ($scope, $rootScope, $location, $routeParams, userService, Auth, toast) {

        if (Auth.isLoggedIn()) {

            $scope.edit = function () {
                userService.getById($routeParams.tableid)
                    .then((response) => {
                            $scope.colinfo = response;
                            // console.log(response,"COLINFO")
                            $scope.colinfo1 = [];
                            $scope.colinfo.forEach((item, index) => {
                                if (item.fieldname != 'uid') {
                                    $scope.colinfo1.push({
                                        fieldname: unescape(item.fieldname),
                                        label: item.label,
                                        fieldtype: item.fieldtype,
                                        konstraint: item.konstraint
                                    })
                                }
                            });
                            // console.log($scope.colinfo, "BEFORE CONVERTING")
                            console.log($scope.colinfo1, "OLD COLUMNs");
                        },
                        function (errResponse) {
                            console.error('Error while fetching field data ');
                        }
                    );
            };
            $scope.edit();

            $scope.datainfo = function () {
                userService.tableInfo($routeParams.tableid)
                    .then((response) => {
                        $scope.data = response;
                        $scope.tableinfo = [];
                        $scope.oldtablename = unescape($scope.data[0].tablename);
                        $scope.data.forEach((item, index) => {
                            $scope.tableinfo.push({
                                tablename: unescape(item.tablename),
                                Description: item.Description
                            })
                        })
                        // console.log($scope.oldtablename, "oldtablename")
                    }, ((errResponse) => {
                        console.log(errResponse, "Error while fetching data ");
                    }))
            }
            $scope.datainfo();


            $scope.columns = [];

            $scope.addNewColumn = function () {
                var newItemNo = $scope.columns.length + 1;
                $scope.columns.push({
                    'colId': 'col' + newItemNo
                });
            };

            $scope.removeCol = function () {

                newItemNo = $scope.columns.length - 1;
                $scope.columns.splice(newItemNo, 1);

            }




            $scope.newColumns = [];


            $scope.submit = function () {

                // console.log($scope.columns,"1111111111111111111111");

                for (let i = 0; i < $scope.columns.length; i++) {
                    if ($scope.columns[i].ColInfo.constraints) {
                        let data = {
                            newfieldname: $scope.columns[i].ColInfo.colname,
                            newlabel: $scope.columns[i].ColInfo.label,
                            newfieldtype: $scope.columns[i].ColInfo.type,
                            newkonstraint: $scope.columns[i].ColInfo.constraints
                        }
                        $scope.newColumns.push(data);
                    } else {
                        let data = {
                            newfieldname: $scope.columns[i].ColInfo.colname,
                            newlabel: $scope.columns[i].ColInfo.label,
                            newfieldtype: $scope.columns[i].ColInfo.type,
                            newkonstraint: false
                        }
                        $scope.newColumns.push(data);
                    }
                }

                $scope.colinfo1.forEach((item) => {
                    $scope.newColumns.push(item);
                })
                $scope.tableinfo.forEach((item, index) => {
                    $scope.newColumns.push(item);
                })
                $scope.deleteColumnArray.forEach((item) => {
                    $scope.newColumns.push(item);
                })
                // console.log($scope.newColumns, "NEW COLUMNS");
                // console.log($scope.tableinfo, "TABLEINFO")

                let check = {
                    tablename: $scope.tableinfo[0].tablename
                }

                $scope.modifiedUser = {
                    user: $rootScope.CurrentUser,
                    time: Date(),
                };


                if (check.tablename == $scope.oldtablename) {
                    userService.editTable($routeParams.tableid, $scope.newColumns)
                        .then((response) => {
                            console.log("AFTER RESPONSE");
                            userService.modified($routeParams.tableid, $scope.modifiedUser)
                                .then((response) => {
                                    $location.path('/data/' + $routeParams.tableid);
                                    toast.success(`${$scope.tableinfo[0].tablename} has been EDITED successfully`);

                                }, (errResponse) => {
                                    console.log(errResponse, 'Error while modifying mastertable')
                                })
                        }, (errResponse) => {
                            console.log(errResponse, "Error while editing table")
                        })
                } else {
                    userService.checkTablename(check)
                        .then((response) => {
                            if (response) {
                                userService.editTable($routeParams.tableid, $scope.newColumns)
                                    .then((response) => {
                                        console.log("AFTER RESPONSE");
                                        userService.modified($routeParams.tableid, $scope.modifiedUser)
                                            .then((response) => {
                                                $location.path('/data/' + $routeParams.tableid);
                                                toast.success(`${$scope.tableinfo[0].tablename} has been EDITED successfully`);

                                            }, (errResponse) => {
                                                console.log(errResponse, 'Error while modifying mastertable')
                                            })
                                    }, (errResponse) => {
                                        console.log(errResponse, "Error while editing table")
                                    })
                            } else {
                                toast.success('Ooppss ! TableName must be unique');
                                $location.path('/tableupdate/' + $routeParams.tableid);

                            }
                        }, (error) => {
                            console.log(error, "Error while checking table name ")
                        })
                }
            }

            $scope.deleteColumnArray = []

            $scope.removeColumn = function (colname) {

                console.log(colname, "0000")

                for (let i = 0; i < $scope.colinfo1.length; i++) {
                    if ($scope.colinfo1[i].fieldname === colname) {
                        let deletedColumn = {};

                        deletedColumn = {
                            deletefield: $scope.colinfo1[i].fieldname
                        }
                        $scope.deleteColumnArray.push(deletedColumn);
                        $scope.colinfo1.splice(i, 1);
                    }
                }
                console.log($scope.deleteColumnArray, "Deleted column Array");

            }

        } else {
            $location.path('/login');
        }
    }
])






















// $scope.removeColumn = function (col) {
//     console.log(col, "+++++");
//     console.log($scope.colinfo1, "Before");
//     for (let i = 0; i < $scope.colinfo1.length; i++) {
//         if ($scope.colinfo1[i].fieldname == col) {
//             $scope.colinfo1.splice(i, 1);
//         }
//     }
//     console.log($scope.colinfo1, "After")
// }








// $scope.submit = function () {
//     $scope.ColInfo = [];
//     for (let i = 0; i < $scope.columns.length; i++) {
//         if ($scope.columns[i].ColInfo.primary) {
//             let data = {
//                 fieldname: $scope.columns[i].ColInfo.name,
//                 fieldtype: $scope.columns[i].ColInfo.type,
//                 constraint: $scope.columns[i].ColInfo.primary
//             }
//             $scope.ColInfo.push(data);
//         } else {
//             let data = {
//                 fieldname: $scope.columns[i].ColInfo.name,
//                 fieldtype: $scope.columns[i].ColInfo.type,
//                 constraint: false
//             }
//             $scope.ColInfo.push(data);
//         }
//     }
//     console.log($scope.ColInfo, "ADDED FIELD");
//     // console.log($scope.colinfo1, "OLD COLumnS");
//     // console.log($scope.tableinfo, "tableinfo");

//     $scope.newColinfo.forEach((item, index) => {
//         $scope.ColInfo.push(item);
//     })
//     $scope.tableinfo.forEach((item, index) => {
//         $scope.ColInfo.push(item);
//     })
//     // console.log($scope.ColInfo, "MERGED COLUMN");
//     console.log($scope.ColInfo, "added column");

//     $scope.modifiedinfo = {
//         user: $rootScope.CurrentUser,
//         time: Date(),
//     };

//     userService.editTable($routeParams.tableid, $scope.ColInfo)
//         .then((response) => {
//             console.log(response);
//     //             userService.modified($routeParams.tableid, $scope.modifiedinfo).
//     //             then((response) => {
//     //                 if (response) {
//     //                     toast.success("Table Edited Successfully");
//     //                 } else {
//     //                     toast.warning("No Change in the Table");
//     //                 }
//     //                 $location.path('/adminlogin');
//     //             }, ((errResponse) => {
//     //                 console.log('Error while modifying')
//     //             }))
//             },
//             function (errResponse) {
//                 console.error('Error while editing table.');
//             }
//         );
// }