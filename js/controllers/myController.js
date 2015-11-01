(function () {

    'use strict';

    angular
        .module('myApp')
        .controller('MyController', MyController);

    MyController.$inject = ['$scope', 'mainService', '$cookieStore'];

    function MyController($scope, mainService, $cookieStore) {

        $scope.init = function () {

            $scope.viewData = {};

            $scope.viewData.username = $cookieStore.get('name');
            $scope.viewData.userJobNo = $cookieStore.get('jobno');

            mainService.getComments($scope.viewData.userJobNo).then(function (results) {
                $scope.comments = results;
            })

        };

        $scope.upload = function () {

            var fileUploadControl = angular.element(document.querySelector('#photoFileUpload'))[0];
            if (fileUploadControl.files.length > 0) {
                var file = fileUploadControl.files[0];
                var name = "avatar.jpg";
                var avFile = new AV.File(name, file);
            }

            var photo = {
                jobNo: $scope.viewData.userJobNo,
                name: $scope.viewData.username,
                photo: avFile,
                like: 0
            };

            mainService.uploadPhoto(photo).then(function (result) {
                alert('上传成功');
            });

        }

        $scope.init();
    }

})();