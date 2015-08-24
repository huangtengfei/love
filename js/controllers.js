angular.module('myApp.controllers', [])

    .controller('MainCtrl', ['$scope', '$cookieStore', '$location', function ($scope, $cookieStore, $location) {

        $scope.currentUser = $cookieStore.get('username');

        $scope.logout = function () {
            if (!!$cookieStore.get('username')) {
                $cookieStore.remove('username');
                $scope.currentUser = '';
                $location.path('/login');
            }
        };

    }])

    .controller('PersonListCtrl', ['$scope', 'mainService', '$cookieStore', 'DialogService',
        function ($scope, mainService, $cookieStore, DialogService) {

            $scope.init = function(){

                $scope.viewData = {};
                $scope.viewData.busy = false;
                $scope.photos = [];
                $scope.pageSize = 12;
                $scope.pageNumber = 1;

            };

            $scope.loadMore = function(){

                if($scope.viewData.busy) {
                    return;
                }
                
                $scope.viewData.busy = true;

                mainService.getPhotos($scope.pageSize, $scope.pageNumber).then(function(results){
                    var newPhotos = results;
                    for (var i = 0; i < newPhotos.length; i++) {
                        $scope.photos.push(newPhotos[i]);
                    };
                    $scope.viewData.busy = false;
                    $scope.pageNumber++;
                })

            }

            $scope.comment = function(){

                if (!$cookieStore.get('username')) {

                    DialogService.modal({
                        key: "app.loginDialog",
                        url: "partials/login-dialog.html",
                        accept: function (result) {},
                        refuse: function () {}
                    });

                }else {

                    DialogService.modal({
                        key: "app.commentDialog",
                        url: "partials/comment-dialog.html",
                        accept: function (result) {},
                        refuse: function () {}
                    });
                }
            }

            $scope.init();
        }
    ])

    .controller('MyCtrl', ['$scope', 'mainService', '$cookieStore', 
        function ($scope, mainService, $cookieStore) {

            $scope.init = function(){

                $scope.viewData = {};

                $scope.viewData.username = 'htf';
                $scope.viewData.userJobNo = '15040164';

                mainService.getComments($scope.viewData.userJobNo).then(function(results){
                    $scope.comments = results;
                })

            };

            $scope.upload = function(){

                var fileUploadControl = angular.element(document.querySelector('#photoFileUpload'))[0];
                if (fileUploadControl.files.length > 0) {
                    var file = fileUploadControl.files[0];
                    var name = "avatar.jpg";
                    var avFile = new AV.File(name, file);
                }

                var photo = {
                    jobNo: $scope.viewData.userJobNo,
                    name: '高圆圆',
                    photo: avFile,
                    like: 0
                };

                mainService.uploadPhoto(photo).then(function(result){
                    alert('上传成功');
                }); 

            }


            $scope.init();
        }
    ])

    .controller('CommentCtrl', ['$scope', 'mainService', '$cookieStore', 'DialogService',
        function ($scope, mainService, $cookieStore, DialogService) {

            $scope.viewData = {};

            $scope.ok = function () {

                if(!$scope.viewData.content) {
                    return;
                }

                var comment = {
                    from: "gyy",
                    fromNo: '11111111',
                    to: 'htf',
                    toNo: '15040164',
                    content: $scope.viewData.content
                };

                mainService.postComment(comment).then(function(result){
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
    ])

    .controller('LoginCtrl', ['$scope', 'mainService', '$cookieStore', 'DialogService',
        function ($scope, mainService, $cookieStore, DialogService) {

            $scope.viewData = {};

            $scope.ok = function () {

                if (!$scope.viewData.jobNo || !$scope.viewData.name) {
                    return;
                };

                // 调后台接口判断工号和姓名是否匹配，如果匹配进行以下操作

                $cookieStore.put('username', $scope.viewData.name);
                DialogService.accept("app.loginDialog", $scope.viewData.name);

            };


            $scope.cancel = function () {
                DialogService.refuse("app.loginDialog");
            };

            $scope.close = function () {
                DialogService.dismiss("app.loginDialog");
            };

        }
    ])

