(function(){

    'use strict';

    angular
        .module('myApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', 'mainService', '$cookieStore', 'DialogService'];

    function LoginController($scope, mainService, $cookieStore, DialogService) {
        $scope.viewData = {};
        $scope.formData = {};
        var vd = $scope.viewData,
            fd = $scope.formData;

        vd.isReg = false;

        $scope.ok = function () {

            var user = $scope.formData;

            if (vd.isReg) {

                if (!fd.jobNo || !fd.name || !fd.password || !fd.gender) {
                    return;
                }
                ;

                mainService.signUp(user).then(function (result) {
                    DialogService.accept("app.loginDialog");
                    $cookieStore.put('jobno', fd.jobNo);
                    $cookieStore.put('name', fd.name);
                    alert('注册成功');
                })

            } else {

                if (!fd.jobNo || !fd.password) {
                    return;
                }

                AV.User.logIn(fd.jobNo, fd.password, {
                    success: function (result) {
                        DialogService.accept("app.loginDialog");
                        $cookieStore.put('jobno', fd.jobNo);
                        $cookieStore.put('name', result.attributes.name);
                        alert('登录成功');
                    },
                    error: function (model, error) {
                        if (error.code === 211) {
                            alert('初次登录请先完善信息');
                        } else if (error.code === 210) {
                            alert('工号与密码不匹配哦');
                        }

                    }
                })
            }

        };


        $scope.cancel = function () {
            DialogService.refuse("app.loginDialog");
        };

        $scope.close = function () {
            DialogService.dismiss("app.loginDialog");
        };
    }

})();