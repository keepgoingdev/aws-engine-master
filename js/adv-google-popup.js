var advPopup = {
	init: function() {
		if ( this.isCookieEnabled() ) {
			this.setCookie();
			this.addStyles();
			this.addHtml();
			this.setTimer();
			this.showAdv();

			window.addEventListener("orientationchange", function() {
				advPopup.close();
			}, false);
		}
	},
	isCookieEnabled: function() {
		setCookie("testing", "testValue", 1);
		if (getCookie("testing") == null)
			return false;

		setCookie("testing", "testValue", -1);
		return true;
	},
	setCookie: function() {
		setCookie("adSenseInterstitial", "adSenseInterstitialValue", {domain: '.allwomenstalk.com', expires: 86400});
	},
	setTimer: function() {
		var count = document.documentElement.clientWidth < 600 ? 10 : 30;
		window.setTimeout(this.close, count*1000);

		$('#timer').html(count);
		var counter = setInterval(function(){
			if (--count <= 0) {
				clearInterval(counter);
				return;
			}
			$('#timer').html(count);
		}, 1000);
	},
	close: function() {
		$('#interstitialAdUnit').hide();
		$('#interstitialBackground').hide();
	},
	showAdv: function() {
		var adsGoogle = document.createElement('script');
			adsGoogle.type = 'text/javascript';
			adsGoogle.src = 'http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
		document.body.appendChild(adsGoogle);

		(adsbygoogle = window.adsbygoogle || []).push({ params: { google_ad_slot: 1568771323 } });
	},
	addHtml: function() {
		$('body').append('<div id="interstitialBackground" onclick="advPopup.close();">');

		var unit = $('<div id="interstitialAdUnit" />');
		var title = $('<div id="interstitialTitle" />').text('Advertisement');
		var left = $('<div id="interstitialLeft" />').html(
			'<ins class="adsbygoogle" data-ad-client="ca-pub-2960246837266762" style="width:300px;height:250px;"></ins>'
		);
		var right = $('<div id="interstitialRight" />').html(
			'<div id="closeAdBlock" onclick="advPopup.close();">'+
				'<div id="closeAdText"><center>Close Ad</center></div>'+
				'<div id="closeAdX">X</div>'+
				'<div id="timerText"><center><span id="timer"></span> seconds until close</center></div>'+
			'</div>'+
			'<div id="whyThisAd">'+
				'<div id="whyThisAdTitle">'+
					'Why am I seeing this ad?'+
				'</div>'+
				'<div id="whyThisAdContent">'+
					"These ads keep all content free for you."+
				'</div>'+
				'<div id="whyThisAdLink">'+
					'<a href="http://support.google.com/adsense/bin/static.py?hl=en&ts=1631343&page=ts.cs&rd=1&contact=abg_afc" style="text-decoration:none;">'+
					'Learn more about ads</a>'+
				'</div>'+
			'</div>' );

		unit.append(title, left, right).appendTo('body');
	},
	addStyles: function() {
		var css =
'@media screen and (max-width:600px) and (min-width: 300px) and (min-height: 400px) {'+
	'#interstitialAdUnit {'+
		'width: 300px;'+
		'height: 400px;'+
		'z-index: 1100;'+
		'position:fixed;'+
		'left:50%;'+
		'top:0;'+
		'margin-top: 10px;'+
		'margin-left:-150px;'+
		'font-family: "Arial", Helvetica, sans-serif;'+
	'}'+
	'#interstitialBackground {'+
		'position: fixed;'+
		'left: 0;'+
		'top: 0;'+
		'background-color: black;'+
		'-moz-opacity: 0.8;'+
		'opacity: .80;'+
		'filter: alpha(opacity=80);'+
		'width: 100%;'+
		'height: 100%;'+
		'z-index: 1090;'+
	'}'+
	'#interstitialRight {'+
		'cursor: pointer;'+
		'width:300px;'+
		'height: 300px;'+
		'float: left;'+
		'color: gray;'+
		'margin-top:10px;'+
	'}'+
	'#closeAdBlock{'+
		'height:90px;'+
		'background-color: black;'+
		'line-height: 60px;'+
		'font-size: 30px;'+
	'}'+
	'#closeAdBlock:hover{'+
		'background-color: #181818;'+
	'}'+
	'#closeAdText {'+
		'width:195px;'+
		'float:left;'+
		'padding-left: 15px;'+
	'}'+
	'#closeAdX {'+
		'width: 85px;'+
		'font-size: 50px;'+
		'line-height: 60px;'+
		'float: left;'+
		'padding-right: 5px;'+
	'}'+
	'#timerText {'+
	   'font-size: 14px;'+
	   'line-height: 14px;'+
	'}'+
	'#interstitialTitle {'+
		'width:300px;'+
		'height: 25px;'+
		'clear: both;'+
		'color: white;'+
		'text-align: center;'+
	'}'+
	'#interstitialLeft {'+
		'float:left;'+
		'width:300px;'+
		'height:250px;'+
		'background-color: #DEDEDE;'+
	'}'+
	'#whyThisAd {'+
		'display:none;'+
	'}'+
'}'+
'@media screen and (min-width:600px) and (min-height: 400px){'+
	'#interstitialAdUnit {'+
		'width: 550px;'+
		'height: 280px;'+
		'z-index: 1100;'+
		'position:fixed;'+
		'top:50%;'+
		'left:50%;'+
		'margin-top:-140px;'+
		'margin-left:-275px;'+
		'font-family: "Arial", Helvetica, sans-serif;'+
	'}'+
	'#interstitialBackground {'+
		'position: fixed;'+
		'left: 0;'+
		'top: 0;'+
		'background-color: black;'+
		'-moz-opacity: 0.8;'+
		'opacity: .8;'+
		'filter: alpha(opacity=80);'+
		'width: 100%;'+
		'height: 100%;'+
		'z-index: 1090;'+
	'}'+
	'#interstitialTitle {'+
		'width:300px;'+
		'height: 25px;'+
		'clear: both;'+
		'color:white;'+
		'text-align: center;'+
	'}'+
	'#interstitialLeft {'+
		'float:left;'+
		'width:300px;'+
		'height:250px;'+
		'margin-right:10px;'+
		'background-color: #DEDEDE;'+
	'}'+
	'#interstitialRight {'+
		'cursor: pointer;'+
		'width:230px;'+
		'height: 300px;'+
		'float: left;'+
		'color: gray;'+
	'}'+
	'#closeAdBlock{'+
		'height:90px;'+
		'background-color: black;'+
		'font-size: 30px;'+
	'}'+
	'#closeAdBlock:hover{'+
		'background-color: #181818;'+
	'}'+
	'#closeAdText {'+
		'width:160px;'+
		'float:left;'+
		'text-align:center;'+
		'line-height: 60px;'+
		'height: 60px; '+
		'padding-left:10px;'+
	'}'+
	'#closeAdX {'+
		'width:60px;'+
		'font-size: 50px;'+
		'line-height: 60px;'+
		'float: left;'+
	'}'+
	'#timerText {'+
	   'font-size: 14px;'+
	   'line-height: 14px;'+
	'}'+
	'#whyThisAd {'+
		'background-color: #DEDEDE;'+
		'float:left;'+
		'width:220px;'+
		'height: 140px;'+
		'margin-top: 10px;'+
		'color: black;'+
		'padding: 5px;'+
		'font-family: "Trebuchet MS", Helvetica, sans-serif;'+
	'}'+
	'#whyThisAdTitle {'+
		'height: 25px;'+
		'margin: 5px;'+
	'}'+
	'#whyThisAdContent {'+
		'font-size: 14px;'+
		'margin-left: 10px;'+
		'margin-right: 10px;'+
		'height: 40px;'+
	'}'+
	'#whyThisAdLink {'+
		'float:right;'+
		'font-size: 14px;'+
		'padding-top:50px;'+
		'padding-right: 5px;'+
	'}'+
'}'+
'@media screen and (max-width:300px){'+
	'#interstitialAdUnit{display:none;}'+
	'#interstitialBackground{display:none;}'+
'}'+
'@media screen and (max-height:400px){'+
	'#interstitialAdUnit{display:none;}'+
	'#interstitialBackground{display:none;}'+
'}';

		var style = document.createElement('style');
			style.type = 'text/css';

		if (style.styleSheet)
			style.styleSheet.cssText = css;
		else
			style.appendChild(document.createTextNode(css));

		document.getElementsByTagName('head')[0].appendChild(style);
	}
};

advPopup.init();
