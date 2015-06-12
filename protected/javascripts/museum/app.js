var app = angular.module('App', ['angular.filter', 'ngResource', 'ngRoute',
    'ngTagsInput', 'ui.bootstrap', 'pascalprecht.translate']);

app.config(['$routeProvider', '$translateProvider',
    function ($routeProvider, $translateProvider) {
        $routeProvider.when('/model/add', {
            templateUrl: '/securedassets/partials/model/addModel.html',
            reloadOnSearch: false
        }).when('/model/:modelId', {
            templateUrl: '/securedassets/partials/viewer/viewer.html',
            reloadOnSearch: false
        }).when('/browser', {
            templateUrl: '/securedassets/partials/browser/browser.html',
            reloadOnSearch: false
        }).when('/admin/', {
            redirectTo: '/admin/activateUser'
        }).when('/admin/:page', {
            templateUrl: '/securedassets/partials/admin/admin.html',
            reloadOnSearch: false
        }).otherwise({
            redirectTo: '/model/1'
        });

        $translateProvider.useStaticFilesLoader({
            prefix: '/securedassets/javascripts/museum/i18n/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('sv');
    }]);

app.controller('ViewerController', [
    '$scope',
    '$resource',
    '$http',
    '$translate',
    '$routeParams',
    function ($scope, $resource, $http, $translate, $routeParams) {
        _this = this;

        _this.model = {};
        _this.tags = [];

        _this.init = function () {
            $http.get('/model/' + $routeParams.modelId).then(
                function (result) {
                    _this.model = result.data;


                    $http.get('/file/model/' + _this.model.id).then(function (result) {
                        var objectPredicate = function (file) {
                            return file.type === 'object';
                        };

                        var texturePredicate = function (file) {
                            return file.type === 'texture';
                        };

                        _this.model.object = result.data.filter(objectPredicate)[0].getUrl;
                        _this.model.texture = result.data.filter(texturePredicate)[0].getUrl;

                        var viewer = new Viewer("#canvas-place-holder",
                            _this.model.object, _this.model.texture);
                        viewer.initCanvas();

                        $("#reset-view").click(function () {
                            viewer.resetView();
                        });

                        $("#toogle-bounding-box").click(function () {
                            viewer.toogleBoundingBox();
                        });

                        $("#toogle-pan-Y").click(function () {
                            viewer.tooglePanY();
                        });
                    });

                    $http.get('/tags/model/' + _this.model.id).then(function (result) {
                        _this.tags = result.data;
                    });


                    tinyMCE.remove();

                    var tiny = tinymce.init({
                        selector: "#text",
                        language: museumCookie["languageCode"] === "en" ? "en"
                            : "sv_SE",
                        height: "300px",
                        entity_encoding: "raw",
                        menubar: false,
                        statusbar: false,
                        toolbar: false,
                        readonly: true,
                        setup: function (editor) {
                            editor.on('init', function () {
                                $(".mce-panel").css({
                                    'border-width': '0px'
                                });
                                tinymce.editors[0].setContent($('<textarea />').html(
                                    _this.model.text).text().replace(/\n/ig, "<br>"));
                            });
                        }

                    });
                });

        };

    }

]);

app.controller('AdminController', ['$scope', '$resource', '$http',
    '$translate', '$routeParams',
    function ($scope, $resource, $http, $translate, $routeParams) {
        _this = this;

        _this.init = function () {
            _this.page = $routeParams.page;
        };

    }

]);

app.controller('BrowserAppController', ['$scope', '$resource', '$http',
    '$translate', function ($scope, $resource, $http, $translate) {
        _this = this;

        // TODO: Similar code as viewer break out some to service

        _this.models = [];
        _this.tags = [];

        _this.init = function () {
            var assignModelAndGetFiles = function (model) {
                _this.models[model.id] = model;
                $http.get('/file/model/' + model.id).then(function (result) {
                    var thumbnailPredicate = function (file) {
                        return file.type === 'thumbnail';
                    };

                    _this.models[model.id].thumbnail = result.data.filter(thumbnailPredicate)[0].getUrl;
                });
            };

            $http.get('/model').then(function (result) {
                result.data.forEach(assignModelAndGetFiles);
            });
        };

        _this.loadTags = function (modelId) {
            $http.get('/tags/model/' + modelId).then(function (result) {
                _this.tags[modelId] = result.data;
            });
        };

    }

]);

app.controller('ModelAddController', [
    '$scope',
    '$resource',
    '$http',
    '$translate',
    function ($scope, $resource, $http, $translate) {
        _this = this;

        _this.model = {};
        _this.alerts = [];

        _this.init = function () {

            tinyMCE.remove();

            tinymce.init({
                selector: "#text",
                statusbar: true,
                force_p_newlines: false,
                force_br_newlines: true,
                convert_newlines_to_brs: false,
                remove_linebreaks: true,
                language: museumCookie["languageCode"] === "en" ? "en" : "sv_SE",
                height: "300px",
                entity_encoding: "raw",
                setup: function (editor) {
                    editor.on('init', function () {
                        tinymce.editors[0].setContent($('<textarea />').html(
                            '').text());
                    });
                }
            });

            $("#object-file").on('change', function () {
                $scope.$apply();
            });

            $("#texture-file").on('change', function () {
                $scope.$apply();
            });

            $("#thumbnail-file").on('change', function () {
                $scope.$apply();
            });

        }

        _this.loadTags = function ($query) {
            return $http.get('/tags?query=' + $query);
        };

        _this.valid = function (valid) {
            if (valid &&
                document.getElementById('object-file').files.length > 0 &&
                document.getElementById('texture-file').files.length > 0 &&
                document.getElementById('thumbnail-file').files.length > 0
            ) {
                return true;
            } else {
                return false;
            }
        }

        _this.submit = function () {
            if (_this.model.tags.length === 0) {
                delete _this.model.tags;
            }

            _this.model.text = tinymce.DOM.encode(tinymce.editors[0].getContent()
                .replace(new RegExp('\r?\n', 'g'), ''));

            $http.post('/model', _this.model).success(
                function (data, status, headers, config) {
                    _this.uploadFile(document.getElementById('object-file').files[0], data.id, 'object');
                    _this.uploadFile(document.getElementById('texture-file').files[0], data.id, 'texture');
                    _this.uploadFile(document.getElementById('thumbnail-file').files[0], data.id, 'thumbnail');
                    _this.addAlert({
                        msg: data,
                        type: 'success'
                    });
                }).error(function (data, status, headers, config) {
                    _this.addAlert({
                        msg: data,
                        type: 'danger'
                    });
                });
            ;
        }

        _this.uploadFile = function (file, modelId, type) {

            var sendToS3 = function (model) {
                $http.put(model.putUrl, file.slice()).success(
                    function (data, status, headers, config) {
                        console.log("Uploaded to s3: " + model.id)
                    }).error(function (data, status, headers, config) {
                        console.log("data" + data, "status" + status, "headers"
                            + headers, "config" + config);
                    });
            };

            var filePost = {
                modelId: modelId,
                type: type
            };


            $http.post("/file", filePost).success(
                function (model, status, headers, config) {
                    sendToS3(model);
                }).error(function (data, status, headers, config) {
                    console.log("data" + data, "status" + status, "headers"
                        + headers, "config" + config);
                });
        }

        _this.addAlert = function (alert) {
            _this.alerts.push(alert);
        };

        _this.closeAlert = function (index) {
            _this.alerts.splice(index, 1);
        };

    }]);

app.factory('User', ['$resource', function ($resource) {
    return $resource('/user/:email', null, {
        'update': {
            method: 'PUT'
        }
    });
}]);

app.controller('MenuController', ['$scope', '$location',
    function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }]);

app.controller('ActivateUserController', ['$scope', '$resource', '$http',
    'User', function ($scope, $resource, $http, User) {
        $http.get('/user').success(function (data) {
            $scope.users = data;
        });
        $http.get('/role').success(function (data) {
            $scope.roles = data;
        });
        $scope.selectUser = function (user) {
            $scope.selectedUser = user;
            $http.get('/organization').success(function (data) {
                $scope.organizations = data;
            });
        }
        $scope.selectOrganization = function (organization) {
            $scope.selectedOrganization = organization;
        }
        $scope.selectRole = function (role) {
            $scope.selectedRole = role;
        }
        $scope.updateUser = function () {
            var user = new User($scope.selectedUser.email);
            User.update({
                email: $scope.selectedUser.email
            }, {
                organizationId: $scope.selectedOrganization.id,
                role: $scope.selectedRole.name
            });
        }
    }]);

app.controller('AdminOrganizationController', ['$scope', '$http',
    function ($scope, $http) {
        $scope.submitForm = function () {
            var data = angular.toJson($scope.formData);
            $http.post('/organization', data).success(function (response) {
                $scope.response = response;
                alert('ok');
            }).error(function (error) {
                $scope.error = error;
                alert('error');
            });
        }
    }]);
