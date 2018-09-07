<?php
/* @var $this PageController */

$this->widget('MostLikedWidget');
$this->widget('MostCommentedWidget');
if (Yii::app()->urlManager->isDefaultSite())
	$this->widget('ArchivesWidget', array('start'=>mktime(0, 0, 0, 1, 1, 2005), 'end'=>time()));
