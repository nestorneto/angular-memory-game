(function () {
  'use strict';

  angular
    .module('memorygame')
    .directive('mgTile', tileDirective);

  /** @ngInject */
  function tileDirective($animate, $timeout) {
    return {
      restrict: 'E',
      scope: {
        tile: '='
      },
      controller: TileController,
      controllerAs: 'TileCtrl',
      templateUrl: 'app/components/tile/tile.html',
      link: postLink
    };

    function postLink(scope, element, attributes) {
      var container = angular.element(element[0].firstChild);

      var unbindWatcher = scope.$watch('tile.isCorrect', function(isCorrect) {
        if (isCorrect) {
          $animate.addClass(container, 'match').then(function() {
            $timeout(function() { $animate.removeClass(container, 'match'); }, 300);
          });
          unbindWatcher();
        }
      });
    }

    /** @ngInject */
    function TileController($scope, GameService) {
      var
        _tile = $scope.tile,
        self = this;

      // public methods
      self.onClick = onClick;

      // private methods

      function onClick() {
        if (!_tile.isSelected && GameService.getRegisteredSelectedTilesCount() < 2) {
          _tile.isSelected = true;
          GameService.registerSelectedTile(_tile);
        }
      }

    }
  }

})();
