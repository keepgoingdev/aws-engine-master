<?php /* @var $this Controller */ ?>
<?php
if (!($this->uniqueId==='post' || $this->uniqueId==='page'))
	return;
?>
<style type="text/css">
    .advertiseHere a {
        text-shadow: 0px 0px 2px #999;
        font-size: 10px;
    }
    .advertiseHere a:hover {
        text-decoration: underline;
    }
    .div-gpt-ad {
        width:300px;
        height:250px;
    }
</style>

<script type='text/javascript'>
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function() {
var gads = document.createElement('script');
gads.async = true;
gads.type = 'text/javascript';
var useSSL = 'https:' == document.location.protocol;
gads.src = (useSSL ? 'https:' : 'http:') +
'//www.googletagservices.com/tag/js/gpt.js';
var node = document.getElementsByTagName('script')[0];
node.parentNode.insertBefore(gads, node);
})();
</script>

<?php
// blog-category in lowercase
$unit = Yii::app()->urlManager->currentSite;

//on default site post categories are used
if ($unit===Yii::app()->urlManager->defaultSite) {
	if (isset($this->post) && isset($this->post->categories[0]))
		$unit = $this->post->categories[0]->id;
}

$unit = ucfirst($unit);
if ( !in_array($unit, Yii::app()->params['subblogs']) )
	$unit = 'Lifestyle';
?>

<script type='text/javascript'>
googletag.cmd.push(function() {
googletag.defineSlot('/5445743/AWS_300x250_<?php echo $unit; ?>_Bottom', [300, 250], 'div-gpt-ad-1320724209561-0').addService(googletag.pubads());

if (adLayout==='narrow')
	googletag.defineSlot('/5445743/AWS_120x600_ROS', [120, 600], 'div-gpt-ad-1364832195707-0').addService(googletag.pubads());
else if (adLayout==='wide')
	googletag.defineSlot('/5445743/AWS_300x600_ROS', [300, 600], 'div-gpt-ad-1364832195707-1').addService(googletag.pubads());

<?php
$ref = isset($_SERVER['HTTP_REFERER'])? $_SERVER['HTTP_REFERER'] : null;
if ($ref) {
	if ( strpos($ref, 'allwomenstalk.com') ) $ref = isset($_COOKIE['referrer'])? $_COOKIE['referrer'] : null; //get stored referrer for internal jumps
	elseif ( strpos($ref, 'outbrain.com') ) $ref = 'outbrain';
	elseif ( strpos($ref, 'google.com') ) $ref = 'google';
	elseif ( strpos($ref, 'pinterest.com') ) $ref = 'pinterest';
	elseif ( strpos($ref, 'yahoo.com') ) $ref = 'yahoo';
	elseif ( strpos($ref, 'bing.com') ) $ref = 'bing';
	elseif ( strpos($ref, 'facebook.com') ) $ref = 'facebook';
	elseif ( strpos($ref, 'utm_source=mylikes') ) $ref = 'mylikes';
	else $ref = 'other';
}
if (!$ref) $ref = 'direct';

$host = isset($_SERVER['HTTP_HOST'])? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
$domain = array_reverse( explode('.', $host) );
setcookie('referrer', $ref, 0, '/', '.'.$domain[1].'.'.$domain[0]);
?>
googletag.pubads().setTargeting('referrer', '<?php echo $ref; ?>');
googletag.pubads().setTargeting('post_ID', awsL10n && awsL10n.postID);

googletag.pubads().enableSingleRequest();
googletag.enableServices();
});
</script>
