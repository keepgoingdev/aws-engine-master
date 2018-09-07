<?php
/* @var $this PostController */
/* @var $post SinglePost */
/* @var $author Author */
?>
<div id="single-author-block">
	<?php if ($av=$author->getAvatar(80)): ?>
	<div class="image">
		<?php echo CHtml::image($av, $author->display_name, array(
			'class'=>'avatar avatar-80 photo',
			'width'=>32,
			'height'=>32,
		)); ?>
	</div>
	<button name="like-post" id="post-likes" class="bt-btn"> <?php
		echo Utils::shortenInt($post->likes);
	?></button>
	<?php endif; ?>
	<div>
		By <?php echo CHtml::link(CHtml::encode($author->display_name), $author->postsLink, array(
			'title'=>'Posts by '.$author->display_name,
			'rel'=>'author',
		)); ?>
	</div>
	<?php
	if ($gPlus=$author->gPlusLink)
		echo CHtml::link(
				CHtml::encode($author->display_name.' Google+'),
				$gPlus,
				array('class'=>'author-gplus')
			);
	?>
	<div class="counter">
		<span class="time">
			<?php echo Utils::timeAgo($post->post_date); ?>
		</span>
		<?php if ($post->comment_count>0): ?>
		<span class="comments"> <?php
			echo Utils::shortenInt($post->comment_count);
		?></span>
		<?php endif; ?>
	</div>
</div>
