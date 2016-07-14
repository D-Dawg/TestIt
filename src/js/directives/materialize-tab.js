testit.directive('materializeTab', function() {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).tabs();
        }
    };
});