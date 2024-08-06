<?php
ini_set('display_errors', 1);
ini_set('error_reporting', -1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

$user = $_GET['userspoof'] ?: 'default';

$debug = $user;
echo '<pre>';
print_r($debug);
echo '</pre>';