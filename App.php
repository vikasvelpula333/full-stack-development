<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class App extends BaseConfig
{
    /**
     * Base Site URL
     */
    public string $baseURL = 'http://localhost:8080/';

    /**
     * Allowed Hostnames
     */
    public array $allowedHostnames = [];

    /**
     * Index File
     */
    public string $indexPage = '';

    /**
     * URI PROTOCOL
     */
    public string $uriProtocol = 'REQUEST_URI';

    /**
     * Default Locale
     */
    public string $defaultLocale = 'en';

    /**
     * Negotiate Locale
     */
    public bool $negotiateLocale = false;

    /**
     * Supported Locales
     */
    public array $supportedLocales = ['en'];

    /**
     * Application Timezone
     */
    public string $appTimezone = 'UTC';

    /**
     * Default Character Set
     */
    public string $charset = 'UTF-8';

    /**
     * Force Global Secure Requests
     */
    public bool $forceGlobalSecureRequests = false;

    /**
     * Session Variables
     */
    public array $sessionDriver            = 'CodeIgniter\Session\Handlers\FileHandler';
    public array $sessionCookieName        = 'ci_session';
    public array $sessionExpiration        = 7200;
    public array $sessionSavePath          = null;
    public array $sessionMatchIP           = false;
    public array $sessionTimeToUpdate     = 300;
    public array $sessionRegenerateDestroy = false;

    /**
     * Cookie Prefix
     */
    public string $cookiePrefix   = '';
    public string $cookieDomain   = '';
    public string $cookiePath     = '/';
    public bool   $cookieSecure   = false;
    public bool   $cookieHTTPOnly = true;
    public string $cookieSameSite = 'Lax';

    /**
     * Reverse Proxy IPs
     */
    public array $proxyIPs = [];

    /**
     * CSRF Protection
     */
    public array $CSRFProtection  = [
        'csrf'     => false,
        'methods'  => ['post', 'put', 'patch'],
        'header'   => 'X-CSRF-TOKEN',
        'cookie'   => 'csrf_cookie_name',
        'expires'  => 7200,
        'regenerate' => true,
        'redirect' => true,
    ];

    /**
     * Content Security Policy
     */
    public array $CSPEnabled = false;
}
