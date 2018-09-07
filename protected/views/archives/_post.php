<?php
/* @var $this Controller */
/* @var $post ArchivePost */
?>
<div id="<?php echo CHtml::encode($post->id); ?>" class="post non-ajax">
	<?php if ($this->uniqueId!=='category'): ?>
	<span class="category-label">
		<?php echo CHtml::link(CHtml::encode($post->category).' &rarr;', $post->categoryUrl); ?>
	</span>
	<?php endif; ?>
	<h2><?php echo CHtml::link(strip_tags($post->post_title), $post->permalink); ?></h2>
	<?php echo CHtml::link(
		CHtml::encode('By '.$post->author->display_name),
		$post->author->postsLink,
		array('title'=>'Posts by '.$post->author->display_name, 'rel'=>'author')); ?>
</div>
