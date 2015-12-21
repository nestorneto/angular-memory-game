(function() {
  'use strict';

  angular
    .module('memorygame')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
