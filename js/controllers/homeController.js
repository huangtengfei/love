(function(){

    'use strict';

    angular
        .module('myApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$cookieStore', 'AvService', 'DialogService'];

    function HomeController($cookieStore, AvService, DialogService) {

        var vm = this;

        vm.photos = []; // 所有照片
        vm.busy = false; // 是否正在加载中

        vm.loadMore = loadMore; // 加载下一页
        vm.like = like; // 点赞
        vm.comment = comment; // 留言

        //////////////////////// Functions ////////////////////////

        var pageSize = 12;
        var pageNumber = 1;


        function loadMore() {

            if (vm.busy) {
                return;
            }

            vm.busy = true;

            AvService.getPhotos(pageSize, pageNumber).then(function (results) {
                var newPhotos = results;
                for (var i = 0; i < newPhotos.length; i++) {
                    vm.photos.push(newPhotos[i]);
                }
                ;
                vm.busy = false;
                pageNumber++;
            })

        }

        function like(photo) {
            if (!$cookieStore.get('jobno')) {
                DialogService.modal({
                    key: "app.loginDialog",
                    url: "partials/login-dialog.html"
                });
            } else {
                AvService.updateLike(photo).then(function () {
                    photo.like = photo.like + 1;
                })
            }
        }

        function comment(photo) {
            if (!$cookieStore.get('jobno')) {
                DialogService.modal({
                    key: "app.loginDialog",
                    url: "partials/login-dialog.html"
                });
            } else {
                DialogService.modal({
                    key: "app.commentDialog",
                    url: "partials/comment-dialog.html"
                }, {photo: photo});
            }
        }

    }

})();