(function() {
  'use strict';

  angular
    .module('memorygame')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/game');
  }

})();
