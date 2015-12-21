(function () {
  'use strict';

  angular
    .module('memorygame')
    .factory('GameService', GameService);

  /** @ngInject */
  function GameService($log, $q, $rootScope) {

    // private variables
    var
      _gameParams = {
        currentLevelParams: {
          totalTilesMatchesCount: 0,
          renderedTilesCount: 0,
          selectedTiles: []
        },
        currentLevel: 1,
        levelFinished: false,
        gameFinished: false,
        totalMoves: 0
      },

      // define default game params
      _defaultGameParams = angular.copy(_gameParams),
      _maxLevel = 3;

    // public methods
    return {
      setRenderedTilesCount: setRenderedTilesCount,

      registerSelectedTile: registerSelectedTile,
      getRegisteredSelectedTilesCount: getRegisteredSelectedTilesCount,

      onSelectedTilesMatch: onSelectedTilesMatch,
      clearSelectedTiles: clearSelectedTiles,

      setSelectedTilesAsCorrect: setSelectedTilesAsCorrect,
      onSelectedTilesMismatch: onSelectedTilesMismatch,

      getCurrentLevel: getCurrentLevel,
      nextLevel: nextLevel,

      addMove: addMove,
      getTotalMoves: getTotalMoves,

      gameFinished: gameFinished,
      resetGame: resetGame
    };

    // private methods

    /**
     * Set the number of rendered tiles (called into game-board directive)
     * @param number
     */
    function setRenderedTilesCount(number) {
      _gameParams.currentLevelParams.renderedTilesCount = number;
    }

    /**
     * Add a tile into selectedTiles
     * @param tile
     */
    function registerSelectedTile(tile) {
      _gameParams.currentLevelParams.selectedTiles.push(tile);
    }

    /**
     * Returns the number of selected tiles;
     */
    function getRegisteredSelectedTilesCount() {
      return _gameParams.currentLevelParams.selectedTiles.length;
    }

    /**
     * Verify if selected tiles match.
     *
     * 1. Returns a Resolved promise if they match.
     * 2. Returns a Rejected promise if they mistmatch
     */
    function onSelectedTilesMatch() {
      var match = _gameParams.currentLevelParams.selectedTiles[0].id === _gameParams.currentLevelParams.selectedTiles[1].id;
      return (match) ? $q.resolve() : $q.reject();
    }

    /**
     * 1. Set all selected tiles to isCorrect: true and isSelected: false
     * 2. Refresh the Total Tiles Matches count
     * 3. Set LevelFinished for true if Total Tiles Matches are equal with Rendered Tiles Count
     * 4. Returns levelFinished status
     * @returns {boolean}
     */
    function setSelectedTilesAsCorrect() {
      _.each(_gameParams.currentLevelParams.selectedTiles, function (tile) {
        tile.isCorrect = true;
        tile.isSelected = false;
      });

      _gameParams.currentLevelParams.totalTilesMatchesCount = _gameParams.currentLevelParams.totalTilesMatchesCount + 2;

      $log.debug('Total Tiles Matches: ', _gameParams.currentLevelParams.totalTilesMatchesCount);

      _gameParams.levelFinished = (_gameParams.currentLevelParams.totalTilesMatchesCount === _gameParams.currentLevelParams.renderedTilesCount);

      return _gameParams.levelFinished;
    }

    /**
     * Set all selected tiles isSelected: false
     */
    function onSelectedTilesMismatch() {
      _.each(_gameParams.currentLevelParams.selectedTiles, function (tile) {
        tile.isSelected = false;
      });
    }

    /**
     * Clear selected tiles array
     */
    function clearSelectedTiles() {
      _gameParams.currentLevelParams.selectedTiles = [];
      $log.debug('selected tiles cleared:', _gameParams.currentLevelParams.selectedTiles);
    }

    /**
     * Reset the gameParams to default value
     *
     * PS. if current level is 1 it should emit a event for board directive know the game was reset
     */
    function resetGame() {

      var resetOnLevel = _gameParams.currentLevel;

      _gameParams = angular.copy(_defaultGameParams);

      if (resetOnLevel === 1) {
        $rootScope.$broadcast('Game:Reset');
      }

      $log.debug('the game was reset: ', _gameParams);
    }

    /**
     * 1. Check if current level is the last level and set gameFinished status for true if it is.
     * 2. Set the currentLevelParams to defaultValues and add a level to currentLevel
     */
    function nextLevel() {
      if (_gameParams.currentLevel === _maxLevel) {
        _gameParams.gameFinished = true;
        $log.debug('game is finished');
      } else {
        _gameParams.levelFinished = false;
        _gameParams.currentLevelParams = angular.copy(_defaultGameParams.currentLevelParams);
        _gameParams.currentLevel++;
        $log.debug('Geting into next level: ', _gameParams.currentLevel);
      }
    }

    /**
     * get current level
     * @returns {number}
     */
    function getCurrentLevel() {
      return _gameParams.currentLevel;
    }

    /**
     * 1. add a move to counter
     * 2. returns a resolved promise
     */
    function addMove() {
      _gameParams.totalMoves++;
      $log.debug('Added move:', _gameParams.totalMoves);

      return $q.resolve();
    }

    /**
     * get total moves
     * @returns {number}
     */
    function getTotalMoves() {
      return _gameParams.totalMoves;
    }

    /**
     * Get gameFinished status
     * @returns {boolean}
     */
    function gameFinished() {
      return _gameParams.gameFinished;
    }

  }

})();
