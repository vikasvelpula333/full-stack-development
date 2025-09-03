<?php

namespace Config;

use CodeIgniter\Database\Config;

/**
 * Database Configuration
 */
class Database extends Config
{
    /**
     * The directory that holds the Migrations
     * and Seeds directories.
     */
    public string $filesPath = APPPATH . 'Database' . DIRECTORY_SEPARATOR;

    /**
     * Lets you choose which connection group to
     * use if no group is specified in:
     *
     * $forge = \Config\Database::forge($forge);
     */
    public string $defaultGroup = 'default';

    /**
     * The default database connection.
     */
    public array $default = [
        'DSN'          => '',
        'hostname'     => 'localhost',
        'username'     => 'postgres',
        'password'     => 'password',
        'database'     => 'teacher_auth_db',
        'DBDriver'     => 'Postgre',
        'DBPrefix'     => '',
        'pConnect'     => false,
        'DBDebug'      => true,
        'charset'      => 'utf8',
        'DBCollat'     => '',
        'swapPre'      => '',
        'encrypt'      => false,
        'compress'     => false,
        'strictOn'     => false,
        'failover'     => [],
        'port'         => 5432,
        'numberNative' => false,
        'dateFormat'   => [
            'date'     => 'Y-m-d',
            'datetime' => 'Y-m-d H:i:s',
            'time'     => 'H:i:s',
        ],
    ];

    /**
     * This database connection is used when
     * running PHPUnit database tests.
     */
    public array $tests = [
        'DSN'         => '',
        'hostname'    => '127.0.0.1',
        'username'    => 'postgres',
        'password'    => 'password',
        'database'    => 'teacher_auth_test_db',
        'DBDriver'    => 'Postgre',
        'DBPrefix'    => '',
        'pConnect'    => false,
        'DBDebug'     => true,
        'charset'     => 'utf8',
        'DBCollat'    => '',
        'swapPre'     => '',
        'encrypt'     => false,
        'compress'    => false,
        'strictOn'    => false,
        'failover'    => [],
        'port'        => 5432,
    ];

    public function __construct()
    {
        parent::__construct();

        // Ensure that we always set the database group to 'tests' if
        // we are currently running an automated test suite, so that
        // we don't overwrite live data on accident.
        if (ENVIRONMENT === 'testing') {
            $this->defaultGroup = 'tests';
        }

        // Override with environment variables if available
        if (!empty(env('database.default.hostname'))) {
            $this->default['hostname'] = env('database.default.hostname');
        }
        if (!empty(env('database.default.database'))) {
            $this->default['database'] = env('database.default.database');
        }
        if (!empty(env('database.default.username'))) {
            $this->default['username'] = env('database.default.username');
        }
        if (!empty(env('database.default.password'))) {
            $this->default['password'] = env('database.default.password');
        }
        if (!empty(env('database.default.DBDriver'))) {
            $this->default['DBDriver'] = env('database.default.DBDriver');
        }
        if (!empty(env('database.default.port'))) {
            $this->default['port'] = env('database.default.port');
        }
    }
}
