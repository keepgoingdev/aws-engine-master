<?php /* @var $this Controller */ ?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" <?php if (isset($layout)) echo "class=\"layout-$layout\""?>>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
	
	<meta name="language" content="en" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

	<!-- Facebook Open Graph Tags -->
	<meta property="fb:app_id" content="<?php echo CHtml::encode($this->openGraph->app_id) ?>" />
	<meta property="og:site_name" content="<?php echo CHtml::encode($this->openGraph->site_name) ?>" />
	<meta property="og:title" content="<?php echo CHtml::encode($this->openGraph->title) ?>" />
	<meta property="og:description" content="<?php echo CHtml::encode($this->openGraph->description) ?>" />
	<meta property="og:type" content="<?php echo CHtml::encode($this->openGraph->type) ?>" />
	<meta property="og:url" content="<?php echo CHtml::encode($this->openGraph->url) ?>" />
	<meta property="og:image" content="<?php echo CHtml::encode($this->openGraph->image) ?>" />
	<!-- End Facebook Open Graph Tags -->
	
	<?php 
	$parselyMeta = (array)$this->parselyMeta;
	if (!empty($parselyMeta)): ?>
	<meta name="parsely-page" content='<?php echo json_encode($parselyMeta, JSON_HEX_APOS | JSON_HEX_QUOT); ?>' />
	<?php endif; ?>

	<link rel="apple-touch-icon" href="http://allwomenstalk.com/images/icons/Icon.png" />
	<link rel="apple-touch-icon" sizes="72x72" href="http://allwomenstalk.com/images/icons/Icon72.png" />
	<link rel="apple-touch-icon" sizes="114x114" href="http://allwomenstalk.com/images/icons/Icon114.png" />
	<link rel="apple-touch-icon" sizes="144x144" href="http://allwomenstalk.com/images/icons/Icon144.png" />
	
	<script type="text/javascript"><!--
	var adLayout = 'narrow';
	if (isLayout('(max-width: 919px)'))
		adLayout = 'none';
	if (isLayout('(min-width: 1099px)'))
		adLayout = 'wide';
	//set layout class ad the beginning, because we can't reload ads if resolution changes
	$('html').addClass('ad-layout-'+adLayout);
	//-->
	</script>
	<?php $this->renderPartial('/adv/header'); ?>
	<?php echo CHtml::script('e(\'head.DOMProgress.AWS\');')?>
	<?php $this->renderPartial('/analytics'); ?>

	<script type="text/javascript">
	function downloadJSAtOnload() {
		if (awsL10n.isSingle) {
			var scriptImgSource = document.createElement("script");
				scriptImgSource.src = "http://gem.allw.mn/ext/get_img_source.js";
			document.body.appendChild(scriptImgSource);
		}
	}

	// Check for browser support of event handling capability
	if (window.addEventListener)
		window.addEventListener("load", downloadJSAtOnload, false);
	else if (window.attachEvent)
		window.attachEvent("onload", downloadJSAtOnload);
	else window.onload = downloadJSAtOnload;
   </script>
</head>
<body>
	<div id="wrapper">
		<div id="header">
			<div id="top">
				<div id="logo"><a href="/">All Women Stalk</a></div>
				<a href="#" id="menu-link" class="top-link" data-icon="l" title="Menu"></a>
				<span id="header-links">
					<form method="get" action="#search" class="search-box"><label for="search-input-header" class="pic">s</label><input id="search-input-header" name="query" type="text" placeholder="Search Posts, Authors, etc."/></form>
					<a id="activity-bt" href="#" data-href="#activity" class="top-link" data-icon="G" title="Activity">
						<span class="bubble" style="display: none;"></span>
					</a>
					<a href="http://allwomenstalk.com/about" data-href="#about" class="top-link" data-icon="i" title="About"></a>
				</span>
			</div>
			<div id="menu">
				<?php $this->renderPartial('/mainmenu', array('url' => Yii::app()->urlManager)); ?>
			</div>
		</div>
		<?php echo CHtml::script('e(\'header.DOMProgress.AWS\');')?>
		<?php echo $content; ?>
		
	</div><!-- #wrapper -->
	
	<div class="overlay hidden"><div id="popup">
		<div id="popup-header"></div>
		<div id="popup-content"><div id="popup-content-inner"></div></div>
		<a href="#" data-href="" id="popup-close" data-icon="D"></a>
	</div></div>
	
	<div id="templates">
	<div id="tmpl-copyright">
		<ul>
		<li><a href="http://allwomenstalk.com/about/">About</a></li>
		<li><a href="http://allwomenstalk.com/contacts/">Contact</a></li>
		<li><a href="http://allwomenstalk.com/advertising/">Advertise</a></li>
		<li><a href="<?php echo CHtml::encode(Yii::app()->request->baseUrl.'/archive'); ?>">Archive</a></li>
		<li><a href="http://eepurl.com/kWZaL" target="_blank">Subscribe for newsletter</a></li>
		<li><a href="http://facebook.com/allwomenstalk" target="_blank">Join on facebook</a></li>
		<li><a href="http://twitter.com/allwomenstalk/" target="_blank">Follow on Twitter</a></li>
		</ul>
		© 2012 all women stalk
	</div><!-- #copyright -->
	</div>
	
	<div id="modalImage">
		<div class="modalImageBG"></div>
		<div class="modalImage"></div>
	</div>

	<div id="modalPopup" class="modal fade">
		<div class="modal-header">
			<span class="close" data-dismiss="modal" data-icon="*"></span>
		</div>
		<div class="modal-body"></div>
	</div>

	<?php echo CHtml::script('e(\'footer.DOMProgress.AWS\');'); ?>
	<?php $this->renderPartial('/footer-scripts'); ?>
	
	<script type="text/javascript">
	asyncLoad("http://static.allw.mn/mobilebanner.js");
	</script>
	<!-- START Parse.ly Include: Standard -->
	<div id="parsely-root" style="display: none">
	  <div id="parsely-cfg" data-parsely-site="allwomenstalk.com"></div>
	</div>
	<script>
	(function(s, p, d) {
	  var h=d.location.protocol, i=p+"-"+s,
	      e=d.getElementById(i), r=d.getElementById(p+"-root"),
	      u=h==="https:"?"d1z2jf7jlzjs58.cloudfront.net"
	      :"static."+p+".com";
	  if (e) return;
	  e = d.createElement(s); e.id = i; e.async = true;
	  e.src = h+"//"+u+"/p.js"; r.appendChild(e);
	})("script", "parsely", document);
	</script>
	<!-- END Parse.ly Include -->
</body>
</html>
