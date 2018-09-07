<?php
/* @var $this CWidget */
/* @var $title string */
/* @var $items array */
?>

<h1><?php echo CHtml::encode($title); ?></h1>

<?php
foreach ($items as $year=>$months) { ?>
	<h2><?php echo CHtml::encode($year); ?></h2>
	<ul>
	<?php
	foreach ($months as $month) { ?>
		<li><?php echo CHtml::link($month['title'], $month['url']); ?></li>
	<?php } ?>
	</ul>
<?php } ?>
