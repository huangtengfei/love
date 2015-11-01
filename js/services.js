angular.module('myApp')
    .service('mainService', mainService);

mainService.$inject = ['$q'];

function mainService($q) {

    return {

        getPhotos: function (pageSize, pageNumber) {

            var defer = $q.defer();

            var Photo = AV.Object.extend("Photo");
            var query = new AV.Query(Photo);
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
        },

        getComments: function (jobNo) {

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
        },

        postComment: function (params) {

            var defer = $q.defer();

            var Comment = AV.Object.extend("Comment");
            var comment = new Comment();
            comment.set("from", params.from);
            comment.set("fromNo", params.fromNo);
            comment.set("to", params.to);
            comment.set("toNo", params.toNo);
            comment.set("content", params.content);

            comment.save(null, {
                success: function (result) {
                    defer.resolve(result);
                },
                error: function (model, error) {
                    defer.reject(error);
                }
            })

            return defer.promise;
        },

        updateLike: function (photo) {

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

        },

        signUp: function (params) {

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
        },

        login: function (params) {

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
        },

        uploadPhoto: function (params) {

            var defer = $q.defer();

            var Photo = AV.Object.extend("Photo");
            var photo = new Photo();

            photo.set("jobNo", params.jobNo);
            photo.set("name", params.name);
            photo.set('photo', params.photo);
            photo.set('like', params.like);

            photo.save(null, {
                success: function (result) {
                    defer.resolve(result);
                },
                error: function (model, error) {
                    defer.reject(error);
                }
            })

            return defer.promise;
        }
    };
}
