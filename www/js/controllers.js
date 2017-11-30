angular.module('enaqd.controllers', [])

// APP - RIGHT MENU
    .controller('AppCtrl', function ($scope, $window, $state, $ionicHistory, $ionicPlatform, $ionicPopup, $ionicLoading, AuthService) {

        $scope.data = {
            sliderDelegate: null,
            currentPage: 1,
            sliderOptions: null
        };

        $scope.calculateDimensions = function (gesture) {
            // $scope.dev_width = $window.innerWidth;
            // $scope.menu_width = $window.innerWidth;
            // $scope.dev_height = $window.innerHeight;

            var ratio = $window.innerHeight / ($window.innerWidth);

            $scope.pic_w = $window.innerHeight / ratio;
            $scope.pic_h = $window.innerWidth / ratio;

        }

        angular.element($window).bind('resize', function () {
            $scope.$apply(function () {
                $scope.calculateDimensions();
            })
        });

        $scope.calculateDimensions();

        $scope.campicstyle = {
            display: 'block',
            margin: '0 auto',
            width: $scope.pic_w + 'px',
            height: $scope.pic_h + 'px',
            lineHeight: $scope.pic_h + 'px',
            fontFamily: 'VazirBold !important',
            border: '0px solid darkgray !important'

        };

        $scope.$on('$ionicView.enter', function () {
            // Refresh user data & avatar
            $scope.user = AuthService.getUser();
        });


        var setupSlider = function () {
            //some options to pass to our slider
            $scope.data.sliderOptions = {
                loop: false,
                // effect: 'flip',
                speed: 300,
                pagination: false,
                initialSlide: 1,
                // virtualTranslate:true,
                // spaceBetween:0,
                followFinger: false
                // resistance:false,
                // freeModeMomentumBounce:false,


            };
            $scope.data.currentPage = 1;
            //create delegate reference to link with slider
            $scope.data.sliderDelegate = null;

            //watch our sliderDelegate reference, and use it when it becomes available
            $scope.$watch('data.sliderDelegate', function (newVal, oldVal) {
                if (newVal != null) {
                    $scope.data.sliderDelegate.on('slideChangeEnd', function () {
                        $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
                        // if ($scope.data.sliderDelegate.activeIndex == 0)
                        //     $scope.camBackPrio = 1000
                        //use $scope.$apply() to refresh any content external to the slider
                        $scope.$apply();
                    });
                }
            });

        };

        setupSlider();

        $scope.slideLeft = function () {
            if($scope.data.currentPage != 0)
                $scope.data.sliderDelegate.slideTo(0, 100);
        };
        $scope.slideRight = function () {
            if($scope.data.currentPage != 1)
                $scope.data.sliderDelegate.slideTo(1, 100);
        };

        $scope.popison = false;
        // Disable BACK button on home
        $ionicPlatform.registerBackButtonAction(function (event) {
            console.log($state.current.name)
            //app.home
            $ionicLoading.hide();

            if ($state.current.name == "app.home") {
                if (!$scope.popison && $scope.data.currentPage == 1) { // your check here
                    $scope.popison = true;
                    $ionicPopup.confirm({
                        title: 'توجه',
                        template: 'می خواهید خارج شوید ؟',
                        okText: 'بله',
                        cancelText: 'خیر',
                        cssClass: 'confirmpopup'
                    }).then(function (res) {
                        $scope.popison = false;
                        if (res) {
                            ionic.Platform.exitApp();
                        }
                    })
                }
                else if ($scope.data.currentPage == 0) {
                    var elm = angular.element(document.getElementById('catmodal'));
                    var cls = angular.element(document.querySelector('.ng-enter'));
                    // console.log(JSON.stringify(cls))
                    if (cls.length > 0) {
                        elm.scope().hideItems();
                    }
                    else {
                        $scope.slideRight();
                    }
                }
            }
            else if ($state.current.name = "app.category") {
                $state.go('app.home');
            }
            else {
                $ionicHistory.goBack();
            }
        }, 1000);


    })

    // CATEGORIES MENU
    .controller('PushMenuCtrl', function ($state, $ionicHistory, $scope, Categories) {

        $scope.gotoHome = function () {
            // debugger;
            // console.log("clicked");
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.home');

        };
        // debugger;
        var getItems = function (parents, categories) {

            // debugger;
            if (parents.length > 0) {


                _.each(parents, function (parent) {
                    // debugger;
                    // parent.name = parent.title;
                    parent.link = parent.slug;

                    var items = _.filter(categories, function (category) {
                        return category.parent === parent.id;
                    });

                    if (items.length > 0) {
                        parent.menu = {
                            title: parent.name,
                            id: parent.id,
                            items: items
                        };
                        getItems(parent.menu.items, categories);
                    }
                });
            }
            return parents;
        };

        Categories.getCategories()
            .then(function (data) {
                // debugger;
                var sorted_categories = _.sortBy(data, function (category) {
                    return category.name;
                });
                var parents = _.filter(sorted_categories, function (category) {
                    // return category.parent === 0;
                    return category.id != 1;
                });
                // parents = sorted_categories;
                var result = getItems(parents, sorted_categories);

                // debugger;

                $scope.menu = {
                    title: 'دسته ها:',
                    // title: 'صفحه نخست',
                    id: '0',
                    items: result
                };
            });
    })


    // BOOKMARKS
    .controller('BookMarksCtrl', function ($scope, $rootScope, BookMarkService) {

        // debugger
        $scope.bookmarks = BookMarkService.getBookmarks();

        // When a new post is bookmarked, we should update bookmarks list
        $rootScope.$on("new-bookmark", function (event, post_id) {
            $scope.bookmarks = BookMarkService.getBookmarks();
        });

        $scope.remove = function (bookmarkId) {
            BookMarkService.remove(bookmarkId);
            $scope.bookmarks = BookMarkService.getBookmarks();
        };
    })


    // CONTACT
    .controller('ContactCtrl', function ($scope) {

        //map
        $scope.position = {
            lat: 43.07493,
            lng: -89.381388
        };

        $scope.$on('mapInitialized', function (event, map) {
            $scope.map = map;
        });
    })

    // SETTINGS
    .controller('SettingCtrl', function ($scope, $ionicActionSheet, $ionicModal, $state, AuthService, AuthServiceWPJ) {
        $scope.notifications = true;
        $scope.sendLocation = false;
        // debugger
        // $scope.username = AuthServiceWPJ.getUser().data.user_id;
        $scope.username = AuthServiceWPJ.getUser().data;


        $ionicModal.fromTemplateUrl('views/common/terms.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.terms_modal = modal;
        });

        $ionicModal.fromTemplateUrl('views/common/faqs.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.faqs_modal = modal;
        });

        $ionicModal.fromTemplateUrl('views/common/credits.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.credits_modal = modal;
        });

        $scope.showTerms = function () {
            $scope.terms_modal.show();
        };

        $scope.showFAQS = function () {
            $scope.faqs_modal.show();
        };

        $scope.showCredits = function () {
            $scope.credits_modal.show();
        };

        // Triggered on a the logOut button click
        $scope.showLogOutMenu = function () {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                //Here you can add some more buttons
                // buttons: [
                // { text: '<b>Share</b> This' },
                // { text: 'Move' }
                // ],
                destructiveText: 'خروج',
                titleText: 'می خواهید از حساب کاربریتان خارج شوید ؟',
                cancelText: 'لغو',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    //Called when one of the non-destructive buttons is clicked,
                    //with the index of the button that was clicked and the button object.
                    //Return true to close the action sheet, or false to keep it opened.
                    return true;
                },
                destructiveButtonClicked: function () {
                    //Called when the destructive button is clicked.
                    //Return true to close the action sheet, or false to keep it opened.
                    AuthService.logOut();
                    AuthServiceWPJ.logOut();
                    $state.go('login');
                }
            });
        };
    })

    //EMAIL SENDER
    .controller('websiteCtrl', function ($scope, $cordovaEmailComposer) {

        // $scope.sendFeedback = function () {
        //     cordova.plugins.email.isAvailable(
        //         function (isAvailable) {
        //             // alert('Service is not available') unless isAvailable;
        //             cordova.plugins.email.open({
        //                 to: 'john@doe.com',
        //                 cc: 'jane@doe.com',
        //                 subject: 'Feedback',
        //                 body: 'This app is awesome'
        //             });
        //         }
        //     );
        // };

        $scope.openWebSite = function () {
            //Plugin documentation here: http://ngcordova.com/docs/plugins/emailComposer/

            window.open('http://enaqd.com', '_system', 'location=yes');
            return false;
        };

    })


    // RATE THIS APP
    .controller('RateAppCtrl', function ($scope) {

        $scope.rateApp = function () {
            AppRate.preferences = {
                openStoreInApp: true,
                // displayAppName: 'eNaqd',
                usesUntilPrompt: 5,
                promptAgainForEachNewVersion: false,
                storeAppURL: {
                    ios: '<my_app_id>',
                    android: 'market://details?id=<package_name>',
                    windows: 'ms-windows-store://pdp/?ProductId=<the apps Store ID>',
                    blackberry: 'appworld://content/[App Id]/',
                    windows8: 'ms-windows-store:Review?name=<the Package Family Name of the application>'
                },
                customLocale: {
                    title: "به eNaqd امتیاز دهید",
                    message: "اگر از eNaqd راضی هستید، به آن امتیاز دهید.",
                    // message: "<span style='direction: rtl;'>اگر از eNaqd راضی هستید، به آن امتیاز دهید.</span>",
                    cancelButtonLabel: "فعلا نه!",
                    laterButtonLabel: "یادآوری کن",
                    rateButtonLabel: "بله، امتیاز میدهم"
                }
            };

            if (ionic.Platform.isIOS()) {
                // AppRate.preferences.storeAppURL.ios = '<my_app_id>';
                AppRate.promptForRating(true);
            } else if (ionic.Platform.isAndroid()) {
                // AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
                AppRate.promptForRating(true);
            }
        };
    })


    // WALKTHROUGH
    .controller('WalkthroughCtrl', function ($scope, $ionicPlatform, $ionicPopup, $state, AuthServiceWPJ, AuthService) {

        AuthService.userIsLoggedIn().then(function (response) {
            AuthServiceWPJ.userIsLoggedIn().then(function (responseWPJ) {

                if (response === true && responseWPJ === true) {
                    //update user avatar and go on
                    AuthService.updateUserAvatar();

                    $state.go('app.home');
                }
                else {
                    $state.go('walkthrough');
                }
            });

        });

        $ionicPlatform.registerBackButtonAction(function (event) {
            $ionicLoading.hide();

            if (!$scope.popison) { // your check here
                $scope.popison = true;
                $ionicPopup.confirm({
                    title: 'توجه',
                    template: 'می خواهید خارج شوید ؟',
                    okText: 'بله',
                    cancelText: 'خیر',
                    cssClass: 'confirmpopup'
                }).then(function (res) {
                    $scope.popison = false;
                    if (res) {
                        ionic.Platform.exitApp();
                    }
                })
            }
        }, 1000);


    })

    //LOGIN
    .controller('LoginCtrl', function ($scope, $ionicPlatform, $ionicPopup, $state, $ionicLoading, AuthService, AuthServiceWPJ, PushNotificationsService) {
        $scope.user = {};
        $ionicPlatform.registerBackButtonAction(function (event) {
            $ionicLoading.hide();

            if (!$scope.popison) { // your check here
                $scope.popison = true;
                $ionicPopup.confirm({
                    title: 'توجه',
                    template: 'می خواهید خارج شوید ؟',
                    okText: 'بله',
                    cancelText: 'خیر',
                    cssClass: 'confirmpopup'
                }).then(function (res) {
                    $scope.popison = false;
                    if (res) {
                        ionic.Platform.exitApp();
                    }
                })
            }
        }, 1000);

        $scope.doLogin = function () {

            $ionicLoading.show({
                template: "<span style='font-family: VazirLight'>درحال ورود ...</span>"
            });

            var user = {
                userName: $scope.user.userName,
                password: $scope.user.password
            };

            AuthServiceWPJ.doLogin(user)
                .then(function (user) {
                    //success
                    console.log('JWT Authenticated');

                    AuthService.doLogin(user)
                        .then(function (user) {
                            //success
                            $state.go('app.home');

                            $ionicLoading.hide();
                        }, function (err) {
                            //err
                            $scope.error = err;
                            $ionicLoading.hide();
                        });

                }, function (err) {
                    //err
                });

        };
    })


    // FORGOT PASSWORD
    .controller('ForgotPasswordCtrl', function ($scope, $state, $ionicLoading, AuthService) {
        $scope.user = {};

        $scope.recoverPassword = function () {

            $ionicLoading.show({
                template: "<span style='font-family: VazirLight'>بازیابی رمز ...</span>"
            });

            AuthService.doForgotPassword($scope.user.userName)
                .then(function (data) {
                    if (data.status == "error") {
                        $scope.error = data.error;
                    } else {
                        $scope.message = "<span style='font-family: VazirLight'>لینک تغییر رمز به ایمیلتان ارسال شد. آن را چک کنید.</span>";
                    }
                    $ionicLoading.hide();
                });
        };
    })


    // REGISTER
    .controller('RegisterCtrl', function ($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, AuthService, AuthServiceWPJ, PushNotificationsService) {
        $scope.user = {};

        $scope.doRegister = function () {

            $ionicLoading.show({
                template: "<span style='font-family: VazirLight'>ثبت کاربر ...</span>"
            });

            var user = {
                userName: $scope.user.userName,
                password: $scope.user.password,
                email: $scope.user.email,
                displayName: $scope.user.displayName
            };

            AuthService.doRegister(user)
                .then(function (user) {
                    //success
                    console.log('Registered');

                    AuthServiceWPJ.doLogin(user)
                        .then(function (user) {
                            //success
                            console.log('JWT Authenticated');

                            $state.go('app.home');
                            $ionicLoading.hide();
                        }, function (err) {
                            //err
                        });

                }, function (err) {
                    //err
                    $scope.error = err;
                    $ionicLoading.hide();
                });
        };

        $ionicPlatform.registerBackButtonAction(function (event) {
            $ionicLoading.hide();

            if (!$scope.popison) { // your check here
                $scope.popison = true;
                $ionicPopup.confirm({
                    title: 'توجه',
                    template: 'می خواهید خارج شوید ؟',
                    okText: 'بله',
                    cancelText: 'خیر',
                    cssClass: 'confirmpopup'
                }).then(function (res) {
                    $scope.popison = false;
                    if (res) {
                        ionic.Platform.exitApp();
                    }
                })
            }
        }, 1000);

    })

    // HOME - GET RECENT POSTS
    .controller('HomeCtrl', function ($scope, $rootScope, $state, $ionicLoading, PostService) {
        $scope.posts = [];
        $scope.page = 1;
        $scope.totalPages = 1;

        $scope.doRefresh = function () {

            $ionicLoading.show({
                template: "<span style='font-family: VazirLight'>درحال دریافت ...</span>"
            });

            //Always bring me the latest posts => page=1
            PostService.getRecentPosts(1)
                .then(function (data) {

                    // debugger;
                    $scope.totalPages = data.pages;
                    // $scope.posts = PostService.shortenPosts(data.posts);
                    $scope.posts = data.posts;

                    angular.forEach($scope.posts, function (pst, key) {
                        var author = pst.author;
                        PostService.getAuthor(author).then(function (aut) {
                            pst.author = aut;
                        });
                        PostService.getComments(pst.id).then(function (comms) {
                            pst.comment_count = comms.length;
                        });

                        PostService.getVoteData(pst.id).then(function (vt) {
                            // debugger;
                            pst.votedt = vt;
                            pst.votingfor = 'done';

                        });

                    });


                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.loadMoreData = function () {
            $scope.page += 1;

            PostService.getRecentPosts($scope.page)
                .then(function (data) {
                    //We will update this value in every request because new posts can be created
                    $scope.totalPages = data.pages;
                    // var new_posts = PostService.shortenPosts(data.posts);
                    var new_posts = data.posts;

                    angular.forEach(new_posts, function (pst, key) {
                        var author = pst.author;
                        PostService.getAuthor(author).then(function (aut) {
                            pst.author = aut;
                        });
                        PostService.getComments(pst.id).then(function (comms) {
                            pst.comment_count = comms.length;
                        });

                        PostService.getVoteData(pst.id).then(function (vt) {
                            pst.votedt = vt;
                            pst.votingfor = 'done';

                        });

                    });

                    $scope.posts = $scope.posts.concat(new_posts);

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.voteopt = function (po, addr) {
            // debugger
            po.votingfor = 'uploading';

            PostService.setVoteData(addr).then(function (vt) {
                PostService.getVoteData(po.id).then(function (vt) {
                    po.votedt = vt;
                    po.votingfor = 'done';
                });
            });
        };

        $scope.moreDataCanBeLoaded = function () {
            return $scope.totalPages > $scope.page;
        };

        $scope.sharePost = function (link) {
            PostService.sharePost(link);
        };

        $scope.bookmarkPost = function (post) {
            $ionicLoading.show({
                template: "<span style='font-family: VazirLight'>ذخیره شد ...</span>",
                noBackdrop: true,
                duration: 1000
            });
            PostService.bookmarkPost(post);
        };

        $scope.doRefresh();

    })


    // POST
    .controller('PostCtrl', function ($scope, post_data, $ionicLoading, PostService, AuthService, $ionicScrollDelegate) {

        // debugger;
        post_data.content.rendered = post_data.content.rendered.replace('class="aheadzen_vote"', 'style="display: none;"');

        $scope.post = post_data;

        PostService.getVoteData(post_data.id).then(function (vt) {
            $scope.post.votedt = vt;
            $scope.post.votingfor = 'done';
        });


        $scope.voteopt = function (po, addr) {
            // debugger
            po.votingfor = 'uploading';

            PostService.setVoteData(addr).then(function (vt) {
                PostService.getVoteData(po.id).then(function (vt) {
                    po.votedt = vt;
                    po.votingfor = 'done';
                });
            });
        };

        // // Convert all English digits in a string to Arabic digit equivalents
        // $scope.ToFaNums = function(src)
        // {
        //     var digits = "۰۱۲۳۴۵۶۷۸۹";
        //     return string.Join("",
        //         src.Select(c => c >= '0' && c <= '9' ? digits[((int)c - (int)'0')] : c)
        //
        // }

        var author = post_data.author;
        PostService.getAuthor(author).then(function (aut) {
            $scope.post.author = aut;
        });
        PostService.getComments(post_data.id).then(function (comms) {
            $scope.comments = comms;
        });

        $ionicLoading.hide();

        $scope.sharePost = function (link) {
            window.plugins.socialsharing.share('Check this post here: ', null, null, link);
        };

        $scope.bookmarkPost = function (post) {
            $ionicLoading.show({
                template: "<span style='font-family: VazirLight'>ذخیره شد ...</span>",
                noBackdrop: true,
                duration: 1000
            });
            PostService.bookmarkPost(post);
        };

        $scope.addComment = function () {

            $ionicLoading.show({
                template: "<span style='font-family: VazirLight'>ارسال نظر ...</span>"
            });
            // $scope.$apply();
            PostService.submitComment($scope.post.id, $scope.post.new_comment)
                .then(function (data) {
                    if (data.status == "ok") {
                        var user = AuthService.getUser();
                        $scope.post.new_comment = "";

                        PostService.getComment(data.comment_id)
                            .then(function (comm) {
                                $scope.comments.push(comm);
                                $scope.new_comment_id = data.comment_id;
                                $ionicLoading.hide();
                                // Scroll to new post
                                $ionicScrollDelegate.scrollBottom(true);
                            });

                    }
                });
        };
    })


    // CATEGORY
    .controller('PostCategoryCtrl', function ($scope, $rootScope, $state, $ionicLoading, $stateParams, PostService) {

        $scope.category = {};
        $scope.category.id = $stateParams.categoryId;
        $scope.category.title = $stateParams.categoryTitle;

        $scope.posts = [];
        $scope.page = 1;
        $scope.totalPages = 1;

        $scope.doRefresh = function () {
            $ionicLoading.show({
                template: "<span style='font-family: VazirLight'>درحال دریافت ...</span>"
            });

            PostService.getPostsFromCategory($scope.category.id, 1)
                .then(function (data) {
                    $scope.totalPages = data.pages;
                    // $scope.posts = PostService.shortenPosts(data.posts);

                    angular.forEach(data.posts, function (pst, key) {
                        var author = pst.author;
                        PostService.getAuthor(author).then(function (aut) {
                            pst.author = aut;
                        });
                        PostService.getComments(pst.id).then(function (comms) {
                            pst.comment_count = comms.length;
                        });

                        PostService.getVoteData(pst.id).then(function (vt) {
                            pst.votedt = vt;
                            pst.votingfor = 'done';

                        });
                    });

                    $scope.posts = data.posts;

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.voteopt = function (po, addr) {
            // debugger
            po.votingfor = 'uploading';

            PostService.setVoteData(addr).then(function (vt) {
                PostService.getVoteData(po.id).then(function (vt) {
                    po.votedt = vt;
                    po.votingfor = 'done';
                });
            });
        };

        $scope.loadMoreData = function () {
            $scope.page += 1;

            PostService.getPostsFromCategory($scope.category.id, $scope.page)
                .then(function (data) {
                    //We will update this value in every request because new posts can be created
                    $scope.totalPages = data.pages;
                    // var new_posts = PostService.shortenPosts(data.posts);
                    var new_posts = data.posts;

                    angular.forEach(new_posts, function (pst, key) {
                        var author = pst.author;
                        PostService.getAuthor(author).then(function (aut) {
                            pst.author = aut;
                        });
                        PostService.getComments(pst.id).then(function (comms) {
                            pst.comment_count = comms.length;
                        });

                        PostService.getVoteData(pst.id).then(function (vt) {
                            pst.votedt = vt;
                            pst.votingfor = 'done';

                        });

                    });

                    $scope.posts = $scope.posts.concat(new_posts);

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.moreDataCanBeLoaded = function () {
            return $scope.totalPages > $scope.page;
        };

        $scope.sharePost = function (link) {
            PostService.sharePost(link);
        };

        $scope.bookmarkPost = function (post) {
            $ionicLoading.show({
                template: "<span style='font-family: VazirLight'>ذخیره شد ...</span>",
            });
            PostService.bookmarkPost(post);
        };

        $scope.doRefresh();
    })


    // WP PAGE
    .controller('PageCtrl', function ($scope, page_data) {
        $scope.page = page_data.page;
    })


    .controller('CamCtrl', function ($scope, $window, $q, $ionicLoading, PostService, AuthService) {

        $scope.newpost = {title: "", content: "", Tags: [], Cats: [], submited: false};


        // if (!$scope.allcategories || $scope.allcategories.length < 1) {
        PostService.getCats('')
            .then(function (cats) {
                // var catsView = [];
                // angular.forEach(cats, function (cat, key) {
                //     catsView.push({value: cat['name'], id: cat['id']})
                // });
                // //
                // $scope.allcategories =catsView;


                $scope.allcategories = cats;
            });


        // for category selection
        $scope.onValueChanged = function (value) {
            $scope.newpost.Cats = value;
        };

        $scope.formchanged = function () {
            $scope.newpost.submited = false;
        };

        document.addEventListener("deviceready", function () {
            var ratio = $window.innerHeight / ($window.innerWidth);
            ratio = 1;
            pic_w = Math.round($window.innerHeight / ratio);
            pic_h = Math.round($window.innerWidth / ratio);
            // console.log(pic_w);
            // console.log(pic_h);
            // console.log(ratio);

            $scope.takeImage = function () {

                var options = {
                    quality: 80,
                    // destinationType: Camera.DestinationType.DATA_URL,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    // allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    mediaType: Camera.MediaType.PICTURE,
                    // targetWidth: 300,
                    // targetHeight: 300,
                    targetWidth: pic_w,
                    targetHeight: pic_h,
                    // correctOrientation:true,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true
                };

                navigator.camera.getPicture(function cameraSuccess(imageData) {
                    $scope.imgDATA = imageData;
                    $scope.newpost.submited = false;

                    window.resolveLocalFileSystemURL(imageData, function (fileEntry) {
                        fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function (frResult) {
                                var data = new Uint8Array(frResult.target.result);
                                var b64encoded = btoa(String.fromCharCode.apply(null, data));
                                $scope.imgURI = "data:image/jpeg;base64," + b64encoded;

                                $scope.$apply()

                            };
                            reader.readAsArrayBuffer(file);
                        }, function (e) {
                            console.log('failed to get a file ob');
                            console.log(JSON.stringify(e));
                        });

                    });
                }, function cameraError(error) {
                    console.debug("Unable to obtain picture: " + error, "app");

                }, options);

            }
            $scope.pickImage = function () {


                var options = {
                    quality: 80,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    // allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    mediaType: Camera.MediaType.PICTURE,
                    targetWidth: pic_w,
                    targetHeight: pic_h,
                };

                navigator.camera.getPicture(function cameraSuccess(imageData) {
                    $scope.newpost.submited = false;
                    window.resolveLocalFileSystemURL(imageData, function (fileEntry) {
                        fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function (frResult) {
                                var data = new Uint8Array(frResult.target.result);
                                var b64encoded = btoa(String.fromCharCode.apply(null, data));
                                $scope.imgURI = "data:image/jpeg;base64," + b64encoded;

                                $scope.$apply()

                            };
                            reader.readAsArrayBuffer(file);
                        }, function (e) {
                            console.log('failed to get a file ob');
                            console.log(JSON.stringify(e));
                        });

                    });
                    $scope.imgDATA = imageData;
                    $scope.$apply()
                }, function (err) {
                    console.debug("Unable to obtain picture: " + error, "app");
                }, options);


            }

        }, false);


        $scope.loadTags = function (query) {
            var deferred = $q.defer();

            console.log(query);
            PostService.getTags(query)
                .then(function (tags) {
                    // console.log(JSON.stringify(tags));
                    var tagsView = [];
                    angular.forEach(tags, function (tag, key) {
                        // console.log(JSON.stringify(tag));
                        tagsView.push({'text': tag['name'], 'id': tag['id']})
                    });

                    console.log(JSON.stringify(tagsView));
                    deferred.resolve(tagsView)
                });
            return deferred.promise;

        };
        // $scope.loadCatss = function (query) {
        //     var deferred = $q.defer();
        //     PostService.getCats(query)
        //         .then(function (cats) {
        //             var catsView = [];
        //             angular.forEach(cats, function (cat, key) {
        //                 catsView.push({text: cat['name'], 'id': cat['id']})
        //             });
        //
        //             deferred.resolve(catsView);
        //         });
        //     return deferred.promise;
        //
        // };

        $scope.loadTagsId = function (tags) {
            var deferred = $q.defer();
            // debugger;
            var tagsId = [];
            angular.forEach(tags, function (tag, key) {
                if ('id' in tag) {
                    tagsId.push(tag['id'])
                } else {
                    PostService.setTag(tag['text'])
                        .then(function (data) {
                            tagsId.push(data['id'])
                            // deferred.resolve(tagsView)
                            // debugger
                        });
                    // return deferred.promise;
                }
            });

            return tagsId;
        };
        // $scope.loadCatsId = function (cats) {
        //     // debugger;
        //     var catsId = [];
        //     angular.forEach(cats, function (cat, key) {
        //         // console.log(JSON.stringify(cat));
        //         catsId.push(cat['id'])
        //     });
        //
        //     return catsId;
        // }


        $scope.addPost = function () {
            // console.log($scope.imgDATA);
            if (($scope.imgDATA + '').length > 1) {
                $ionicLoading.show({
                    template: "<span style='font-family: VazirLight'>ارسال تصویر ...</span>"
                });

                var nptags = this.loadTagsId($scope.newpost.Tags);
                // var npcats = this.loadCatsId($scope.newpost.Cats);
                var npcats = $scope.newpost.Cats;

                // var tmpaddr = 'img/ionic.png';
                // PostService.setMedia({data:tmpaddr})
                //     .then(function (data) {
                //     });

                console.log('processing image ' + JSON.stringify($scope.imgDATA));
                window.resolveLocalFileSystemURL($scope.imgDATA, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (frResult) {
                            var data = new Uint8Array(frResult.target.result);
                            imageFile4send = new Blob([data], {type: file.type});
                            PostService.setMedia(imageFile4send)
                                .then(function (data) {
                                    $ionicLoading.hide();
                                    $ionicLoading.show({
                                        template: "<span style='font-family: VazirLight'>ارسال مطلب ...</span>"
                                    });

                                    // console.log("after set media :" + JSON.stringify(data))
                                    var npfeatured_media = data["id"]
                                    var newpostdata = {
                                        "status": "pending",
                                        title: $scope.newpost.title,
                                        content: $scope.newpost.content,
                                        tags: nptags,
                                        categories: npcats,
                                        featured_media: npfeatured_media
                                    };

                                    PostService.setPost(newpostdata)
                                        .then(function (data) {
                                            console.log("after set post :" + JSON.stringify(data))
                                            if (data.id) {
                                                // $scope.newpost = {title: "", content: ""};
                                                $ionicLoading.hide();
                                                $scope.newpostrestxt = "این مطالب ارسال شده است.";
                                                $scope.newpost.submited = true;
                                                $ionicLoading.show({
                                                    template: "<span style='font-family: VazirLight'>ارسال شد.</span>",
                                                    noBackdrop: true,
                                                    duration: 1000
                                                });
                                            }
                                            $ionicLoading.hide();

                                        });
                                });

                        };
                        reader.readAsArrayBuffer(file);
                    }, function (e) {
                        console.log('failed to get a file ob');
                        console.log(JSON.stringify(e));
                    });
                }, function (e) {
                    console.log('something went wrong w resolveLocalFileSystemURL');
                    console.log(JSON.stringify(e));
                });


            }
        };

    })
;
