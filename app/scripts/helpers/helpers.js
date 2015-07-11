(function() {

'use strict';


var leadingZeroString = function(len, number) {
        var zeros = "0000000000" + number;
        return zeros.substring(zeros.length - len, zeros.length);
    };




angular.module('helpers',[])
    .factory('Helper',function() {
        return {
            leadingZeroString: leadingZeroString,
        };
    });

})();
