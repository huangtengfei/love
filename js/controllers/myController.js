(function () {

    'use strict';

    angular
        .module('myApp')
        .controller('MyController', MyController);

    MyController.$inject = ['AvService', '$cookieStore'];

    function MyController(AvService, $cookieStore) {

        var vm = this;

        vm.upload = upload; // 上传照片

        //////////////////////// Functions ////////////////////////

        init();

        function init(){
            AvService.getComments($cookieStore.get('jobno')).then(function (results) {
                vm.comments = results;
            })
        }

        function upload() {

            var fileUploadControl = angular.element(document.querySelector('#photoFileUpload'))[0];
            if (fileUploadControl.files.length > 0) {
                var file = fileUploadControl.files[0];
                var name = "avatar.jpg";
                var avFile = new AV.File(name, file);
            }

            var photo = {
                jobNo: $cookieStore.get('jobno'),
                name: $cookieStore.get('name'),
                photo: avFile,
                like: 0
            };

            AvService.uploadPhoto(photo).then(function (result) {
                alert('上传成功');
            });

        }
    }

})();