angular.module('myApp.controllers', [])

    .controller('MainCtrl', ['$scope', '$cookieStore', '$location', function ($scope, $cookieStore, $location) {

        // $scope.showMy = false;

        // if($cookieStore.get('jobno')){
        //     $scope.showMy = true;
        // }
        
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

            $scope.comment = function(photo){

                if (!$cookieStore.get('jobno')) {

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
                    }, {photo: photo});
                }
            }

            $scope.like = function(photo){

                if (!$cookieStore.get('jobno')) {

                    DialogService.modal({
                        key: "app.loginDialog",
                        url: "partials/login-dialog.html",
                        accept: function (result) {},
                        refuse: function () {}
                    });

                }else {
                    mainService.updateLike(photo).then(function(result){
                        photo.like = photo.like + 1;
                    })
                    
                }
            }

            $scope.init();
        }
    ])

    .controller('MyCtrl', ['$scope', 'mainService', '$cookieStore', 
        function ($scope, mainService, $cookieStore) {

            $scope.init = function(){

                $scope.viewData = {};

                $scope.viewData.username = $cookieStore.get('name');  
                $scope.viewData.userJobNo = $cookieStore.get('jobno');

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
                    name: $scope.viewData.username,
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
                    from: $cookieStore.get('name'),
                    fromNo: $cookieStore.get('jobno'),
                    to: $scope.photo.name,
                    toNo: $scope.photo.username,
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
            $scope.formData = {};
            var vd = $scope.viewData,
                fd = $scope.formData;

            vd.isReg = false;

            $scope.ok = function () {

                var user = $scope.formData;

                if(vd.isReg){

                    if (!fd.jobNo || !fd.name || !fd.password || !fd.gender) {
                        return;
                    };

                    mainService.signUp(user).then(function(result){
                        DialogService.accept("app.loginDialog");
                        $cookieStore.put('jobno', fd.jobNo);
                        $cookieStore.put('name', fd.name);
                        alert('注册成功');
                    })

                }else {

                    if(!fd.jobNo || !fd.password) {
                        return;
                    }

                    AV.User.logIn(fd.jobNo, fd.password, {
                        success: function(result){
                            DialogService.accept("app.loginDialog");
                            $cookieStore.put('jobno', fd.jobNo);
                            $cookieStore.put('name', result.attributes.name);
                            alert('登录成功');
                        },
                        error: function(model, error) {
                            if(error.code === 211){
                                alert('初次登录请先完善信息');
                            }else if(error.code === 210){
                                alert('工号与密码不匹配哦');
                            }

                        }
                    })   
                }

            };


            $scope.cancel = function () {
                DialogService.refuse("app.loginDialog");
            };

            $scope.close = function () {
                DialogService.dismiss("app.loginDialog");
            };

        }
    ])

