<?php

/**
 * CodeIgniter Teacher Authentication System
 * 
 * A modern authentication system built with CodeIgniter 4 and JWT
 * 
 * @package CodeIgniter
 * @author  Your Name
 * @license MIT License
 * @since   Version 4.0.0
 */

// Path to the front controller (this file)
define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);

/*
 *---------------------------------------------------------------
 * BOOTSTRAP THE APPLICATION
 *---------------------------------------------------------------
 * This process sets up the path constants, loads and registers
 * our autoloader, along with Composer's, loads our constants
 * and fires up an environment-specific bootstrapping.
 */

// Ensure the current directory is pointing to the front controller's directory
chdir(__DIR__);

// Load our paths config file
// This is the line that might need to be changed, depending on your folder structure.
require FCPATH . '../app/Config/Paths.php';
// ^^^ Change this line if you move your application folder

$paths = new Config\Paths();

// Location of the framework bootstrap file.
require $paths->systemDirectory . '/bootstrap.php';

// Load environment variables from .env file, if it exists.
// Don't forget to update your .env.example file.
$app = Config\Services::codeigniter();
$app->initialize();
$context = is_cli() ? 'php-cli' : 'web';
$app->setContext($context);

$response = $app->run();
$response->send();
