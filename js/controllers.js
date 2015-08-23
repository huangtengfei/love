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
                $scope.currPage = 1;

                // $scope.currentUser = $cookieStore.get('username') || '';

                // mainService.getAllPersons().then(function(result) {
                //     $scope.persons = result;
                // })
                var Photo = AV.Object.extend("Photo");
                var query = new AV.Query(Photo);

                query.count({
                    success: function(count) {
                        $scope.totalCount = count;
                        $scope.totalPage = Math.ceil($scope.totalCount/12);
                    }
                });

                query.limit(12);
                query.find({
                    success:function (results){
                        $scope.$apply(function(){
                            $scope.photos = JSON.parse(JSON.stringify(results));
                            // $scope.currPage = 1;
                        })
                    }
                })
            };

            $scope.loadMore = function(){
                
                $scope.viewData.busy = true;
                var Photo = AV.Object.extend("Photo");
                var query = new AV.Query(Photo);
                // if($scope.currPage < 2){
                    query.skip(12);
                    query.limit(12);
                    query.find({
                        success:function (results){
                            $scope.$apply(function(){
                                var newPhotos = JSON.parse(JSON.stringify(results));
                                for (var i = 0; i < newPhotos.length; i++) {
                                    $scope.photos.push(newPhotos[i]);
                                };
                                $scope.viewData.busy = false;
                                $scope.currPage++;
                            })
                        }
                    })
                // }
            }

            $scope.comment = function(){

                if (!$cookieStore.get('username')) {

                    DialogService.modal({
                        key: "app.loginDialog",
                        url: "partials/login-dialog.html",
                        accept: function (result) {

                        },
                        refuse: function () {

                        }
                    });

                }else {

                    DialogService.modal({
                        key: "app.commentDialog",
                        url: "partials/comment-dialog.html",
                        accept: function (result) {

                        },
                        refuse: function () {

                        }
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

                // $scope.currentUser = $cookieStore.get('username') || '';

                // mainService.getAllComments().then(function(result) {
                //     $scope.comments = result;
                // })

                $scope.currUserName = 'htf';
                $scope.currUserNo = '15040164';

                var Comment = AV.Object.extend("Comment");
                var query = new AV.Query(Comment);
                query.equalTo("toNo", "15040164");
                query.find({
                    success:function (results){
                        $scope.$apply(function(){
                            $scope.comments = JSON.parse(JSON.stringify(results));
                        })
                    }
                })

            };

            $scope.upload = function(){

                // var avaFile = new AV.File("avatar.jpg", $scope.photo);

                var fileUploadControl = angular.element(document.querySelector('#photoFileUpload'))[0];
                if (fileUploadControl.files.length > 0) {
                    var file = fileUploadControl.files[0];
                    var name = "avatar.jpg";
                    var avFile = new AV.File(name, file);
                }

                var Photo = AV.Object.extend("Photo");
                var photo = new Photo();

                photo.set("jobNo", $scope.currUserNo);
                photo.set("name", '高圆圆');
                photo.set('photo', avFile);
                photo.set('like', 0);

                photo.save(null, {
                    success: function(result) {
                        alert('上传成功');
                    }
                })

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

                var Comment = AV.Object.extend("Comment");
                var comment = new Comment();
                comment.set("from", "zs");
                comment.set("fromNo", "11111111");
                comment.set("to", "htf");
                comment.set("toNo", "15040164");
                comment.set("content", $scope.viewData.content);

                comment.save(null, {
                    success: function(result){
                        DialogService.accept("app.commentDialog");
                        alert("留言成功");
                    }
                })               
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

