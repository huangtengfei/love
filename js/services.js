angular.module('myApp.services',  ['ngResource'])

.service('mainService', ['$q',
    function ($q) {
        'use strict';

        //返回数据处理
        function handleRspData(data) {
            var defer = $q.defer(),
            errCode = data.errCode,
            errMsg = data.errMsg || '系统出了点小问题，请稍后重试！';

            switch (errCode) {
                case '0':
                defer.resolve(data.data);
                break;
                default:
                AlertService.alert({
                    title: '提示信息',
                    content: errMsg
                });
                defer.reject(errMsg);
                break;
            }

            return defer.promise;
        }

        return {

            getPhotos: function(pageSize, pageNumber) {

                var defer = $q.defer();

                var Photo = AV.Object.extend("Photo");
                var query = new AV.Query(Photo);
                query.limit(pageSize);
                query.skip((pageNumber-1)*pageSize);

                query.find({
                    success: function (results) {
                        defer.resolve(JSON.parse(JSON.stringify(results)));
                    },
                    error: function(model, error) {
                        defer.reject(error);
                    }
                })

                return defer.promise;
            },

            getComments: function(jobNo) {

                var defer = $q.defer();

                var Photo = AV.Object.extend("Comment");
                var query = new AV.Query(Photo);
                query.equalTo("toNo", jobNo);
                query.find({
                    success: function (results) {
                        defer.resolve(JSON.parse(JSON.stringify(results)));
                    },
                    error: function(model, error) {
                        defer.reject(error);
                    }
                })

                return defer.promise;
            },

            postComment: function(params) {

                var defer = $q.defer();

                var Comment = AV.Object.extend("Comment");
                var comment = new Comment();
                comment.set("from", params.from);
                comment.set("fromNo", params.fromNo);
                comment.set("to", params.to);
                comment.set("toNo", params.toNo);
                comment.set("content", params.content);

                comment.save(null, {
                    success: function(result){
                        defer.resolve(result);
                    },
                    error: function(model, error) {
                        defer.reject(error);
                    }
                }) 

                return defer.promise;
            },

            signUp: function(params) {

                var defer = $q.defer();

                var user = new AV.User();
                user.set("username", params.jobNo);
                user.set("name", params.name);
                user.set("gender", params.gender);
                user.set("password", params.password);

                user.signUp(null, {
                    success: function(result){
                        defer.resolve(result);
                    },
                    error: function(model, error) {
                        defer.reject(error);
                    }
                }) 

                return defer.promise;
            },

            login: function(params) {

                var defer = $q.defer();

                AV.User.logIn(params.jobNo, params.password, {
                    success: function(result){
                        defer.resolve(result);
                    },
                    error: function(model, error) {
                        defer.resolve(error);
                    }
                }) 

                return defer.promise;
            },

            uploadPhoto: function(params) {

                var defer = $q.defer();

                var Photo = AV.Object.extend("Photo");
                var photo = new Photo();

                photo.set("jobNo", params.jobNo);
                photo.set("name", params.name);
                photo.set('photo', params.photo);
                photo.set('like', params.like);

                photo.save(null, {
                    success: function(result){
                        defer.resolve(result);
                    },
                    error: function(model, error) {
                        defer.reject(error);
                    }
                })

                return defer.promise;
            },

            //获取全部有照片的员工信息
            getAllPersons: function (params){
                var mockData = {
                    errCode: '0',
                    errMsg: '',
                    data: [
                        {
                            name: '高圆圆',
                            photo: '/qixi/img/gyy.jpg',
                            love: 99
                        },{
                            name: '刘亦菲',
                            photo: '/qixi/img/lyf.jpg',
                            love: 89
                        },{
                            name: '高圆圆',
                            photo: '/qixi/img/gyy.jpg',
                            love: 99
                        },{
                            name: '刘亦菲',
                            photo: '/qixi/img/lyf.jpg',
                            love: 89
                        },{
                            name: '高圆圆',
                            photo: '/qixi/img/gyy.jpg',
                            love: 99
                        },{
                            name: '刘亦菲',
                            photo: '/qixi/img/lyf.jpg',
                            love: 89
                        },{
                            name: '高圆圆',
                            photo: '/qixi/img/gyy.jpg',
                            love: 99
                        },{
                            name: '刘亦菲',
                            photo: '/qixi/img/lyf.jpg',
                            love: 89
                        },{
                            name: '高圆圆',
                            photo: '/qixi/img/gyy.jpg',
                            love: 99
                        }
                    ]
                }
                return handleRspData(mockData);    
            },
            getAllComments: function (params){
                var mockData = {
                    errCode: '0',
                    errMsg: '',
                    data: []
                }
                var content = '曾经有一份真诚的爱情放在我面前，我没有珍惜，' + 
                '等我失去的时候我才后悔莫及，人世间最痛苦的事莫过于此。如果上天能够给我一个再来一次的机会，' + 
                '我会对那个女孩子说三个字：我爱你。如果非要在这份爱上加上一个期限，我希望是……一万年!---by HTF';

                for (var i = 9; i > 0; i--) {
                    mockData.data.push({content: content});
                };

                return handleRspData(mockData);    
            }
        };
}])
