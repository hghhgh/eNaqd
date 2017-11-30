angular.module('enaqd.services', [])

// WP POSTS RELATED FUNCTIONS
    .service('PostService', function ($rootScope, $http, $q, $httpParamSerializerJQLike, WORDPRESS_URL, WORDPRESS_API_URL, WORDPRESS_WPJSON_URL, AuthService, BookMarkService) {

        this.getRecentPosts = function (page) {
            var deferred = $q.defer();

            $http.get(WORDPRESS_WPJSON_URL + 'wp/v2/posts?page=' + page + '&per_page=5')
                .success(function (data, status, headers, config) {
                    // console.log(JSON.stringify(headers('X-WP-TotalPages'))); //X-WP-Total:"4"
                    var res = {};
                    res.pages = parseInt(headers('X-WP-TotalPages'), 10);
                    res.posts = data;
                    res.count = data.length;
                    res.count_total = data.length;
                    deferred.resolve(res);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        this.getUserGravatar = function (userId) {
            var deferred = $q.defer();

            $http.jsonp(WORDPRESS_API_URL + 'user/get_avatar/' +
                '?user_id=' + userId +
                '&insecure=cool' +
                '&type=full' +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    // debugger
                    var avatar_aux = data.avatar.replace("http:", "");
                    var avatar = 'http:' + avatar_aux;

                    deferred.resolve(avatar);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        this.getPost = function (postId) {
            var deferred = $q.defer();

            $http.get(WORDPRESS_WPJSON_URL + 'wp/v2/posts/' + postId, {
                    context: 'view'
                }
            ).success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };
        this.getComments = function (postId) {
            var deferred = $q.defer();

            $http.get(WORDPRESS_WPJSON_URL + 'wp/v2/comments?post=' + postId + '&order=asc'
            ).success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };
        this.getComment = function (commId) {
            var deferred = $q.defer();

            $http.get(WORDPRESS_WPJSON_URL + 'wp/v2/comments/' + commId
            ).success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        this.getAuthor = function (authorId) {
            var deferred = $q.defer();

            var user = AuthService.getUser();

            $http.jsonp(WORDPRESS_API_URL + 'user/get_userinfo/' +
                '?user_id=' + authorId +
                '&cookie=' + user.cookie +
                '&insecure=cool' +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;

        };

        this.getVoteData = function (pid) {
            var deferred = $q.defer();

            var user = AuthService.getUser();

            $http.get(WORDPRESS_URL + '?voterapi=1' +'&pid=' + pid +'&username=' + user.data.username
            ).success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;

        };

        this.setVoteData = function (addr) {
            var deferred = $q.defer();

            // debugger
            addr = addr.replace('rtype=json','rtype=ajax').replace(/&amp;/g, '&');

            $http.jsonp(addr)
                .success(function (data) {
                deferred.resolve(data);
            })
                .error(function (data) {
                    // console.log(JSON.stringify(data));
                    deferred.resolve('');

                    // deferred.reject(data);
                });

            return deferred.promise;

        };

        this.getTags = function (searchtxt) {
            var deferred = $q.defer();

            $http.get(WORDPRESS_WPJSON_URL + 'wp/v2/tags' + '?search=' + searchtxt
            ).success(function (data, status, headers, config) {
                // console.log(JSON.stringify(data)); //X-WP-Total:"4"

                deferred.resolve(data);
            })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;

        };
        this.setTag = function (name) {
            var deferred = $q.defer();

            $http.post(WORDPRESS_WPJSON_URL + 'wp/v2/tags' + '?name=' + name
            ).success(function (data, status, headers, config) {
                // console.log(JSON.stringify(data)); //X-WP-Total:"4"

                deferred.resolve(data);
            })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;

        }
        this.getCats = function (searchtxt) {
            var deferred = $q.defer();

            $http.get(WORDPRESS_WPJSON_URL + 'wp/v2/categories' + '?search=' + searchtxt + '&per_page=100'
            ).success(function (data, status, headers, config) {
                // console.log(JSON.stringify(data)); //X-WP-Total:"4"

                var idx = -1;
                angular.forEach(data, function (item, i) {
                    if (item.id == 1) {
                        idx = i;
                    }
                });
                data.splice(idx, 1);
                deferred.resolve(data);
            })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;

        };

        // this.getCats = function (searchtxt) {
        //
        //     debugger;
        //
        //     getCatOnPage = function (searchtxt, page) {
        //         var deferred = $q.defer();
        //
        //         $http.get(WORDPRESS_WPJSON_URL + 'wp/v2/categories' + '?search=' + searchtxt
        //             + '&per_page=5' + '&page=' + page
        //         ).success(function (data, status, headers, config) {
        //             // console.log(JSON.stringify(data)); //X-WP-Total:"4"
        //
        //
        //             deferred.resolve(data);
        //         })
        //             .error(function (data, status, headers, config) {
        //                 deferred.reject(data);
        //             });
        //         return deferred.promise;
        //
        //     };
        //     getCatsRecursiv = function (searchtxt, page) {
        //         var deferred = $q.defer();
        //         var data = [];
        //         // debugger;
        //         getCatOnPage(searchtxt, page).then(function (cats) {
        //             if (cats.length > 0) {
        //                 data.push(cats);
        //                 page += 1;
        //                 getCatsRecursiv(searchtxt, page).then(function (ncats) {
        //                     if (ncats.length > 0) {
        //                         data.push(ncats);
        //                     }
        //
        //                 });
        //             }
        //             else {
        //                 deferred.resolve(data);
        //             }
        //
        //         });
        //
        //         return deferred.promise;
        //     };
        //
        //     getCatsRecursiv(searchtxt, 1).then(function (ncats) {
        //         if (ncats.length > 0) {
        //             data.append(ncats);
        //
        //             debugger
        //
        //             var idx = -1;
        //             angular.forEach(data, function (item, i) {
        //                 if (item.id == 1) {
        //                     idx = i;
        //                 }
        //             });
        //             data.splice(idx, 1);
        //             return data;
        //         }
        //     });
        //
        // };


        this.setMedia = function (media) {
            var deferred = $q.defer();
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Disposition': 'attachment; filename=\"image.jpg\"',
                }
                // transformRequest: angular.identity
            }
            $http.post(WORDPRESS_WPJSON_URL + 'wp/v2/media', media, config)
                .success(function (data) {
                    console.log(JSON.stringify(data));
                    deferred.resolve(data);
                })
                .error(function (data) {
                    console.log(JSON.stringify(data));
                    deferred.reject(data);
                });

            return deferred.promise;

        };
        this.setPost = function (jwtdata) {
            var deferred = $q.defer();
            $http.post(WORDPRESS_WPJSON_URL + 'wp/v2/posts/', jwtdata)
                .success(function (data) {
                    console.log(JSON.stringify(data));
                    deferred.resolve(data);
                })
                .error(function (data) {

                    console.log(JSON.stringify(data));
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        this.submitComment = function (postId, content) {
            var deferred = $q.defer(),
                user = AuthService.getUser();

            $http.jsonp(WORDPRESS_API_URL + 'user/post_comment/' +
                '?post_id=' + postId +
                '&cookie=' + user.cookie +
                '&comment_status=1' +
                '&insecure=cool' +
                '&content=' + content +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        this.getPostsFromCategory = function (categoryId, page) {
            var deferred = $q.defer();

            $http.get(WORDPRESS_WPJSON_URL + 'wp/v2/posts?page=' + page + '&per_page=5' +
                    '&categories=' + categoryId
            ).success(function (data, status, headers, config) {
                    // console.log(JSON.stringify(headers('X-WP-TotalPages'))); //X-WP-Total:"4"
                    var res = {};
                    res.pages = parseInt(headers('X-WP-TotalPages'), 10);
                    res.posts = data;
                    res.count = data.length;
                    res.count_total = data.length;
                    deferred.resolve(res);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        // this.shortenPosts = function (posts) {
        //     // debugger;
        //     //we will shorten the post
        //     //define the max length (characters) of your post content
        //     var maxLength = 600;
        //     return _.map(posts, function (post) {
        //         if (post.content.length > maxLength) {
        //             //trim the string to the maximum length
        //             var trimmedString = post.content.substr(0, maxLength);
        //             //re-trim if we are in the middle of a word
        //             trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("</p>")));
        //             post.content = trimmedString;
        //         }
        //         return post;
        //     });
        // };

        this.sharePost = function (link) {
            window.plugins.socialsharing.share('Check this post here: ', null, null, link);
        };

        this.bookmarkPost = function (post) {
            BookMarkService.bookmarkPost(post);
            $rootScope.$broadcast("new-bookmark", post);
        };

        this.getWordpressPage = function (page_slug) {
            var deferred = $q.defer();

            $http.jsonp(WORDPRESS_API_URL + 'get_page/' +
                '?slug=' + page_slug +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

    })


    // SEARCH MENU RELATED FUNCTIONS
    .service('SearchService', function ($rootScope, $http, $q, WORDPRESS_API_URL) {

        this.search = function (query) {

            var search_results = [],
                search_results_response = $q.defer(),
                promises = [
                    this.searchPosts(query),
                    this.searchTags(query),
                    this.searchAuthors(query)
                ];

            $q.all(promises).then(function (promises_values) {
                _.map(promises_values, function (promise_value) {
                    search_results.push({
                        _id: promise_value.id,
                        results: _.map(promise_value.posts, function (post) {
                            return {
                                title: post.title,
                                id: post.id,
                                date: post.date,
                                excerpt: post.excerpt
                            };
                        })
                    });
                });
                search_results_response.resolve(search_results);
            });

            return search_results_response.promise;
        };

        this.searchPosts = function (query) {
            var deferred = $q.defer();

            $http.jsonp(WORDPRESS_API_URL + 'get_search_results/' +
                '?search=' + query +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    var promise_value = {
                        id: "posts",
                        posts: data.posts
                    };
                    deferred.resolve(promise_value);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        this.searchTags = function (query) {
            var deferred = $q.defer();
            var tags_deferred = $q.defer(),
                results_deferred = $q.defer();

            //get all tags and filter the ones with the query in the title
            $http.jsonp(WORDPRESS_API_URL + 'get_tag_index/' +
                '?callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    var tags = _.filter(data.tags, function (tag) {
                        return ((tag.title.indexOf(query) > -1));
                        // || (tag.description.indexOf(query) > -1));
                    });
                    tags_deferred.resolve(tags);
                })
                .error(function (data) {
                    tags_deferred.reject(data);
                });

            tags_deferred.promise.then(function (tags) {
                //for each of the tags matching the query, bring the related posts
                var tag_promises = _.map(tags, function (tag) {
                    return $http.jsonp(WORDPRESS_API_URL + 'get_tag_posts/' +
                        '?id=' + tag.id +
                        '&callback=JSON_CALLBACK', {timeout: deferred.promise});
                });

                //prepare the response
                $q.all(tag_promises).then(function (results) {
                    var posts = [];
                    _.map(results, function (result) {
                        _.each(result.data.posts, function (post) {
                            posts.push(post);
                        });
                    });
                    var promise_value = {
                        id: "tags",
                        posts: posts
                    };
                    results_deferred.resolve(promise_value);
                });
            });

            return results_deferred.promise;
        };

        this.searchAuthors = function (query) {
            var authors_deferred = $q.defer(),
                results_deferred = $q.defer();

            //get all the authors and filter the ones with the query
            $http.jsonp(WORDPRESS_API_URL + 'get_author_index/' +
                '?callback=JSON_CALLBACK', {timeout: authors_deferred.promise})
                .success(function (data) {
                    var authors = _.filter(data.authors, function (author) {
                        return ((author.name.indexOf(query) > -1) || (author.nickname.indexOf(query) > -1) || (author.first_name.indexOf(query) > -1));
                    });
                    authors_deferred.resolve(authors);
                })
                .error(function (data) {
                    authors_deferred.reject(data);
                });

            authors_deferred.promise.then(function (authors) {
                //for each of the tags matching the query, bring the related posts
                var author_promises = _.map(authors, function (author) {
                    return $http.jsonp(WORDPRESS_API_URL + 'get_author_posts/' +
                        '?id=' + author.id +
                        '&callback=JSON_CALLBACK', {timeout: deferred.promise});
                });

                //prepare the response
                $q.all(author_promises).then(function (results) {
                    var posts = [];
                    _.map(results, function (result) {
                        _.each(result.data.posts, function (post) {
                            posts.push(post);
                        });
                    });

                    var promise_value = {
                        id: "authors",
                        posts: posts
                    };
                    results_deferred.resolve(promise_value);
                });
            });

            return results_deferred.promise;
        };
    })


    // BOOKMARKS FUNCTIONS
    .service('BookMarkService', function (_) {
        this.bookmarkPost = function (bookmark_post) {

            var user_bookmarks = !_.isUndefined(window.localStorage.enaqd_bookmarks) ? JSON.parse(window.localStorage.enaqd_bookmarks) : [];

            //check if this post is already saved
            var existing_post = _.find(user_bookmarks, function (post) {
                return post.id == bookmark_post.id;
            });

            if (!existing_post) {
                user_bookmarks.push({
                    id: bookmark_post.id,
                    title: bookmark_post.title,
                    date: bookmark_post.date,
                    excerpt: bookmark_post.excerpt
                });
            }

            window.localStorage.enaqd_bookmarks = JSON.stringify(user_bookmarks);
        };

        this.getBookmarks = function () {
            return JSON.parse(window.localStorage.enaqd_bookmarks || '[]');
        };

        this.remove = function (id) {
            var user_bookmarks = !_.isUndefined(window.localStorage.enaqd_bookmarks) ? JSON.parse(window.localStorage.enaqd_bookmarks) : [];

            //check if this post is already saved
            var remaining_posts = _.filter(user_bookmarks, function (bookmark) {
                return bookmark.id != id;
            });

            window.localStorage.enaqd_bookmarks = JSON.stringify(remaining_posts);
        };
    })


    // PUSH NOTIFICATIONS
    .service('PushNotificationsService', function ($rootScope, $state, $cordovaPush, WpPushServer, GCM_SENDER_ID, $ionicHistory) {
        /* Apple recommends you register your application for push notifications on the device every time it’s run since tokens can change. The documentation says: ‘By requesting the device token and passing it to the provider every time your application launches, you help to ensure that the provider has the current token for the device. If a user restores a backup to a device other than the one that the backup was created for (for example, the user migrates data to a new device), he or she must launch the application at least once for it to receive notifications again. If the user restores backup data to a new device or reinstalls the operating system, the device token changes. Moreover, never cache a device token and give that to your provider; always get the token from the system whenever you need it.’ */
        this.register = function () {
            if (ionic.Platform.isIOS()) {
                var ios_config = {
                    "badge": true,
                    "sound": true,
                    "alert": true
                };

                $cordovaPush.register(ios_config).then(function (result) {
                    // Success -- send deviceToken to server, and store for future use
                    console.log("Registration OK: " + result);
                    WpPushServer.storeDeviceToken("ios", result);
                }, function (err) {
                    console.log("Registration error: " + err);
                });

                $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                    console.log("Recieve push notification with notification.relatedvalue: " + notification.relatedvalue);

                    if (notification.relatedvalue) {
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true
                        });
                        $state.go("app.post", {postId: notification.relatedvalue});
                    }
                });
            }
            else if (ionic.Platform.isAndroid()) {
                var android_config = {
                    "senderID": GCM_SENDER_ID // REPLACE THIS WITH YOURS FROM GCM CONSOLE
                };

                $cordovaPush.register(android_config).then(function (result) {
                    // Success
                    console.log("result: " + result);
                }, function (err) {
                    // Error
                    console.log("error: " + err);
                });

                $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                    switch (notification.event) {
                        case 'registered':
                            if (notification.regid.length > 0) {
                                WpPushServer.storeDeviceToken("android", notification.regid);
                            }
                            break;

                        case 'message':
                            // this is the actual push notification. its format depends on the data model from the push server
                            console.log('message = ' + notification);

                            if (notification.payload.relatedvalue) {
                                $ionicHistory.nextViewOptions({
                                    disableAnimate: true
                                });
                                $state.go("app.post", {postId: notification.payload.relatedvalue});
                            }
                            break;

                        case 'error':
                            // alert('GCM error = ' + notification.msg);
                            break;

                        default:
                            // alert('An unknown GCM event has occurred');
                            break;
                    }
                });
            }
        };
    })


    // WP AUTHENTICATION RELATED FUNCTIONS
    .service('AuthService', function ($rootScope, $http, $q, WORDPRESS_API_URL) {

        this.validateAuth = function (user) {

            // console.log("validateAuth ...")
            var deferred = $q.defer();
            $http.jsonp(WORDPRESS_API_URL + 'user/validate_auth_cookie/' +
                '?cookie=' + user.cookie + '&insecure=cool' +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    // console.log("user validated!")
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        this.doLogin = function (user) {
            var deferred = $q.defer(),
                nonce_dfd = $q.defer(),
                authService = this;

            authService.requestNonce("user", "generate_auth_cookie")
                .then(function (nonce) {
                    nonce_dfd.resolve(nonce);
                });

            nonce_dfd.promise.then(function (nonce) {
                //now that we have the nonce, ask for the new cookie
                authService.generateAuthCookie(user.userName, user.password, nonce)
                    .then(function (data) {
                        if (data.status == "error") {
                            // return error message
                            deferred.reject(data.error);
                        } else {
                            //recieve and store the user's cookie in the local storage
                            var user = {
                                cookie: data.cookie,
                                data: data.user,
                                user_id: data.user.id
                            };

                            authService.saveUser(user);

                            //getavatar in full size
                            authService.updateUserAvatar().then(function () {
                                deferred.resolve(user);
                            });
                        }
                    });
            });
            return deferred.promise;
        };

        this.doRegister = function (user) {
            var deferred = $q.defer(),
                nonce_dfd = $q.defer(),
                authService = this;

            authService.requestNonce("user", "register")
                .then(function (nonce) {
                    nonce_dfd.resolve(nonce);
                });

            nonce_dfd.promise.then(function (nonce) {
                authService.registerUser(user.userName, user.email,
                    user.displayName, user.password, nonce)
                    .then(function (data) {
                        if (data.status == "error") {
                            // return error message
                            deferred.reject(data.error);
                        } else {
                            // in order to get all user data we need to call this function
                            // because the register does not provide user data
                            authService.doLogin(user).then(function () {
                                deferred.resolve(user);
                            });
                        }
                    });
            });

            return deferred.promise;
        };

        this.requestNonce = function (controller, method) {
            var deferred = $q.defer();
            // console.log("Hello World!");
            $http.jsonp(WORDPRESS_API_URL + 'get_nonce/' +
                '?controller=' + controller +
                '&method=' + method +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    // console.log(data);
                    deferred.resolve(data.nonce);
                })
                .error(function (data) {
                    deferred.reject(data.nonce);
                });
            return deferred.promise;
        };

        this.doForgotPassword = function (username) {
            var deferred = $q.defer();
            $http.jsonp(WORDPRESS_API_URL + 'user/retrieve_password/' +
                '?user_login=' + username +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        this.generateAuthCookie = function (username, password, nonce) {
            var deferred = $q.defer();
            $http.jsonp(WORDPRESS_API_URL + 'user/generate_auth_cookie/' +
                '?username=' + username +
                '&password=' + password +
                '&insecure=cool' +
                '&nonce=' + nonce +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        this.saveUser = function (user) {
            window.localStorage.enaqd_user = JSON.stringify(user);
            // console.log("user saved : " + user)
        };

        this.getUser = function () {

            var data = (window.localStorage.enaqd_user) ? JSON.parse(window.localStorage.enaqd_user).data : null,
                cookie = (window.localStorage.enaqd_user) ? JSON.parse(window.localStorage.enaqd_user).cookie : null;

            // console.log("user loaded : " + data)

            return {
                avatar: JSON.parse(window.localStorage.enaqd_user_avatar || null),
                data: data,
                cookie: cookie
            };
        };

        this.registerUser = function (username, email, displayName, password, nonce) {
            var deferred = $q.defer();
            $http.jsonp(WORDPRESS_API_URL + 'user/register/' +
                '?username=' + username +
                '&email=' + email +
                '&display_name=' + displayName +
                '&user_pass=' + password +
                '&insecure=cool' +
                '&nonce=' + nonce +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        this.userIsLoggedIn = function () {
            var deferred = $q.defer();

            var user = JSON.parse(window.localStorage.enaqd_user || null);
            // console.log("in userIsLoggedIn :" + user.data.username)
            if (user !== null && user.cookie !== null) {
                this.validateAuth(user).then(function (data) {
                    // console.log("userIsLoggedIn value:" + JSON.stringify(data))
                    deferred.resolve(data.valid);
                });
            }
            else {
                deferred.resolve(false);
            }
            return deferred.promise;
        };

        this.logOut = function () {
            //empty user data

            window.localStorage.enaqd_user = null;
            window.localStorage.enaqd_user_avatar = null;
            // window.localStorage.enaqd_bookmarks = null;
        };

        //update user avatar from WP
        this.updateUserAvatar = function () {
            var deferred = $q.defer();
            var avatar_dfd = $q.defer(),
                authService = this,
                user = JSON.parse(window.localStorage.enaqd_user || null);

            $http.jsonp(WORDPRESS_API_URL + 'user/get_avatar/' +
                '?user_id=' + user.user_id +
                '&insecure=cool' +
                '&type=full' +
                '&callback=JSON_CALLBACK', {timeout: deferred.promise})
                .success(function (data) {

                    var avatar_aux = data.avatar.replace("http:", "");
                    var avatar = 'http:' + avatar_aux;

                    window.localStorage.enaqd_user_avatar = JSON.stringify(avatar);

                    avatar_dfd.resolve(avatar);
                })
                .error(function (err) {
                    avatar_dfd.reject(err);
                });

            return avatar_dfd.promise;
        };
    })

    // With wp-json plugin of wordpress
    .service('AuthServiceWPJ', function ($rootScope, $http, $q, WORDPRESS_WPJSON_URL) {

        //another method
//         Authentication
//
//         To create a media, you need an user with upload_files capability. For example, an user with Administrator, Editor or Author roles. So first step is authorizing your request with one of following methods:
//
//             Cookie Authentication
//         OAuth Authentication
//         Application Passwords
//         Basic Authentication
//
//         You can read API’s Authentication guide for more details. For testing purpose, I am going to use Basic authentication.
//
//             Add following line to your request’s header:
//
//             Authorization: Basic YWRtaW46MTIzNDU=
//
// “YWRtaW46MTIzNDU=” is base64 encoding of “admin:12345”, if your username is “admin” and your password is “12345”.

        function serializeData(data) {
            // If this is not an object, defer to native stringification.
            if (!angular.isObject(data)) {
                return ( ( data == null ) ? "" : data.toString() );
            }

            var buffer = [];

            // Serialize each key in the object.
            for (var name in data) {
                if (!data.hasOwnProperty(name)) {
                    continue;
                }

                var value = data[name];

                buffer.push(
                    encodeURIComponent(name) + "=" + encodeURIComponent(( value == null ) ? "" : value)
                );
            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join("&").replace(/%20/g, "+");
            return ( source );
        }

        this.generateAuthCookie = function (username, password) {
            var deferred = $q.defer();

            this.deleteUser();

            var jwtdata = {
                username: username,
                password: password
            };
            var serjwtdata = serializeData(jwtdata);

            // var config = {
            //     headers : {
            //         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            //     }
            // }

            console.log("sending token req");

            $http.post(WORDPRESS_WPJSON_URL + 'jwt-auth/v1/token', jwtdata)
                .success(function (data) {

                    // console.log(JSON.stringify(data));
                    deferred.resolve(data);
                })
                .error(function (error) {

                    console.error('Error', JSON.stringify(error));
                });
            return deferred.promise;
        };

        this.doLogin = function (user) {
            var deferred = $q.defer(),
                authService = this;

            //now that we have the nonce, ask for the new cookie
            authService.generateAuthCookie(user.userName, user.password)
                .then(function (data) {
                    if (data.statusText == "error") {
                        // return error message
                        deferred.reject(data.error);
                    } else {
                        //recieve and store the user's cookie in the local storage

                        var user = {
                            cookie: data.token,
                            data: data.user_display_name,
                            user_id: data.user_nicename,
                            email: data.user_email
                        };

                        authService.saveUser(user);
                        authService.validateAuth(user);
                        // //getavatar in full size
                        // authService.updateUserAvatar().then(function () {
                        //     deferred.resolve(user);
                        // });
                        deferred.resolve(true);

                    }
                });
            return deferred.promise;
        };
        this.deleteUser = function () {
            window.localStorage.enaqd_user_jwt = null;
            // console.log("user saved : " + user)
        };
       this.saveUser = function (user) {
            window.localStorage.enaqd_user_jwt = JSON.stringify(user);
            // console.log("user saved : " + user)
        };
        this.getUser = function () {

            var data = (window.localStorage.enaqd_user_jwt) ? JSON.parse(window.localStorage.enaqd_user_jwt).data : null,
                cookie = (window.localStorage.enaqd_user_jwt) ? JSON.parse(window.localStorage.enaqd_user_jwt).cookie : null;

            // console.log("user loaded : " + data)

            return {
                data: data,
                cookie: cookie
            };
        };

        this.validateAuth = function () {

            // console.log("validateAuth ...")
            var globals = this.getUser();

            // var globals = user;
            var deferred = $q.defer();
            $http.post(WORDPRESS_WPJSON_URL + 'jwt-auth/v1/token/validate/'
            ).success(function (data) {
                console.log("validated")
                // console.log("user validated!")
                deferred.resolve(data);
            })
                .error(function (data) {

                    deferred.reject(data);
                });
            return deferred.promise;
        };

        // this.doRegister = function (user) {
        //     var deferred = $q.defer(),
        //         nonce_dfd = $q.defer(),
        //         authService = this;
        //
        //     authService.requestNonce("user", "register")
        //         .then(function (nonce) {
        //             nonce_dfd.resolve(nonce);
        //         });
        //
        //     nonce_dfd.promise.then(function (nonce) {
        //         authService.registerUser(user.userName, user.email,
        //             user.displayName, user.password, nonce)
        //             .then(function (data) {
        //                 if (data.status == "error") {
        //                     // return error message
        //                     deferred.reject(data.error);
        //                 } else {
        //                     // in order to get all user data we need to call this function
        //                     // because the register does not provide user data
        //                     authService.doLogin(user).then(function () {
        //                         deferred.resolve(user);
        //                     });
        //                 }
        //             });
        //     });
        //
        //     return deferred.promise;
        // };

        // this.requestNonce = function (controller, method) {
        //     var deferred = $q.defer();
        //     // console.log("Hello World!");
        //     $http.jsonp(WORDPRESS_API_URL + 'get_nonce/' +
        //         '?controller=' + controller +
        //         '&method=' + method +
        //         '&callback=JSON_CALLBACK', {timeout: deferred.promise})
        //         .success(function (data) {
        //             // console.log(data);
        //             deferred.resolve(data.nonce);
        //         })
        //         .error(function (data) {
        //             deferred.reject(data.nonce);
        //         });
        //     return deferred.promise;
        // };

        // this.doForgotPassword = function (username) {
        //     var deferred = $q.defer();
        //     $http.jsonp(WORDPRESS_API_URL + 'user/retrieve_password/' +
        //         '?user_login=' + username +
        //         '&callback=JSON_CALLBACK', {timeout: deferred.promise})
        //         .success(function (data) {
        //             deferred.resolve(data);
        //         })
        //         .error(function (data) {
        //             deferred.reject(data);
        //         });
        //     return deferred.promise;
        // };

        // this.registerUser = function (username, email, displayName, password, nonce) {
        //     var deferred = $q.defer();
        //     $http.jsonp(WORDPRESS_API_URL + 'user/register/' +
        //         '?username=' + username +
        //         '&email=' + email +
        //         '&display_name=' + displayName +
        //         '&user_pass=' + password +
        //         '&nonce=' + nonce +
        //         '&callback=JSON_CALLBACK', {timeout: deferred.promise})
        //         .success(function (data) {
        //             deferred.resolve(data);
        //         })
        //         .error(function (data) {
        //             deferred.reject(data);
        //         });
        //     return deferred.promise;
        // };

        this.userIsLoggedIn = function () {
            var deferred = $q.defer();

            var user = JSON.parse(window.localStorage.enaqd_user_jwt || null);
            // console.log("in userIsLoggedIn :" + user.data.username)
            if (user !== null && user.cookie !== null) {
                this.validateAuth().then(function (data) {
                    console.log("validatin : "+JSON.stringify(data));
                    // console.log("userIsLoggedIn value:" + JSON.stringify(data))
                    deferred.resolve(true);
                }, function (err) {
                    //err
                    console.log("validatin : "+JSON.stringify(err));
                    deferred.resolve(false);
                    // deferred.reject(false);

                });
            }
            else {
                deferred.resolve(false);
            }
            return deferred.promise;
        };

        this.logOut = function () {
            //empty user data

            window.localStorage.enaqd_user = null;
            window.localStorage.enaqd_user_avatar = null;
            window.localStorage.enaqd_user_jwt = null;
            // window.localStorage.enaqd_bookmarks = null;
        };

    })
;
