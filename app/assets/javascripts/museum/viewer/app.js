var myApp = angular.module('ViewerApp', [ 'angular.filter' ,'ngResource', 'ngRoute',
    'ngTagsInput', 'ui.bootstrap', 'pascalprecht.translate']);

myApp.config([ '$routeProvider', '$translateProvider',
    function($routeProvider, $translateProvider) {
      $routeProvider.when('/model/:modelId', {
        templateUrl : '/assets/partials/viewer/viewer.html',
        reloadOnSearch : false
      }).otherwise({
        redirectTo : '/model/1'
      });

      $translateProvider.useStaticFilesLoader({
        prefix : '/assets/javascripts/museum/i18n/locale-',
        suffix : '.json'
      });
      $translateProvider.preferredLanguage('sv');
    } ]);

myApp.controller('ViewerController', [ '$scope', '$resource', '$http',
    '$translate', '$routeParams', function($scope, $resource, $http, $translate, $routeParams) {
      _this = this;

      _this.model = {};
      _this.tags = [];

      _this.init = function() {
        $http.get('/model/' + $routeParams.modelId).then(function(result) {
          _this.model = result.data;
          
          $http.get('/tags/model/' + _this.model.id).then(function(result) {
            _this.tags = result.data;
          });
          
          var viewer = new Viewer("#canvas-place-holder", "/uploads/" + _this.model.f1, "/uploads/" + _this.model.f2);
          viewer.initCanvas();
          
          $( "#reset-view" ).click(function() {
            viewer.resetView();
         });
             
         $( "#toogle-bounding-box" ).click(function() {
            viewer.toogleBoundingBox();
         });
         
         $( "#toogle-pan-Y" ).click(function() {
            viewer.tooglePanY();
         });
         
         tinymce.init({
             selector: "#text",
             language: museumCookie["languageCode"] === "en" ? "en" : "sv_SE",
             height: "300px",
             entity_encoding: "raw",
             menubar:false,
             statusbar: false,
             toolbar: false,
             readonly: true,
             setup : function(editor) {
             editor.on('init', function() {
               $(".mce-panel").css({ 'border-width': '0px'});
                 tinymce.editors[0].setContent($('<textarea />').html(_this.model.text).text().replace(/\n/ig,"<br>"));
             });
             }
             
             });
        });
     
      };

    }

]);
