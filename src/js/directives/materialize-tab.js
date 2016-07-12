testit.directive('materializeTab', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).tabs();
        }
    };
});