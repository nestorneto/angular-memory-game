(function () {
  'use strict';

  angular
    .module('memorygame')
    .directive('mgGameBoard', GameBoardDirective);

  /** @ngInject **/
  function GameBoardDirective() {
    return {
      restrict: 'E',
      scope: {
        level: '=mgLevel'
      },
      controller: GameBoardController,
      controllerAs: 'GameBoardCtrl',
      templateUrl: 'app/components/game-board/game-board.html'
    };

    function GameBoardController($scope, GameService, GAME_CARDS, $log) {

      // private variables
      var
        _gameCards = _.shuffle(GAME_CARDS),
        _totalTiles,
        self = this;

      //- public variables
      self.lines = [];

      //- private methods

      return init();

      function init() {

        setWatchers();
      }

      function setWatchers() {
        $scope.$watch('level', onLevelChange);

        // when the game is reset at current level 1 this event is emitted.
        $scope.$on('Game:Reset', generateTileLinesForCurrentLevel.bind({}, $scope.level));
      }

      /**
       * When current Level change generate new tiles based on current level
       * @param currentLevel
       */
      function onLevelChange(currentLevel) {
        if (currentLevel) {
          generateTileLinesForCurrentLevel($scope.level);
        }
      }

      /**
       * 1. Calculate the grid based on current level
       * 2. Generate the pair of tiles based on calc
       * 3. shuffle them
       * 4. Create a lines of tiles based on Grid Y
       * 5. Set this Line with tiles into a public variable
       * 6. Set into service the total of rendered tiles
       * 7. shuffle the game cards for the next reset
       *
       * @param level
       */
      function generateTileLinesForCurrentLevel(level) {
        var
          gridX = level * 2 + 2,
          gridY = gridX / 2,
          tiles = [],
          lines = [];

        _totalTiles = gridX * gridY;

        for (var i = 0; i < _totalTiles / 2; i++) {
          tiles.push(angular.copy(_gameCards[i]), angular.copy(_gameCards[i]));
        }

        tiles = _.shuffle(tiles);

        i = 0;

        for (var y = 0; y < gridY; y++) {
          lines[y] = [];
          for (var x = 0; x < gridX; x++) {
            lines[y].push(tiles[i]);
            i++;
          }
        }

        self.lines = lines;

        $log.debug('Genereted Tile Lines: ', lines);

        GameService.setRenderedTilesCount(_totalTiles);

        $log.debug('Total Tiles Genereted: ', _totalTiles);

        // shuffle _gameCards for the next reset.
        _gameCards = _.shuffle(GAME_CARDS);
      }


    }
  }

})();
