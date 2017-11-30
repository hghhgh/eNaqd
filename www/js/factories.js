angular.module('enaqd.factories', [])

// Factory for wordpress-pushserver http://codecanyon.net/item/send-mobile-push-notification-messages/6548533, if you are using other push notifications server you need to change this
    .factory('WpPushServer', function ($http, WORDPRESS_PUSH_URL) {

        // Configure push notifications server address in  www/js/config.js

        return {
            // Stores the device token in a db
            // type:  Platform type (ios, android)
            storeDeviceToken: function (type, regId) {

                console.log("Stored token for registered device with data " + 'device_token=' + regId + '&device_type=' + type);

                $http.post(WORDPRESS_PUSH_URL + 'savetoken/' +
                    '?device_token=' + regId +
                    '&device_type=' + type)
                    .success(function (data, status) {
                        console.log("Token stored, device is successfully subscribed to receive push notifications.");
                    })
                    .error(function (data, status) {
                        console.log("Error storing device token." + data + " " + status);
                    });
            }
        };
    })


    // WP CATEGORIES
    .factory('Categories', function ($http, $q, WORDPRESS_WPJSON_URL) {

        return {
            getCategories: function () {
                var deferred = $q.defer();

                // $http.jsonp(WORDPRESS_API_URL + 'get_category_index/' +
                //     '?callback=JSON_CALLBACK')
                $http.get(WORDPRESS_WPJSON_URL + 'wp/v2/categories' + '?per_page=100')
                        .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });

                return deferred.promise;
            }
        };
    })
    .factory('httpRequestInterceptor', function () {
        return {
            request: function (config) {
                var globals = (window.localStorage.enaqd_user_jwt) && window.localStorage.enaqd_user_jwt != "null" ? JSON.parse(window.localStorage.enaqd_user_jwt).cookie : null;
                if (globals) {
                    config.headers['Authorization'] = 'Bearer ' + globals;
                }

                // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                // config.headers['Accept'] = 'application/json;odata=verbose';

                return config;
            }
        };
    })
;
