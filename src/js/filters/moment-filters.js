testit.filter('momentFromNow', ['moment', function(moment) {
    'use strict';
    return date => {
        if(date) {
            return moment(date).fromNow();
        } else {
            return 'Invalid date';
        }
    };
}]);
