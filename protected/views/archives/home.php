<?php
/* @var $this HomeController */
/* @var $posts ArchivePost[] */
/* @var $mlPosts ArchivePost[] */
?>
<?php if (!Yii::app()->urlManager->isDefaultSite()): ?>
	<noscript>
	<?php
	echo CHtml::link('Most Liked', array('home/archive', 'orderBy'=>'most_liked'));
	echo CHtml::link('Most Commented', array('home/archive', 'orderBy'=>'most_commented'));
	?>
	</noscript>
<?php
endif;

foreach ($posts as $post) {
	$this->renderPartial('_post', array('post'=>$post));
}

//show 5 most liked posts
foreach ($mlPosts as $post) {
	$this->renderPartial('_post', array('post'=>$post));
}
