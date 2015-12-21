(function () {
  'use strict';

  angular
    .module('memorygame')
    .controller('GameController', GameController);

  /** @ngInject */
  function GameController($scope, GameService, $timeout, $log) {

    //- private variables
    var self = this;

    //- public methods
    self.getCurrentLevel = GameService.getCurrentLevel;
    self.getTotalMoves = GameService.getTotalMoves;
    self.resetGame = GameService.resetGame;
    self.gameFinished = GameService.gameFinished;

    // private methods

    return init();

    /**
     * when controller is rendered performs
     */
    function init() {
        setWatchers();
    }

    /**
     * set any watchers used by this controller
     */
    function setWatchers() {
      $scope.$watch(GameService.getRegisteredSelectedTilesCount, onSelectedTilesCountChange);
    }

    /**
     * When two tiles are selected, runs a stream of actions.
     *
     * 1. add a move to counter
     * 2. check if both tiles match
     * 3. if mismatch just remove unselected them
     * 4. when they match, mark them as correct (it returns a boolean with levelFinished status)
     * 5. when levelFinished is true, try to go into next level (it returns a boolean with gameFinished status)
     * 6. when gameFinished is true, just log...
     *
     * PS. It Always clear Selected Tiles in the end of flow.
     * @param count
     */
    function onSelectedTilesCountChange(count) {
      if (count === 2) {
        GameService
          .addMove()
          .then(GameService.onSelectedTilesMatch)
          .then(function() {
            $log.debug('Selected Tiles is Match');
            return $timeout(GameService.setSelectedTilesAsCorrect, 300);
          })
          .then(function(levelFinished) {
            if (levelFinished) {
              $log.debug('Level is finished');
              return $timeout(GameService.nextLevel, 800);
            }
          })
          .catch(function() {
            $log.debug('Selected Tiles Mismatch');
            return $timeout(GameService.onSelectedTilesMismatch, 500);
          })
          .finally(function() {
            GameService.clearSelectedTiles();
          });
      }
    }

  }
})();
