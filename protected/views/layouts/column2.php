<?php /* @var $this Controller */ ?>
<?php $this->beginContent('//layouts/main', array('layout'=>'post')); ?>
<div id="blog-wrapper" class="blog-hold">

	<?php $this->renderPartial('/post/_meta', array('post'=>$this->post, 'author'=>$this->post->author)); ?>

	<div id="single" class="main-area">
		<?php echo $content; ?>
	</div><!-- #single -->
	
	<div class="sidebar-area">
		<div id="sidebar-wrapper">
			<div id="sidebar">
			<?php $this->renderPartial("/{$this->uniqueId}/_sidebar"); ?>
			</div>
		</div>
	</div>
	
	<?php echo Chtml::script('e(\'sidebar.DOMProgress.AWS\');')?>
	
</div><!-- #blog-wrapper -->
<?php
$this->renderPartial("/{$this->uniqueId}/_bottom");
$this->endContent();
?>
