<?php /* @var $this Controller */ ?>
<?php $this->beginContent('//layouts/main', array('layout'=>'page')); ?>
<div id="blog-wrapper" class="blog-hold">
	
	<div id="page" class="main-area">
		<?php echo $content; ?>
	</div><!-- #post -->
	
</div><!-- #blog-wrapper -->
<?php
$this->renderPartial("/{$this->uniqueId}/_bottom");
$this->endContent();
