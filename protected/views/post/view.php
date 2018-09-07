<?php
/* @var $this PostController */
/* @var $post SinglePost */
?>
<div class="post">
	<?php
	$title = strip_tags($post->post_title);
	$title_html = CHtml::tag(
		$post->page>0 ? 'strong' : 'h1',
		array('class' => 'entry-title'),
		CHtml::link($title, $post->permalink, array('title' => $title))
	);
	
	if ($post->page>0) {
		echo $title_html;
	} else {
		$this->renderPartial('_image', array(
			'post'=>$post,
			'size'=>'full',
			'wrap'=>true,
			'link'=>false,
			'title'=>$title_html
		));
	}
	?>
	
	<div id="content">
        <div id="page-<?php echo $post->page + 1 ?>" class="post-page">
        <div class="post-box">
        <?php
		//TODO: anti-XSS filtering
		echo preg_replace('/<!--more(.*?)?-->/', $this->renderPartial('/adv/post-more', array('post'=>$post), true), $post->content);
		?>
        </div>
        </div>
	</div>
	
	<div id="share"><span>Pass it on via </span>
            <a href="#" id="soc-fb">Facebook</a> <a href="#" id="soc-tw">Twitter</a> <a href="#" id="soc-em">Email</a>
	</div>
	
    <?php $this->renderPartial('_pagination', array('post'=>$post)); ?>

    <?php $this->renderPartial('/adv/post-after', array('post'=>$post)); ?>
	
	<div id="popular-comments" class="post-box">
		<div class="spinner">1</div>
		<div id="show-comments">
			<button name="show-comments" class="bt-link">See all comments</button>
		</div>
	</div>
	
	<?php $this->renderPartial('_tags', array('post'=>$post)); ?>
	
	<?php if (!empty($related)): ?>
		<div id="related"><div class="slider">
		<?php
		foreach ($related as $p) {
			$this->renderPartial('_related', array('post'=>$p));
		}
		?>
		</div></div>
	<?php endif; ?>

</div>
