<?php
	$this->widget('zii.widgets.CMenu', array(
		'id' => 'categories',
		'items' => array(
					array('label' => 'Home', 'url'   => $url->createSiteUrl($url->defaultSite, false)),
					array('label' => 'Hair', 'url'   => $url->createSiteUrl('hair', false)),
					array('label' => 'Makeup', 'url'   => $url->createSiteUrl('makeup', false)),
					array('label' => 'Bags', 'url'   => $url->createSiteUrl('bags', false)),
					array('label' => 'Skincare', 'url'   => $url->createSiteUrl('skincare', false)),
					array('label' => 'Food', 'url'   => $url->createSiteUrl('food', false)),
					array('label' => 'Beauty', 'url'   => $url->createSiteUrl('beauty', false)),
					array('label' => 'Love', 'url'   => $url->createSiteUrl('love', false)),
					array('label' => 'Weightloss', 'url'   => $url->createSiteUrl('weightloss', false)),
					array('label' => 'DIY', 'url'   => $url->createSiteUrl('diy', false)),
					array('label' => 'Diet', 'url'   => $url->createSiteUrl('diet', false)),
					array('label' => 'Lifestyle', 'url'   => $url->createSiteUrl('lifestyle', false)),
					array('label' => 'Shoes', 'url'   => $url->createSiteUrl('shoes', false)),
					array('label' => 'Celebs', 'url'   => $url->createSiteUrl('celebs', false)),
					array('label' => 'Fashion', 'url'   => $url->createSiteUrl('fashion', false)),
					array('label' => 'Wedding', 'url'   => $url->createSiteUrl('wedding', false)),
					array('label' => 'Cooking', 'url'   => $url->createSiteUrl('cooking', false)),
					array('label' => 'Travel', 'url'   => $url->createSiteUrl('travel', false)),
					array('label' => 'Movies', 'url'   => $url->createSiteUrl('movies', false)),
					array('label' => 'Jewelry', 'url'   => $url->createSiteUrl('jewelry', false)),
					array('label' => 'Health', 'url'   => $url->createSiteUrl('health', false)),
					array('label' => 'Parenting', 'url'   => $url->createSiteUrl('parenting', false)),
					array('label' => 'Nails', 'url'   => $url->createSiteUrl('nails', false)),
					array('label' => 'Perfumes', 'url'   => $url->createSiteUrl('perfumes', false)),
					array('label' => 'Money', 'url'   => $url->createSiteUrl('money', false)),
					array('label' => 'Inspiration', 'url'   => $url->createSiteUrl('inspiration', false)),
					array('label' => 'Streetstyle', 'url'   => $url->createSiteUrl('streetstyle', false)),
					array('label' => 'Apps', 'url'   => $url->createSiteUrl('apps', false)),
					array('label' => 'Books', 'url'   => $url->createSiteUrl('books', false)),
					array('label' => 'Fitness', 'url'   => $url->createSiteUrl('fitness', false)),
					array('label' => 'Music', 'url'   => $url->createSiteUrl('music', false)),
					array('label' => 'Running', 'url'   => $url->createSiteUrl('running', false)),
				)
	));
?>
<div class="pic prev">[</div>
<div class="pic next">]</div>
