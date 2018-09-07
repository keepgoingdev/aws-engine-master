<?php

define('AWS_VERSION', '3.4.4');

//set paths that is needed on early stages
Yii::setPathOfAlias('approot', dirname(__DIR__));
Yii::setPathOfAlias('local', dirname(dirname(__DIR__)).DIRECTORY_SEPARATOR.'local');
Yii::import('approot.helpers.Utils');

$params = Utils::includeArray('params.php', __DIR__);

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
$config = array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'All Women Stalk',
	'defaultController'=>'home/Archive',
	// preloading application components
	'preload'=>array('log'),

	// autoloading model and component classes
	'import'=>array(
		'application.models.*',
		'application.components.*',
		'application.components.widgets.*',
        'application.helpers.ConvertData',
		'ext.*'
	),
	
	'onBeginRequest'=>array('Utils', 'loadSiteConfig'),

	// application components
	'components'=>array(
		'urlManager'=>array(
			'class'=>'SiteUrlManager',
			'defaultSite'=>'aws',
			'siteUrlPattern'=>'http://<?site:{[\w-]+}.>allwomenstalk.com',
			'urlFormat'=>'path',
			'showScriptName'=>false,
			'rules'=>array(
				'<orderBy:(most_liked|most_commented|latest)>'=>'home/archive',
				'<year:\d\d\d\d><?month:/{\d\d}><?day:/{\d\d}>'=>'date/archive',

				//static pages
				'<name:[\w\-]+>'=>'page/view',

				//posts with page number
				'<name:[\w\-]+>/<page:\d+>'=>'post/view',
				
				//posts using alternate syntax because of same pattern (used only for URL creation)
				array('post/view', 'pattern'=>'<name:[\w\-]+>'),
				
				'category/<name:[\w\-]+>/<orderBy:(most_liked|most_commented|latest)>'=>'category/archive',
				'category/<name:[\w\-]+>'=>'category/archive',
				'author/<name:[\w\-]+>'=>'author/archive',
				'tag/<name:[\w\-]+>'=>'tag/archive',
			),
		),
		'clientScript'=>Utils::includeArray('assets.php', __DIR__),
		'api'=>array(
			'class'=>'application.components.AwsApi',
			'contentApiUrl'=>$params['contentApi']
		),
		'errorHandler'=>array(
			// use 'site/error' action to display errors
			'errorAction'=>'site/error',
		),
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'enabled'=>YII_DEBUG,
					'levels'=>'error, warning',
				),
				array(
					'class'=>'CWebLogRoute',
					'enabled'=>YII_DEBUG,
				),
			),
		),
	),
	
	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>$params,
);

$localConfig = Utils::findLocalFile('main.php', __DIR__);
if ($localConfig)
	$config = CMap::mergeArray($config, include($localConfig));

return $config;
