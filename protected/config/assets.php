<?php
//TODO: separate scripts & styles packages on the basis of its purposes

if (YII_DEBUG) {
	//load assets lists
	$css = file(__DIR__.'/styles.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	$js = file(__DIR__.'/scripts.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	
	//use local assets
	$styles = array(
		'basePath'=>'webroot.css',
		'baseUrl'=>'css',
		'css'=>$css
	);
	
	$base = array(
		'basePath'=>'webroot.js',
		'baseUrl'=>'js',
		'js'=>$js
	);
} else {
	//use local compiled assets, it will be remapped to common later
	$styles = array(
		'basePath'=>'webroot.assets',
		'baseUrl'=>'assets',
		'css'=>array('all-'.AWS_VERSION.'.min.css')
	);
	
	$base = array(
		'basePath'=>'webroot.assets',
		'baseUrl'=>'assets',
		'js'=>array('all-'.AWS_VERSION.'.min.js')
	);
}

//add external assets
$styles['css'] = array_merge($styles['css'], array(
	'fonts.css',
	'oswald.css' //fake, will be replaced with Google web font
));

$base['js'] = array_merge($base['js'], array(
	'auth_ui.js',
));

$clientScript = array(
	'class'=>'ext.ExtendedClientScript.ExtendedClientScript',
	'combineJs'=>false,
	'compressJs'=>false,
	'packages'=>array(
		'styles'=>$styles,
		'base'=>$base,
	),
	'scriptMap'=>array(
		'oswald.css'=>'http://fonts.googleapis.com/css?family=Oswald:300',
		'auth_ui.js'=>'http://auth2.allwomenstalk.com/media/js/auth_ui.js'
	),
);

//remap to common styles file of appropriate version on production
if (!YII_DEBUG) {
	$clientScript['scriptMap']['all-'.AWS_VERSION.'.min.css'] = 'http://asset.allw.mn/all-'.AWS_VERSION.'.min.css';
	$clientScript['scriptMap']['fonts.css'] = 'http://asset.allw.mn/fonts.css';
	$clientScript['scriptMap']['all-'.AWS_VERSION.'.min.js'] = 'http://asset.allw.mn/all-'.AWS_VERSION.'.min.js';
}

return $clientScript;
