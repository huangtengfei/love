(function () {

    'use strict';

    angular
        .module('myApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$state', '$cookieStore', 'DialogService'];

    function MainController($state, $cookieStore, DialogService) {

        var vm = this;

        vm.toMy = toMy; // 链接跳转

        //////////////////////// Functions ////////////////////////

        function toMy () {
            if (!$cookieStore.get('jobno')) {
                DialogService.modal({
                    key: "app.loginDialog",
                    url: "partials/login-dialog.html",
                    accept: function (result) {
                    },
                    refuse: function () {
                    }
                });
            } else {
                $state.go('My');
            }
        }
    }

})();