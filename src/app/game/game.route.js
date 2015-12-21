(function () {
  'use strict';

  angular
    .module('memorygame')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('game', {
        url: '/game',
        templateUrl: 'app/game/game.html',
        controller: 'GameController',
        controllerAs: 'GameCtrl'
      });
  }

})();
