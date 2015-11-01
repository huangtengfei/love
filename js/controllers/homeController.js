(function(){

    'use strict';

    angular
        .module('myApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'mainService', '$cookieStore', 'DialogService'];

    function HomeController($scope, mainService, $cookieStore, DialogService) {

        $scope.init = function () {

            $scope.viewData = {};
            $scope.viewData.busy = false;
            $scope.photos = [];
            $scope.pageSize = 12;
            $scope.pageNumber = 1;

        };

        $scope.loadMore = function () {

            if ($scope.viewData.busy) {
                return;
            }

            $scope.viewData.busy = true;

            mainService.getPhotos($scope.pageSize, $scope.pageNumber).then(function (results) {
                var newPhotos = results;
                for (var i = 0; i < newPhotos.length; i++) {
                    $scope.photos.push(newPhotos[i]);
                }
                ;
                $scope.viewData.busy = false;
                $scope.pageNumber++;
            })

        }

        $scope.comment = function (photo) {

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

                DialogService.modal({
                    key: "app.commentDialog",
                    url: "partials/comment-dialog.html",
                    accept: function (result) {
                    },
                    refuse: function () {
                    }
                }, {photo: photo});
            }
        }

        $scope.like = function (photo) {

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
                mainService.updateLike(photo).then(function (result) {
                    photo.like = photo.like + 1;
                })

            }
        }

        $scope.init();

    }

})();