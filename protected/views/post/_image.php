<?php
/* @var $post SinglePost */

//defaults: full size, wrap and link
if (!isset($size))
	$size = 'full';
$wrap = !isset($wrap) || !empty($wrap);
$link = !isset($link) || !empty($link);

$src = $post->getPostImage($size);
if ($src===false)
	return;

$image = CHtml::image($src, strip_tags($post->post_title), array(
	'class'=>'post-image size-'.$size,
));

if ($link)
	$image = CHtml::link($image, $post->permalink, array(
		'title'=>strip_tags($post->post_title),
		'class'=>'post-image-link link-size-'.$size,
	));

if ( isset($title) )
	$image = $title.$image;

if ($wrap)
	$image = CHtml::tag('div', array(
		'class'=>'post-image-wrap wrap-size-'.$size,
	), $image);

echo $image;
