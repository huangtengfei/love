angular.module('myApp.controllers', [])

    .controller('MainCtrl', ['$scope', '$cookieStore', '$location', function ($scope, $cookieStore, $location) {

        $scope.currentUser = $cookieStore.get('username');

        $scope.logout = function () {
            if (!!$cookieStore.get('username')) {
                $cookieStore.remove('username');
                $scope.currentUser = '';
                $location.path('/login');
            }
        };

    }])

    .controller('PersonListCtrl', ['$scope', 'mainService', '$cookieStore', 'DialogService',
        function ($scope, mainService, $cookieStore, DialogService) {

            $scope.init = function(){

                $scope.currentUser = $cookieStore.get('username') || '';

                mainService.getAllPersons().then(function(result) {
                    $scope.persons = result;
                })

            };

            $scope.leaveMsg = function(){

                if (!$cookieStore.get('username')) {

                    DialogService.modal({
                        key: "app.loginDialog",
                        url: "partials/login-dialog.html",
                        accept: function (result) {

                        },
                        refuse: function () {

                        }
                    });

                }else {

                    DialogService.modal({
                        key: "app.leaveMsgDialog",
                        url: "partials/leave-msg-dialog.html",
                        accept: function (result) {

                        },
                        refuse: function () {

                        }
                    });
                }
            }

            $scope.init();
        }
    ])

    .controller('MyCtrl', ['$scope', 'mainService', '$cookieStore', 
        function ($scope, mainService, $cookieStore) {

            $scope.init = function(){

                $scope.currentUser = $cookieStore.get('username') || '';

                mainService.getAllMessages().then(function(result) {
                    $scope.messages = result;
                })

            };


            $scope.init();
        }
    ])

    .controller('LeaveMsgCtrl', ['$scope', 'mainService', '$cookieStore', 'DialogService',
        function ($scope, mainService, $cookieStore, DialogService) {

            $scope.viewData = {};

            $scope.ok = function () {

                if(!$scope.viewData.message) {
                    return;
                }

                // 调后台接口保存留言，在回调中执行以下操作

                DialogService.accept("app.leaveMsgDialog");
                
            };


            $scope.cancel = function () {
                DialogService.refuse("app.leaveMsgDialog");
            };

            $scope.close = function () {
                DialogService.dismiss("app.leaveMsgDialog");
            };

        }
    ])

    .controller('LoginCtrl', ['$scope', 'mainService', '$cookieStore', 'DialogService',
        function ($scope, mainService, $cookieStore, DialogService) {

            $scope.viewData = {};

            $scope.ok = function () {

                if (!$scope.viewData.workNo || !$scope.viewData.name) {
                    return;
                };

                // 调后台接口判断工号和姓名是否匹配，如果匹配进行以下操作

                $cookieStore.put('username', $scope.viewData.name);
                DialogService.accept("app.loginDialog", $scope.viewData.name);

            };


            $scope.cancel = function () {
                DialogService.refuse("app.loginDialog");
            };

            $scope.close = function () {
                DialogService.dismiss("app.loginDialog");
            };

        }
    ])

