angular.module('enaqd.filters', [])

    .filter('rawHtml', ['$sce', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    }])
    .filter('tojalali', function () {
        return function (input, format) {
            // debugger;
            // var moment = require('moment-jalaali');
            return moment(new Date(input)).format(format);
        };
    })
;
