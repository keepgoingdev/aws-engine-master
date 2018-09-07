<?php
/* @var $this Controller */
/* @var $posts ArchivePost[] */

foreach ($posts as $post) {
	$this->renderPartial('_post', array('post'=>$post));
}
