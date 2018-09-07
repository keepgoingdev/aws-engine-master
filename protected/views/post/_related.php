<?php
/* @var $this Controller */
/* @var $post SinglePost */
?>
<div class="slide">
	<a href="<?php echo CHtml::encode($post->permalink); ?>">
		<img alt="<?php echo CHtml::encode(strip_tags($post->post_title)); ?>" data-src="<?php echo CHtml::encode($post->getPostImage('full')); ?>">
		<div><span><?php echo CHtml::encode($post->post_title); ?></span></div>
	</a>
</div>
