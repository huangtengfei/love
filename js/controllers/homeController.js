(function(){

    'use strict';

    angular
        .module('myApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$cookieStore', 'AvService', 'DialogService'];

    function HomeController($scope, $cookieStore, AvService, DialogService) {

        var vm = this;

        vm.photos = []; // 所有照片
        vm.busy = false; // 是否正在加载中
        vm.queryParams = {};
        vm.queryParams.orderType = 'like'; // 默认按热门排序
        vm.queryParams.gender = ''; // 默认显示全部性别
        vm.searched = false;

        vm.loadMore = loadMore; // 加载下一页
        vm.like = like; // 点赞
        vm.comment = comment; // 留言
        vm.search = search;

        //////////////////////// Functions ////////////////////////

        var pageSize = 12;
        var pageNumber = 1;

        $scope.$watch('vm.queryParams.orderType', function(nv, ov) {
            if(nv != ov) {
                vm.photos = [];
                vm.searched = false;
                vm.queryParams.name = '';
                pageNumber = 1;
                loadMore();
            }
        });

        $scope.$watch('vm.queryParams.gender', function(nv, ov) {
            if(nv != ov) {
                vm.photos = [];
                vm.searched = false;
                vm.queryParams.name = '';
                pageNumber = 1;
                loadMore();
            }
        });

        function loadMore() {

            if (vm.busy) {
                return;
            }

            vm.busy = true;

            AvService.getPhotos(pageSize, pageNumber, vm.queryParams).then(function (results) {
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

        function search() {
            vm.photos = [];
            vm.searched = true;
            pageNumber = 1;
            loadMore();
        }

    }

})();