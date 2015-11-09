(function(){

    'use strict';

    angular.module('myApp')
        .factory('AvService', AvService);

    AvService.$inject = ['$q'];

    function AvService($q) {

        var av = {
            getPhotos: getPhotos, // 获取所有照片
            getComments: getComments, // 获取所有留言
            postComment: postComment, // 留言
            updateLike: updateLike, // 更新赞
            uploadPhoto: uploadPhoto, // 上传（更新）照片
            signUp: signUp, // 注册
            login: login // 登录
        };

        return av;

        //////////////////////// Functions ////////////////////////

        function getPhotos(pageSize, pageNumber, queryParams) {

            var defer = $q.defer();

            var Photo = AV.Object.extend("Photo");
            var query = new AV.Query(Photo);
            query.descending(queryParams.orderType);
            if(queryParams.gender){
                query.equalTo("gender", queryParams.gender);
            }
            if(queryParams.name){
                query.equalTo("name", queryParams.name);
            }
            query.limit(pageSize);
            query.skip((pageNumber - 1) * pageSize);

            query.find({
                success: function (results) {
                    defer.resolve(JSON.parse(JSON.stringify(results)));
                },
                error: function (model, error) {
                    defer.reject(error);
                }
            })

            return defer.promise;
        }

        function getComments(jobNo) {

            var defer = $q.defer();

            var Photo = AV.Object.extend("Comment");
            var query = new AV.Query(Photo);
            query.equalTo("toNo", jobNo);
            query.find({
                success: function (results) {
                    defer.resolve(JSON.parse(JSON.stringify(results)));
                },
                error: function (model, error) {
                    defer.reject(error);
                }
            })

            return defer.promise;
        }

        function postComment(params) {

            var defer = $q.defer();

            var Comment = AV.Object.extend("Comment");
            var comment = new Comment();

            comment.save(params, {
                success: function (result) {
                    defer.resolve(result);
                },
                error: function (model, error) {
                    defer.reject(error);
                }
            })

            return defer.promise;
        }

        function updateLike(photo) {

            var defer = $q.defer();

            var Photo = AV.Object.extend("Photo");
            var query = new AV.Query("Photo");

            query.get(photo.objectId, {
                success: function (result) {
                    result.set('like', photo.like + 1);
                    result.save();
                    defer.resolve(result);
                },
                error: function (model, error) {
                    defer.reject(error);
                }
            })

            return defer.promise;

        }

        function uploadPhoto(params) {

            var defer = $q.defer();

            var Photo = AV.Object.extend("Photo");
            var photo = new Photo();

            photo.save(params, {
                success: function (result) {
                    defer.resolve(result);
                },
                error: function (model, error) {
                    defer.reject(error);
                }
            })

            return defer.promise;
        }

        function signUp(params) {

            var defer = $q.defer();

            var user = new AV.User();
            user.set("username", params.jobNo);
            user.set("name", params.name);
            user.set("gender", params.gender);
            user.set("password", params.password);

            user.signUp(null, {
                success: function (result) {
                    defer.resolve(result);
                },
                error: function (model, error) {
                    defer.reject(error);
                }
            })

            return defer.promise;
        }

        function login(params) {

            var defer = $q.defer();

            AV.User.logIn(params.jobNo, params.password, {
                success: function (result) {
                    defer.resolve(result);
                },
                error: function (model, error) {
                    defer.resolve(error);
                }
            })

            return defer.promise;
        }
    }

})();