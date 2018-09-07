<script type="text/javascript" >//<![CDATA[
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-17514583-34']);
_gaq.push(['_setDomainName','.allwomenstalk.com'],['_trackPageview']);
<?php if( $this instanceof PostController ) { $post = $this->getPost(); ?>
_gaq.push(['_setCustomVar',1,'author','<?php echo $post['_embedded']['author']['_id']; ?>',3],['_setCustomVar',2,'tags','<?php
$tags = '';
$first = true;
foreach($post['tags'] as $tag) {
	if( strlen($tags.' '.$tag)>60 ) break; // name+param max 128 byte
	if($first) $first = false;
	else $tags .= ' ';
	$tags .= $tag;
}
echo $tags;
?>',3],['_setCustomVar',3,'year','<?php echo date('Y', strtotime($post['post_date'])); ?>',3],['_setCustomVar',4,'category','<?php
$cats = '';
$first = true;
foreach($post['categories'] as $cat) {
	if( strlen($cats.' '.$cat->id)>52 ) break;
	if($first) $first = false;
	else $cats .= ' ';
	$cats .= $cat->id;
}
echo $cats;
?>',3]);
<?php } ?>
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
//]]></script>
