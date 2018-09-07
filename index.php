<?php

// change the following paths if necessary
$yii=dirname(__FILE__).'/yii/framework/yii.php';
$config=dirname(__FILE__).'/protected/config/main.php';

$start = __DIR__.DIRECTORY_SEPARATOR.'local'.DIRECTORY_SEPARATOR.'start.php';
if (file_exists($start))
	include $start;

require_once($yii);
Yii::createWebApplication($config)->run();
