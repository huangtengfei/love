(function(){

    'use strict';

    angular
        .module('myApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$cookieStore', 'AvService', 'DialogService'];

    function LoginController($cookieStore, AvService, DialogService) {

        var vm = this;

        vm.isReg = false; // 是否已注册
        vm.formData = {}; // 表单数据

        vm.ok = ok; // 确定
        vm.cancel = cancel; // 取消
        vm.close = close; // 关闭

        //////////////////////// Functions ////////////////////////

        var fd = vm.formData;

        function ok() {

            if (vm.isReg) {

                if (!fd.jobNo || !fd.name || !fd.password || !fd.gender) {
                    return;
                }

                AvService.signUp(fd).then(function (result) {
                    DialogService.accept("app.loginDialog");
                    $cookieStore.put('jobno', fd.jobNo);
                    $cookieStore.put('name', fd.name);
                    $cookieStore.put('gender', fd.gender);
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
                        $cookieStore.put('gender', result.attributes.gender);
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
        }

        function cancel() {
            DialogService.refuse("app.loginDialog");
        }

        function close() {
            DialogService.dismiss("app.loginDialog");
        }
    }

})();