<?php /* @var $this Controller */ ?>
<?php $this->beginContent('//layouts/main', array('layout'=>'blog')); ?>
<div id="main">
<div id="posts" class="box-hold">
	<?php echo $content; ?>
</div>
</div><!-- #main -->

<div id="infinite-more" class="loading-icon"><div class="spinner">1</div></div>

<noscript><div class="pagination">
	<?php echo CHtml::link('Archive', Yii::app()->urlManager->createSiteUrl().'/archive', array('id'=>'archive-link')); ?>
</div></noscript>
<script type="text/javascript">
	e('posts.DOMProgress.AWS');
</script>
<?php $this->endContent(); ?>