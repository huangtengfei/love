(function () {

    'use strict';

    angular
        .module('myApp')
        .controller('CommentController', CommentController);

    CommentController.$inject = ['$scope', 'mainService', '$cookieStore', 'DialogService'];

    function CommentController($scope, mainService, $cookieStore, DialogService) {
        $scope.viewData = {};

        $scope.ok = function () {

            if (!$scope.viewData.content) {
                return;
            }

            var comment = {
                from: $cookieStore.get('name'),
                fromNo: $cookieStore.get('jobno'),
                to: $scope.photo.name,
                toNo: $scope.photo.username,
                content: $scope.viewData.content
            };

            mainService.postComment(comment).then(function (result) {
                DialogService.accept("app.commentDialog");
                alert("留言成功");
            });
        };


        $scope.cancel = function () {
            DialogService.refuse("app.commentDialog");
        };

        $scope.close = function () {
            DialogService.dismiss("app.commentDialog");
        };
    }

})();