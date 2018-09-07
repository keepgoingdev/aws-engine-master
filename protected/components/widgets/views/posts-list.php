<?php
/* @var $this CWidget */
/* @var $title string */
/* @var $posts ArchivePost[] */
?>

<h1><?php echo CHtml::encode($title); ?></h1>

<ul>
<?php
foreach ($posts as $post) {
	echo '<li>'.CHtml::link($post->post_title, $post->permalink).'</li>';
}
?>
</ul>