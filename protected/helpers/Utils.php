<?php

class Utils {
	
	/**
	 * Load site-specific configuration
	 * 
	 * Event handler for the onBeginRequest application event.
	 * Overrides global application parameters (@see CWebApplication::$params) from:
	 * 1. Current site element from array in protected/config/sites-params.php.
	 * 2. Current site file under local/<site>/config/params.php.
	 * Also overrides applicetion configuration from local/<site>/config/main.php.
	 * NOTE: this function should be run when URL manager already initialized, so site-specific configuration
	 * may not be available on early stages.
	 * 
	 * @param CEvent $event
	 */
	public static function loadSiteConfig($event) {
		$site = Yii::app()->urlManager->currentSite;
		
		$sitesParams = self::includeArray('sites-params.php', Yii::getPathOfAlias('approot.config'));
		if (isset($sitesParams[$site]))
			Yii::app()->params->mergeWith($sitesParams[$site]);
		
		$localSiteParams = self::findLocalFile($site.DIRECTORY_SEPARATOR.'config'.DIRECTORY_SEPARATOR.'params.php');
		if ($localSiteParams)
			Yii::app()->params->mergeWith(include($localSiteParams));
		
		$siteConfig = self::findLocalFile($site.DIRECTORY_SEPARATOR.'config'.DIRECTORY_SEPARATOR.'main.php');
		if ($siteConfig)
			Yii::app()->configure(include($siteConfig));
	}
	
	/*
	 * Local files functions
	 * Local files are specific for particular site and are meant to override
	 * common files or extend common configuration.
	 * Local files is located in webroot.local directory. When a file is searched,
	 * its path relative to application root will be extracted and it will be used
	 * to find local equivalent in the local directory.
	 */
	
	/**
	 * Returns path to local file if it exists, otherwise to common file
	 * 
	 * @param string $file File path (relative to $dir or absolute).
	 * @param string $dir Directory in which file is located. If null, application root
	 * will be used.
	 * @return string|false Resolved file path or false if file is not found.
	 */
	public static function findFile($file, $dir=null) {
		if ($localFile=self::findLocalFile($file, $dir))
			return $localFile;
		return self::findCommonFile($file, $dir);
	}
	
	/**
	 * Include array from common file and extend it with array from local file
	 * 
	 * @param string $file Array file path (relative to $dir or absolute).
	 * @param string $dir Directory in which file is located. If null, application root
	 * will be used.
	 * @return array Resulting array.
	 */
	public static function includeArray($file, $dir=null) {
		$res = array();
		
		//find and include main file from application root
		$mainFile = self::findCommonFile($file, $dir);
		if ($mainFile)
			$res = include($mainFile);
		
		//find and include local file
		$localFile = self::findLocalFile($file, $dir);
		if ($localFile)
			$res = CMap::mergeArray($res, include($localFile));
		
		return $res;
	}
	
	/**
	 * Returns path to common file if it exists
	 *
	 * @param string $file File path (relative to $dir or absolute).
	 * @param string $dir Directory in which file is located. If null, application root
	 * will be used.
	 * @return string|false Resolved file path or false if file is not found.
	 */
	public static function findCommonFile($file, $dir=null) {
		$root = Yii::getPathOfAlias('approot');
		if (is_null($dir))
			$dir = $root;
		
		if (preg_match('/^(?:\/|\\\\|\w\:\\\\).*$/', $file)) { //is absolute path given?
			$mainFile = $file;
		} else {
			//find main file from application root
			$mainFile = $dir.DIRECTORY_SEPARATOR.$file;
		}
		
		if (is_file($mainFile))
			return $mainFile;
		
		return false;
	}
	
	/**
	 * Returns path to local file if it exists
	 *
	 * @param string $file File path (relative to $dir or absolute).
	 * @param string $dir Directory in which file is located. If null, application root
	 * will be used.
	 * @return string|false Resolved file path or false if file is not found.
	 */
	public static function findLocalFile($file, $dir=null) {
		$root = Yii::getPathOfAlias('approot');
		if (is_null($dir))
			$dir = $root;
		
		if (preg_match('/^(?:\/|\\\\|\w\:\\\\).*$/', $file)) { //is absolute path given?
			$mainFile = $file;
		} else {
			//find main file from application root
			$mainFile = $dir.DIRECTORY_SEPARATOR.$file;
		}
		
		//find file path relative to approot
		if (strpos($mainFile, $root)===0)
			$relFile = substr($mainFile, strlen($root));
		else {
			//file is not in approot, so no local equivalent exists
			return false;
		}
		
		//find local file
		$localFile = Yii::getPathOfAlias('local').$relFile;
		if (is_file($localFile))
			return $localFile;
		
		return false;
	}
	
	/**
	 * Retrieve a modified URL query string.
	 *
	 * You can rebuild the URL and append a new query variable to the URL query by
	 * using this function. You can also retrieve the full URL with query data.
	 *
	 * Adding a single key & value or an associative array. Setting a key value to
	 * an empty string removes the key. Omitting oldquery_or_uri uses the $_SERVER
	 * value. Additional values provided are expected to be encoded appropriately
	 * with urlencode() or rawurlencode().
	 *
	 * @param mixed $param1 Either newkey or an associative_array
	 * @param mixed $param2 Either newvalue or oldquery or uri
	 * @param mixed $param3 Optional. Old query or uri
	 * @return string New URL query string.
	 */
	public static function addQueryArg() {
		$ret = '';
		if ( is_array( func_get_arg(0) ) ) {
			if ( @func_num_args() < 2 || false === @func_get_arg( 1 ) )
				$uri = $_SERVER['REQUEST_URI'];
			else
				$uri = @func_get_arg( 1 );
		} else {
			if ( @func_num_args() < 3 || false === @func_get_arg( 2 ) )
				$uri = $_SERVER['REQUEST_URI'];
			else
				$uri = @func_get_arg( 2 );
		}
	
		if ( $frag = strstr( $uri, '#' ) )
			$uri = substr( $uri, 0, -strlen( $frag ) );
		else
			$frag = '';
	
		if ( preg_match( '|^https?://|i', $uri, $matches ) ) {
			$protocol = $matches[0];
			$uri = substr( $uri, strlen( $protocol ) );
		} else {
			$protocol = '';
		}
	
		if ( strpos( $uri, '?' ) !== false ) {
			$parts = explode( '?', $uri, 2 );
			if ( 1 == count( $parts ) ) {
				$base = '?';
				$query = $parts[0];
			} else {
				$base = $parts[0] . '?';
				$query = $parts[1];
			}
		} elseif ( !empty( $protocol ) || strpos( $uri, '=' ) === false ) {
			$base = $uri . '?';
			$query = '';
		} else {
			$base = '';
			$query = $uri;
		}
	
		parse_str( $query, $qs );
		//$qs = urlencode_deep( $qs ); // this re-URL-encodes things that were already in the query string
		if ( is_array( func_get_arg( 0 ) ) ) {
			$kayvees = func_get_arg( 0 );
			$qs = array_merge( $qs, $kayvees );
		} else {
			$qs[func_get_arg( 0 )] = func_get_arg( 1 );
		}
	
		foreach ( (array) $qs as $k => $v ) {
			if ( $v === false )
				unset( $qs[$k] );
		}
	
		$ret = http_build_query( $qs );
		$ret = trim( $ret, '?' );
		$ret = preg_replace( '#=(&|$)#', '$1', $ret );
		$ret = $protocol . $base . $ret . $frag;
		$ret = rtrim( $ret, '?' );
		return $ret;
	}
	
	/**
	 * Returns time difference in special format
	 * 
	 * @param int|string $from First time value (timestamp or parseable string).
	 * @param int|string $to Second time value (timestamp or parseable string).
	 * Defaults to current time.
	 * @param bool $week If true, differences larger than week will result in empty string.
	 * @return string Formatted time difference.
	 */
	public static function timeAgo($from, $to='') {
		if ( empty($to) ) $to = time();
		
		$from = is_string($from)? strtotime($from) : intval($from);
		$to = is_string($to)? strtotime($to) : intval($to);
		
		$since = '';
		$diff = (int) abs($to - $from); //in seconds
		if ($diff <= 3600) $since = round($diff / 60).'m ago'; /* 1 minute .. 60 minutes */
		elseif ( $diff>3600 && $diff<=86400 ) $since = round($diff / 3600).'h ago'; /* 1 hour ..  24 hours */
		elseif ( $diff>86400 && $diff<=604800 ) $since = round($diff / 86400).'d ago'; /* 1 day .. 7 days */
		elseif ( $diff>604800 && $diff<=3024000 ) $since = round($diff / 604800).'w ago'; /* 1 week .. 5 weeks */
		
		return $since;
	}
	
	/**
	 * Shortens integer value to thousands number
	 * 
	 * @param int $int
	 * @return string
	 */
	public static function shortenInt($int){
		if ( $int >= 1000) $int = floor($int/1000).'k';
		return $int;
	}
	
	/**
	 * Replaces double line-breaks with paragraph elements.
	 * 
	 * A group of regex replaces used to identify text formatted with newlines and
	 * replace double line-breaks with HTML paragraph tags. The remaining
	 * line-breaks after conversion become <<br />> tags, unless $br is set to '0'
	 * or 'false'.
	 * 
	 * @param string $pee The text which has to be formatted.
	 * @param bool $br Optional. If set, this will convert all remaining line-breaks after paragraphing. Default true.
	 * @return string Text which has been converted into correct paragraph tags.
	 */
	public static function autop($pee, $br = true) {
		/**
		 * Newline preservation help function for wpautop
		 * 
		 * @access private
		 * @param array $matches preg_replace_callback matches array
		 * @return string
		 */
		function _autop_newline_preservation_helper( $matches ) {
			return str_replace("\n", "<WPPreserveNewline />", $matches[0]);
		}
		
		$pre_tags = array();
		
		if ( trim($pee) === '' )
			return '';
		
		$pee = $pee . "\n"; // just to make things a little easier, pad the end
		
		if ( strpos($pee, '<pre') !== false ) {
			$pee_parts = explode( '</pre>', $pee );
			$last_pee = array_pop($pee_parts);
			$pee = '';
			$i = 0;
			
			foreach ( $pee_parts as $pee_part ) {
				$start = strpos($pee_part, '<pre');
				
				// Malformed html?
				if ( $start === false ) {
					$pee .= $pee_part;
					continue;
				}
				
				$name = "<pre wp-pre-tag-$i></pre>";
				$pre_tags[$name] = substr( $pee_part, $start ) . '</pre>';
				
				$pee .= substr( $pee_part, 0, $start ) . $name;
				$i++;
			}
			
			$pee .= $last_pee;
		}
		
		$pee = preg_replace('|<br />\s*<br />|', "\n\n", $pee);
		// Space things out a little
		$allblocks = '(?:table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|option|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|noscript|samp|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)';
		$pee = preg_replace('!(<' . $allblocks . '[^>]*>)!', "\n$1", $pee);
		$pee = preg_replace('!(</' . $allblocks . '>)!', "$1\n\n", $pee);
		$pee = str_replace(array("\r\n", "\r"), "\n", $pee); // cross-platform newlines
		if ( strpos($pee, '<object') !== false ) {
			$pee = preg_replace('|\s*<param([^>]*)>\s*|', "<param$1>", $pee); // no pee inside object/embed
			$pee = preg_replace('|\s*</embed>\s*|', '</embed>', $pee);
		}
		$pee = preg_replace("/\n\n+/", "\n\n", $pee); // take care of duplicates
		// make paragraphs, including one at the end
		$pees = preg_split('/\n\s*\n/', $pee, -1, PREG_SPLIT_NO_EMPTY);
		$pee = '';
		foreach ( $pees as $tinkle )
			$pee .= '<p>' . trim($tinkle, "\n") . "</p>\n";
		$pee = preg_replace('|<p>\s*</p>|', '', $pee); // under certain strange conditions it could create a P of entirely whitespace
		$pee = preg_replace('!<p>([^<]+)</(div|address|form)>!', "<p>$1</p></$2>", $pee);
		$pee = preg_replace('!<p>\s*(</?' . $allblocks . '[^>]*>)\s*</p>!', "$1", $pee); // don't pee all over a tag
		$pee = preg_replace("|<p>(<li.+?)</p>|", "$1", $pee); // problem with nested lists
		$pee = preg_replace('|<p><blockquote([^>]*)>|i', "<blockquote$1><p>", $pee);
		$pee = str_replace('</blockquote></p>', '</p></blockquote>', $pee);
		$pee = preg_replace('!<p>\s*(</?' . $allblocks . '[^>]*>)!', "$1", $pee);
		$pee = preg_replace('!(</?' . $allblocks . '[^>]*>)\s*</p>!', "$1", $pee);
		if ( $br ) {
			$pee = preg_replace_callback('/<(script|style).*?<\/\\1>/s', '_autop_newline_preservation_helper', $pee);
			$pee = preg_replace('|(?<!<br />)\s*\n|', "<br />\n", $pee); // optionally make line breaks
			$pee = str_replace('<WPPreserveNewline />', "\n", $pee);
		}
		$pee = preg_replace('!(</?' . $allblocks . '[^>]*>)\s*<br />!', "$1", $pee);
		$pee = preg_replace('!<br />(\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)!', '$1', $pee);
		$pee = preg_replace( "|\n</p>$|", '</p>', $pee );
		
		if ( !empty($pre_tags) )
			$pee = str_replace(array_keys($pre_tags), array_values($pre_tags), $pee);
		
		return $pee;
	}
	
}
