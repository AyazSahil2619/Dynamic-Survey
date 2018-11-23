var myService = angular.module('myService', ['ngSimpleToast']);

myService.factory('userService', ['$http', '$q', '$location', 'toast', function ($http, $q, $location, Auth, toast) {


    return {

        // For Registration
        register: function (UserCredential) {
            return $http.post('/register', UserCredential)
                .then((response) => {
                        console.log(response, "111111in service");
                        return;
                    },
                    function (errResponse) {
                        console.error(errResponse.data.detail, 'Error while registering user');
                        return $q.reject(errResponse);
                    });
        },
        // // For checking if username exist or not for registration
        // checkUser: function (Username) {
        //     return $http.post('/checkUser', Username)
        //         .then((response) => {
        //                 console.log(response)
        //                 return response.data;
        //             },
        //             function (errResponse) {
        //                 console.error(errResponse, 'Error while creating user');
        //                 return $q.reject(errResponse);
        //             });
        // },
        // For login
        loginCheck: function (details) {
            return $http.post('/login', details)
                .then((response) => {
                        console.log(response.data.msg, "IN LOGIN CHECK");
                        return response.data.msg;
                    },
                    function (errResponse) {
                        console.error('Error while logging in users');
                        return $q.reject(errResponse);
                    }
                );
        },
        // For checking login on each request by the user
        islogin: function () {
            return $http.get('/islogin').then((response) => {
                return response.data.msg;
            }, ((err) => {
                console.log(err, "err in service response");
            }))
        },
        // For creating Table
        create: function (tableinfo) {
            console.log(tableinfo, "!!!")

            return $http.post('/create', tableinfo)
                .then((response) => {
                        return response;
                    },
                    function (errResponse) {
                        console.error(errResponse, 'Error while creating table');
                        return $q.reject(errResponse);
                    });
        },
        // For deleting the table
        delete: function (tableid) {
            return $http.delete('/delete/' + tableid)
                .then((response) => {
                        return response;
                    },
                    function (errResponse) {
                        console.error('Error while deleting user');
                        return $q.reject(errResponse);
                    }
                );
        },
        // For fetching data of particular table
        getById: function (id) {
            return $http.get('/view/' + id)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        if (errResponse.data.msg == 'INVALID') {
                            $location.path('/login');
                        }
                        console.error(errResponse, 'Error while fetching table data');
                        return $q.reject(errResponse);
                    }
                );
        },
        // For adding data(new row) to a particular Table
        updateData: function (id, data) {
            console.log(id, "ID")
            console.log(data, "DATA")

            return $http.put('/update/' + id, data)
                .then((response) => {
                        return response;
                    },
                    function (errResponse) {
                        console.error(errResponse, 'Error while adding data');
                        return $q.reject(errResponse);
                    }
                );
        },
        // FOR LOGOUT
        logout: function () {

            return $http.get('/logout')
                .then((response) => {
                        return response;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },
        // For (modified at & modified by)
        modified: function (id, data) {
            return $http.put('/modified/' + id, data)
                .then((response) => {
                        return response;
                    },
                    function (errResponse) {
                        console.error('Error while modifying');
                        return $q.reject(errResponse);
                    }
                );
        },
        // For fetching data for datatable to show the number of existing table in database

        getTableData: function () {
            var defer = $q.defer();
            $http.get('/getdata').then(function (result) {
                defer.resolve(result.data);
            }, (err) => {
                Auth.logoutUser();
                $location.path('/login');
            });
            return defer.promise;
        },

        // For deleting specific data from the table
        deleteData: function (tableid, uid) {
            return $http.delete('/deletedata/' + tableid + '/' + uid)
                .then((response) => {
                        return response;
                    },
                    function (errResponse) {
                        console.error('Error while deleting user');
                        return $q.reject(errResponse);
                    }
                );
        },
        // For fetching data from the table to be updated
        dataToEdit: function (tableid, uid) {
            return $http.get('/updatedata/' + tableid + '/' + uid)
                .then((response) => {
                        // return response.data[0];
                        return response.data;
                    },
                    function (errResponse) {
                        console.error('Error while fetching data');
                        return $q.reject(errResponse);
                    }
                );
        },
        // For editing row of a table
        tableRowEdit: function (id, data) {
            console.log("in SERVICE ", id)
            console.log("in SERVICE ", data)

            return $http.put('/updaterow/' + id, data)
                .then((response) => {
                        return response;
                    },
                    function (errResponse) {
                        console.error(errResponse, 'Error while updating data');
                        return $q.reject(errResponse);
                    }
                );
        },
        tableInfo: function (id) {
            return $http.get('/tabledata/' + id)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        console.error('Error while fetching table data');
                        return $q.reject(errResponse);
                    }
                );
        },
        editTable: function (id, data) {
            console.log(id, "TABLE ID");
            console.log(data, "DATA");
            return $http.put('/editTable/' + id, data)
                .then(
                    function (response) {
                        console.log(response.data, "AFTER RESPONSE");
                        return response.data;
                    },
                    function (errResponse) {
                        console.error(errResponse, 'Error while editing table');
                        return $q.reject(errResponse);
                    }
                );
        },
        // for fetching all data (rows) of a table
        fetchTableData: function (id) {

            var defer = $q.defer();
            $http.get('/fetchdata/' + id)
                .then(function (result) {
                    console.log(result.data, "oooooooooooooooooooooo");
                    defer.resolve(result.data);
                });
            return defer.promise;
        },

        checkTablename: function (tablename) {
            return $http.post('/checkTablename', tablename)
                .then((response) => {
                        console.log(response.data, "IN SERVICE AFTER RESPONSE");
                        return response.data;
                    },
                    function (errResponse) {
                        console.error(errResponse, 'Error while creating user');
                        return $q.reject(errResponse);
                    });
        },
        fetchddValue: function (id) {
            return $http.get('/dropdown/' + id)
                .then(
                    function (response) {
                        console.log(response, "IN SERVICE AFTER RESPONSE");
                        return response.data;
                    },
                    function (errResponse) {
                        if (errResponse.data.msg == 'INVALID') {
                            $location.path('/login');
                        }
                        console.error(errResponse, 'Error while fetching dropdown data');
                        return $q.reject(errResponse);
                    }
                );
        },
       

    }

}]);