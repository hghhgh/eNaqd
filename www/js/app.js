// Ionic Starter App

angular.module('underscore', [])
    .factory('_', function () {
        return window._; // assumes underscore has already been loaded on the page
    });

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('enaqd', [
    'ionic',
    'ngCordova',
    'enaqd.directives',
    'enaqd.controllers',
    // 'enaqd.views',
    'enaqd.services',
    'enaqd.config',
    'enaqd.factories',
    'enaqd.filters',
    // 'ngMap',
    // 'angularMoment',
    'underscore',
    'ngTagsInput',
    // 'base64'
    // 'youtube-embed',
    // "ionic-multiselect",
    'ionic-fancy-select',
    'ngPersian'
])

    .run(function ($ionicPlatform, $ionicPopup, $cordovaToast, $cordovaNetwork, AuthServiceWPJ, AuthService, $rootScope, $state, PushNotificationsService) {

        $ionicPlatform.ready(function () {
            console.log('ionic ready');

            var myPopup;
            // Check for network connection
            var CheckInternetConnection = function () {
                if (window.Connection && navigator.connection.type == Connection.NONE) {
                    myPopup = $ionicPopup.alert({
                        title: 'اخطار !',
                        template: "<span style='font-family: VazirLight,sans-serif; text-align: right'>متاسفانه اتصال به اینترنت برقرار نیست، مجدد تلاش کنید</span>",
                        cssClass: 'confirmpopup',
                        buttons: [{
                            text: '<b>باشه</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (ionic.Platform.isIOS()) {
                                    if (navigator.connection.type == Connection.NONE) {
                                        $cordovaToast.showLongBottom('ابتدا باید به اینترنت متصل شوید.');
                                        e.preventDefault();
                                    }
                                }
                                if (ionic.Platform.isAndroid()) {
                                    console.log("and click");
                                    if (navigator.connection.type == Connection.NONE) {
                                        $cordovaToast.showLongBottom('ابتدا باید به اینترنت متصل شوید.');
                                        e.preventDefault();
                                    }
                                }
                            }
                        }]
                    });
                }
            }
            CheckInternetConnection();

            $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                // $cordovaToast.showLongBottom('اتصال به اینترنت برقرار شد.');
                myPopup.close();
                document.location.href = 'index.html';

            })
            $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                CheckInternetConnection();
                $cordovaToast.showLongBottom('اتصال به اینترنت قطع شد !');
            })




        });

        $ionicPlatform.on("deviceready", function () {
            console.log('deviceready')

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.hide();
            }
            ionic.Platform.isFullScreen = true;

            AuthService.userIsLoggedIn().then(function (response) {
                AuthServiceWPJ.userIsLoggedIn().then(function (responseWPJ) {

                if (response === true && responseWPJ === true) {
                    //update user avatar and go on
                    AuthService.updateUserAvatar();

                    $state.go('app.home');
                }
                else {
                    $state.go('login');
                }
                });

            });

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            // ionic.Platform.ready(function() {
            //     // hide the status bar using the StatusBar plugin
            //     if (ionic.Platform.isIOS()) {
            //     } else if (ionic.Platform.isAndroid()) {
            //         try {
            //             StatusBar.hide();
            //         }catch (e) {}
            //     }
            // });

            PushNotificationsService.register();

        });

        $ionicPlatform.on("resume", function () {
            AuthService.userIsLoggedIn().then(function (response) {
                AuthServiceWPJ.userIsLoggedIn().then(function (responseWPJ) {

                    if (response === false || responseWPJ === false) {
                        $state.go('login');
                    } else {
                        //update user avatar and go on
                        AuthService.updateUserAvatar();
                    }
                });

            });

            PushNotificationsService.register();
        });

        // UI Router Authentication Check
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.data.authenticate) {
                AuthService.userIsLoggedIn().then(function (response) {
                    AuthServiceWPJ.userIsLoggedIn().then(function (responseWPJ) {

                        if (response === false || responseWPJ === false) {
                            event.preventDefault();

                            $state.go('login');
                        }
                    });

                });

            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

        // multiselectProvider.setTemplateUrl('lib/ionic-multiselect/dist/templates/item-template.html');
        // multiselectProvider.setModalTemplateUrl('lib/ionic-multiselect/dist/templates/modal-template.html');
        // multiselectProvider.setTemplateUrl('views/app/templates/item-template.html');
        // multiselectProvider.setModalTemplateUrl('views/app/templates/modal-template.html');

        $httpProvider.interceptors.push('httpRequestInterceptor');

        $httpProvider.defaults.timeout = 5000;
        if (!ionic.Platform.isIOS()) $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.tabs.position('bottom');

        $stateProvider

            .state('walkthrough', {
                url: "/",
                templateUrl: "views/auth/walkthrough.html",
                controller: 'WalkthroughCtrl',
                data: {
                    authenticate: false
                }
            })

            .state('register', {
                url: "/register",
                templateUrl: "views/auth/register.html",
                controller: 'RegisterCtrl',
                data: {
                    authenticate: false
                }
            })

            .state('login', {
                url: "/login",
                templateUrl: "views/auth/login.html",
                controller: 'LoginCtrl',
                data: {
                    authenticate: false
                }
            })

            .state('forgot_password', {
                url: "/forgot_password",
                templateUrl: "views/auth/forgot-password.html",
                controller: 'ForgotPasswordCtrl',
                data: {
                    authenticate: false
                }
            })

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "views/app/side-menu.html",
                controller: 'AppCtrl'
            })

            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "views/app/home.html",
                        controller: 'HomeCtrl'
                    }

                },
                data: {
                    authenticate: true
                }
            })

            .state('app.bookmarks', {
                url: "/bookmarks",
                views: {
                    'menuContentBookmarks': {
                        templateUrl: "views/app/bookmarks.html",
                        controller: 'BookMarksCtrl'
                    }
                },
                data: {
                    authenticate: true
                }
            })

            .state('app.contact', {
                url: "/contact",
                views: {
                    'menuContentContact': {
                        templateUrl: "views/app/contact.html",
                        controller: 'ContactCtrl'
                    }
                },
                data: {
                    authenticate: true
                }
            })

            .state('app.post', {
                url: "/post/:postId",
                views: {
                    'menuContent': {
                        templateUrl: "views/app/wordpress/post.html",
                        controller: 'PostCtrl'
                    }
                },
                data: {
                    authenticate: true
                },
                resolve: {
                    post_data: function (PostService, $ionicLoading, $stateParams) {
                        $ionicLoading.show({
                            template: "<span style='font-family: VazirLight'>درحال دریافت ...</span>"
                        });

                        var postId = $stateParams.postId;
                        return PostService.getPost(postId);
                    }
                }
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    'menuContentsettings': {
                        templateUrl: "views/app/settings.html",
                        controller: 'SettingCtrl'
                    }
                },
                data: {
                    authenticate: true
                }
            })

            .state('app.category', {
                url: "/category/:categoryTitle/:categoryId",
                views: {
                    'menuContent': {
                        templateUrl: "views/app/wordpress/category.html",
                        controller: 'PostCategoryCtrl'
                    }
                },
                data: {
                    authenticate: true
                }
            })

            .state('app.pages', {
                url: "/pages",
                views: {
                    'menuContentPages': {
                        templateUrl: "views/app/wordpress/wordpress-page.html",
                        controller: 'PageCtrl'
                    }
                },
                data: {
                    authenticate: true
                },
                resolve: {
                    page_data: function (PostService) {
                        //You should replace this with your page slug
                        var page_slug = 'wordpress-page';
                        return PostService.getWordpressPage(page_slug);
                    }
                }
            })

        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    })

;
