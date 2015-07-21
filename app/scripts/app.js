'use strict';

/**
 * @ngdoc overview
 * @name motionPlaygroundApp
 * @description
 * # motionPlaygroundApp
 *
 * Main module of the application.
 */
angular
  .module('motionPlaygroundApp', [
    'ngCookies',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngAnimate',
    '720kb.socialshare',
    
    'canvasModule',
    'canvasModule.factories',
    'canvasModule.player',
    'windowModule',

    'helpers',

    'motionPlaygroundApp.page1',
    'motionPlaygroundApp.bike',

  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/egg', {
        templateUrl: 'views/page1.html',
        controller: 'page1Ctrl',
        controllerAs: 'page1'
      })
      .when('/bike', {
        templateUrl: 'views/bike.html',
        controller: 'bikeCtrl',
        controllerAs: 'bike'
      })
      // .when('/about', {
      //   templateUrl: 'views/about.html',
      //   controller: 'AboutCtrl',
      //   controllerAs: 'about'
      // })
      .otherwise({
        redirectTo: '/bike'
      });
  });
