(function () {

    'use strict';

    angular
        .module('myApp')
        .controller('CommentController', CommentController);

    CommentController.$inject = ['$scope', '$cookieStore', 'AvService', 'DialogService'];

    function CommentController($scope, $cookieStore, AvService, DialogService) {

        var vm = this;

        vm.formData = {}; // 表单数据

        vm.ok = ok; // 确定
        vm.cancel = cancel; // 取消
        vm.close = close; // 关闭

        //////////////////////// Functions ////////////////////////

        function ok() {

            if (!vm.formData.content) {
                return;
            }

            var comment = {
                from: $cookieStore.get('name'),
                fromNo: $cookieStore.get('jobno'),
                to: $scope.photo.name,
                toNo: $scope.photo.jobNo,
                content: vm.formData.content
            };

            AvService.postComment(comment).then(function (result) {
                DialogService.accept("app.commentDialog");
                alert("留言成功");
            });
        }


        function cancel() {
            DialogService.refuse("app.commentDialog");
        }

        function close() {
            DialogService.dismiss("app.commentDialog");
        }
    }

})();