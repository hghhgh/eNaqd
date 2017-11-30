Version 1.4 - released 21 April 2016

## Misc
- Update Ionic Version to v.1.2.4 
- Update ngcordova
- Update gulp-sass to latest Version
- Added parameter insecure=cool to solve Wordpress SSL
(The latest version of JSON API USER plugin requires https protocol for user authentication. In case you don’t have SSL installed and/or still want to use http protocol, please pass insecure=cool in your request like this)


Version 1.3 - released 8 August 2015

## Misc
- Improved and ease build process
- Update Ionic Version to v.1.0.1
- Update cordova plugins
- Update ngcordova
- Added whitelist plugins
- Added Content-Security-Policy
- Add Sass sourcemaps to ease debugging of the app
- Refactor project structure
- Added youtube javascript API to manage youtube videos

## New Features
- Added example of how to integrate a Wordpress Page
- Preload images (improves UX as important images are preloaded using a loader before showing them to the user)
- Multimedia background (change auth background with a Multimedia one which enables you to use gifs or images as full backgrounds)
- New directive in order to open all external links using inAppBrowser plugin
- Added remove bookmarks functionality

## Styles
- Refactor Sass files structure
- Improved and eased customization of the app (Added theme.variables.scss with different color schemas)

## Documentation
- Brand new documentation!

Version 1.2.0

## Misc
- Improved and ease build process
- Update Ionic Version to v.1.0.0

## Bugs
- fix services.js AuthService.getUser() bug


Version 1.1.0

## Code quality changes:
- Changed href to ui-sref in order to go from one state to another in a click
- Moved all controllers to the same file www/js/controllers.js
- Moved all services to the same file www/js/services.js
- Removed ProfileService
- Refactoring of some controlleres and services

## Wordpress audio post:
- Fix embeding wordpress audio posts

## Walkthrough (login)
- Add show/hide password directive

## Others
- Refresh user avatar from Wp on device ready and on device resume
- Update Ionic version to ionicv1.0rc1
- Added DOCUMENTATION.md with the documentation link

## Bugs
- Don't allow post comments with no content
- Fix audio tag styles conflict with ionic.css by upgrading to ionicv1.0rc1
- Fix slider pager hidden due to ionicv1.0rc1 update
- Fix search results tabs list and bookmarks list style (introduced when upgrading to ionicv1.0rc1)
- Fix audio tag not displaying to 100% on iOS
