<?php
define('WP_CACHE', true); // Added by WP Rocket
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'enaqdcom_aigroup2');

/** MySQL database username */
define('DB_USER', 'enaqdcom_asli2');

/** MySQL database password */
define('DB_PASSWORD', 'Rad2017@behrooz#');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'K><c|q<C&a0;Ag:j;p>V|:%^$os jFswT+G[Biq[7##7t<)6+0w%?.!{}d>6w?.0');
define('SECURE_AUTH_KEY',  'k=d|(!ZUss8D0rBY>Rg(-RjkCzNC{cNgfj(f1d!#S0pL6/h5IC@lAUxdgHa+g|^4');
define('LOGGED_IN_KEY',    '>e}aPrFAMSeK|C<)h/v)5@ y5=~pqGaHhy-g$#jJU8hvDF>7X/*+=*z_b_;$[&S:');
define('NONCE_KEY',        '>0J*TexLEXdMAS@D9L+rweqRZy6c$gE2r+=K*6RJ@l%XCN=>#=^>i~ -_G?|5>Ls');
define('AUTH_SALT',        ' +Myt{ESy ;{rbIlRzbEQhzxZS4)EA*P:q43yBjss^Wc*w(!uVQt?Od[mj*B&g|T');
define('SECURE_AUTH_SALT', 'JJM&H20[sYk2BsP20R|;$>|jhgxEtgKd-lN9H3qCM9.^pM4)M){^_,%}SYK=3DwR');
define('LOGGED_IN_SALT',   'Y~$C&BV=owLj!6!Z^uvy dgm>A|L[eqhU4xUW|fy< 4q$`edz/c{-;+o1)d<R_)p');
define('NONCE_SALT',       '@ETh^Q+Smv?56Z~Z&n-Ton/u]//|#Z3-)1N,iMIc3 |Rx{C[ztl%Lk]z-QifV9FZ');

/**#@-*/

define('JWT_AUTH_SECRET_KEY', 'm1,xpL/c(y>~ fW3C_*K|r`IkQQmxb|Tb2(_^g~}9M*I87^L%t<hEmtEeh#-|[V_');
define('JWT_AUTH_CORS_ENABLE', true);


/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
/* in ghesmato man ezafe kardam */
define( 'WP_AUTO_UPDATE_CORE', false );
