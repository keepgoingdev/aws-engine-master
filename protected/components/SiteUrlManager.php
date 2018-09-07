<?php

/**
 * Site URL Manager - extended URL manager which allows creating and parsing URLs
 * for a set of sites using one URL pattern for all of them.
 * 
 * URL pattern is splitted into two parts - site part and path info.
 * 
 * Site part is used to determine current site. It includes base URL and optionally host info.
 * Site ID is parsed and URLs are created using named parameter 'site' in the site part.
 * ID of the current site is saved in application's parameter 'site'.
 * 
 * Path info part is used as usual - to run controller actions and determine its parameters.
 * 
 * Optional parameters in patterns may be specified as following:
 * <pre>
 * <?name>
 * <?name:pattern>
 * <?name:default:pattern>
 * </pre>
 * If an optional parameter value will not be parsed, its default value will be used (if it is specified).
 * If an optional parameter will not be given or its default value will be given
 * when creating an URL, it will not be inserted in the resulting URL.
 * 
 * Optional parameter's pattern may have the following format:
 * <pre>
 * prefix{parameterPattern}suffix
 * </pre>
 * When parsing an URL prefix and suffix are ignored, so parameter will have value parsed by parameterPattern.
 * When creating an URL prefix and suffix will be inserted in the resulting URL only if parameter value
 * is specified and it is not equal default value.
 * 
 * Optional parameters allows use of patterns like
 * <pre>
 * http://<?site:{\w+}.>domain.com
 * </pre>,
 * which is matched by both http://sub.domain.com and http://domain.com
 * 
 * Currently optional parameters can't be used in route pattern references.
 * 
 * @see CUrlManager
 * 
 * @property string $currentSite ID of the current site.
 */
class SiteUrlManager extends CUrlManager {
	
	/**
	 * @var string Default site ID, which is used if site can't be determined.
	 */
	public $defaultSite;
	
	/**
	 * @var string Site ID to which current site ID will be forced if this is set.
	 * Used for debugging purposes.
	 */
	public $forceSite;
	
	/**
	 * @var string Base pattern for determining and creating links for particular sites.
	 * Site ID is contained in parameter named 'site'. Should not contain path info part.
	 */
	public $siteUrlPattern;
	
	protected $_currentSite;
	
	/**
	 * @var string The class name or path alias for the URL rule instances. Defaults to 'SiteUrlRule'.
	 */
	public $urlRuleClass='SiteUrlRule';

	/**
	 * Initializes the application component.
	 * Determines current site ID.
	 */
	public function init() {
		parent::init();
		//Yii::app()->request->setHostInfo('http://love.allwomenstalk.com');
		/*echo 'BaseUrl'; var_dump(Yii::app()->request->getBaseUrl());
		echo 'HostInfo'; var_dump(Yii::app()->request->getHostInfo());
		echo 'PathInfo'; var_dump(Yii::app()->request->getPathInfo());
		echo 'QueryString'; var_dump(Yii::app()->request->getQueryString());
		echo 'RequestUri'; var_dump(Yii::app()->request->getRequestUri());
		echo 'ScriptFile'; var_dump(Yii::app()->request->getScriptFile());
		echo 'ScriptUrl'; var_dump(Yii::app()->request->getScriptUrl());
		echo 'ServerName'; var_dump(Yii::app()->request->getServerName());*/
		
		Yii::app()->params['site'] = $this->_currentSite = $this->detectSite();
	}
	
	/**
	 * Returns current site ID.
	 *
	 * @return string|null
	 */
	public function getCurrentSite() {
		return $this->_currentSite;
	}
	
	/**
	 * Check if current site is default
	 * 
	 * @return boolean
	 */
	public function isDefaultSite() {
		return $this->currentSite===$this->defaultSite;
	}
	
	/**
	 * Checks if URL has host info part.
	 * 
	 * @param string $url
	 * @return boolean
	 */
	public function hasHostInfo($url) {
		return !strncasecmp($url,'http://',7) || !strncasecmp($url,'https://',8); //same criterias as in CUrlRule
	}
	
	/**
	 * Creates URL rule for site URL part.
	 * 
	 * @return SiteUrlRule
	 */
	public function createSiteUrlRule() {
		$siteRule = $this->createUrlRule('', $this->siteUrlPattern);
		$siteRule->urlSuffix = '';
		$siteRule->ignoreAdditional = true;
		
		/*if ( YII_DEBUG && !(isset($siteRule->params['site']) || isset($siteRule->optParams['site'])) ) {
			throw new CException(Yii::t('aws', 'The site URL pattern "{pattern}" does not contain a \'site\' parameter.',
				array('{pattern}'=>$this->siteUrlPattern)));
		}*/
		
		//override default value for the site parameter
		if ( isset($this->defaultSite) ) {
			if ( isset($siteRule->optParams) && isset($siteRule->optParams['site']) )
				$siteRule->optParams['site']['default'] = $this->defaultSite;
		}
		
		return $siteRule;
	}
	
	/**
	 * Constructs path info part of URL.
	 * 
	 * @param string $route The controller and the action.
	 * @param array $params List of GET parameters.
	 * @param string $ampersand The token separating name-value pairs in the URL.
	 * @return string The constructed URL.
	 */
	public function createPathInfoUrl($route, $params, $ampersand='&') {
		$url = parent::createUrl($route, $params, $ampersand);
		
		//strip base url
		$baseUrl = $this->baseUrl;
		if ( $baseUrl && !$this->hasHostInfo($url) && strpos($url, $baseUrl)===0 ) {
			$url = substr($url, strlen($baseUrl));
		}
		return $url;
	}
	
	/**
	 * Constructs site part of URL.
	 * 
	 * @param string $site
	 * @param boolean $showScriptName Show or hide script name. Lets the manager decide by default.
	 * @return string|false The constructed URL.
	 */
	public function createSiteUrl($site=null, $showScriptName=null) {
		if ( is_null($site) )
			$site = $this->currentSite;
		
		$p = array('site'=>$site);
		$siteRule = $this->createSiteUrlRule();
		$siteUrl = $siteRule->createUrl($this, '', $p, '&');
		
		if ($siteUrl===false)
			return false;
		
		//site pattern usually does not contain script name,
		//so add it if necessary
		if ( (is_null($showScriptName) && $this->showScriptName) || $showScriptName ) {
			$scriptName = basename($this->baseUrl);
			if ( substr($siteUrl, -strlen($scriptName)) !== $scriptName ) {
				$siteUrl = rtrim($siteUrl, '/').'/'.$scriptName;
			}
		}
		
		return $siteUrl;
	}
	
	/**
	 * Constructs a URL.
	 * 
	 * @param string $route The controller and the action (e.g. article/read).
	 * @param array $params List of GET parameters (name=>value). Both the name and value will be URL-encoded.
	 * If the name is '#', the corresponding value will be treated as an anchor.
	 * and will be appended at the end of the URL.
	 * @param string $ampersand The token separating name-value pairs in the URL. Defaults to '&'.
	 * @return string The constructed URL.
	 */
	public function createUrl($route, $params=array(), $ampersand='&') {
		$site = isset($params['site'])? $params['site'] : $this->currentSite;
		unset($params['site']);
		
		$url = $this->createPathInfoUrl($route, $params, $ampersand);
		
		if ( $this->hasHostInfo($url) ) { //if constructed url already has host info, return it as is
			return $url;
		} else {
			$siteUrl = $this->createSiteUrl($site);
			if ($siteUrl!==false)
				$url = $siteUrl.$url;
		}
		return $url;
	}
	
	/**
	 * Parse URL using given rule and return parsed parameters in an array.
	 * 
	 * @param CHttpRequest $request The request to be parsed.
	 * @param SiteUrlRule $rule The URL rule for parsing.
	 * @return array|false Parsed request parameters or false if the rule does not match.
	 */
	public function parseUrlVars($request, $rule) {
		$rawPathInfo=$request->getPathInfo();
		$pathInfo=$this->removeUrlSuffix($rawPathInfo, $this->urlSuffix);
		return $rule->parseUrlVars($this, $request, $pathInfo, $rawPathInfo);
	}
	
	/**
	 * Parse a path info into URL segments and in return them in an array.
	 * 
	 * @param string $pathInfo Path info.
	 * @return array Parsed parameters.
	 */
	public function parsePathInfoVars($pathInfo) {
		if($pathInfo==='')
			return;
		$vars = array();
	
		$segs=explode('/',$pathInfo.'/');
		$n=count($segs);
		for($i=0;$i<$n-1;$i+=2)
		{
			$key=$segs[$i];
			if($key==='') continue;
			$value=$segs[$i+1];
			if(($pos=strpos($key,'['))!==false && ($m=preg_match_all('/\[(.*?)\]/',$key,$matches))>0)
			{
				$name=substr($key,0,$pos);
				for($j=$m-1;$j>=0;--$j)
				{
					if($matches[1][$j]==='')
						$value=array($value);
					else
						$value=array($matches[1][$j]=>$value);
				}
				if(isset($vars[$name]) && is_array($vars[$name]))
					$value=CMap::mergeArray($vars[$name],$value);
				$vars[$name] = $value;
			}
			else
				$vars[$key] = $value;
		}
	
		return $vars;
	}
	
	/**
	 * Detect current site ID.
	 * 
	 * Saves detected site in the main application's parameters.
	 * @return string|null Current site ID.
	 */
	protected function detectSite() {
		if ( isset($this->forceSite) )
			return $this->forceSite;
		if ( isset(Yii::app()->params['site']) )
			return Yii::app()->params['site'];
		
		$rule = $this->createSiteUrlRule();
		$vars = $this->parseUrlVars(Yii::app()->request, $rule);
		
		$site = null;
		if ( $vars!==false && isset($vars['site']) )
			$site = $vars['site'];
		elseif ( isset($this->defaultSite) )
			$site = $this->defaultSite;
		
		return $site;
	}
	
}

/**
 * URL rule used for site-based URL creation and parsing for a set of sites.
 *
 * @see CUrlRule
 */
class SiteUrlRule extends CUrlRule {
	
	/**
	 * @var boolean Whether parameters which are absent in the template should be ignored
	 * or appended as path info or GET paramenters on URL creation.
	 */
	public $ignoreAdditional = false;
	
	/**
	 * @var boolean Whether this rule represents the site part of URL.
	 */
	public $isSiteRule = false;
	
	/**
	 * @var array List of optional parameters (name => [pattern, default, prefix, suffix]).
	 */
	public $optParams = array();
	
	/**
	 * Constructor.
	 * 
	 * @param string $route The route of the URL (controller/action).
	 * @param string $pattern The pattern for matching the URL.
	 */
	public function __construct($route, $pattern) {
		if(is_array($route))
		{
			foreach(array('urlSuffix', 'caseSensitive', 'defaultParams', 'matchValue', 'verb', 'parsingOnly') as $name)
			{
				if(isset($route[$name]))
					$this->$name=$route[$name];
			}
			if(isset($route['pattern']))
				$pattern=$route['pattern'];
			$route=$route[0];
		}
		$this->route=trim($route,'/');
		
		//quote regexp characters in pattern except angles
		$quote = array('.', '\\', '+', '*', '?', '[', '^', ']', '$', '(', ')', '{', '}', '=', '!', '|', ':', '-', '/');
		foreach ($quote as $sign) {
			$quotes[$sign] = '\\'.$sign;
		}
		
		$tr = array();
		$tr2['/'] = '\\/';
		
		if(strpos($route,'<')!==false && preg_match_all('/<(\w+)>/',$route,$matches2)) {
			foreach($matches2[1] as $name)
				$this->references[$name]="<$name>";
		}
		
		$this->hasHostInfo=!strncasecmp($pattern,'http://',7) || !strncasecmp($pattern,'https://',8);
		
		if($this->verb!==null)
			$this->verb=preg_split('/[\s,]+/',strtoupper($this->verb),-1,PREG_SPLIT_NO_EMPTY);
		
		$optParamsPattern = '/<\?(\w+):?(?:([^:>]+):)?(.*?)?>/';
		if ( preg_match_all($optParamsPattern, $pattern, $matches, PREG_SET_ORDER) ) {
			foreach ($matches as $match) {
				$name = $match[1];
				$default = $match[2];
				$value = $match[3];
				
				$param = array();
				if ($default!=='')
					$param['default'] = $default;
				
				if ( preg_match('/(.*?)\{(.+)\}(.*)/', $value, $matches2) ) {
					$param['prefix'] = $matches2[1];
					$param['pattern'] = $matches2[2];
					$param['suffix'] = $matches2[3];
				} else {
					$param['prefix'] = '';
					$param['pattern'] = $value;
					$param['suffix'] = '';
				}
				
				if( $param['pattern']==='' )
					$param['pattern'] = '[^\/]+';
				
				$prefix = preg_quote($param['prefix'], '/');
				$suffix = preg_quote($param['suffix'], '/');
				$tr["<$name>"]="(?:$prefix(?P<$name>{$param['pattern']})$suffix)?";
				$this->optParams[$name] = $param;
			}
		}
		
		if(preg_match_all('/<(\w+):?(.*?)?>/',$pattern,$matches)) {
			$tokens=array_combine($matches[1],$matches[2]);
			foreach($tokens as $name=>$value)
			{
				if($value==='')
					$value='[^\/]+';
				$tr["<$name>"]="(?P<$name>$value)";
				if(isset($this->references[$name]))
					$tr2["<$name>"]=$tr["<$name>"];
				else
					$this->params[$name]=$value;
			}
		}
		
		$this->isSiteRule = ($route==='') && (isset($this->params['site']) || isset($this->optParams['site']));
		
		$p=rtrim($pattern,'*');
		$this->append=$p!==$pattern;
		$p=trim($p,'/');
		$p = preg_replace('/<\?(\w+).*?>/', '<$1>', $p); //optional parameters
		$this->template=preg_replace('/<(\w+):?.*?>/','<$1>',$p); //ordinary parameters
		$this->pattern='/^'.strtr( strtr($this->template, $quotes), $tr ).'\/';
		if($this->append)
			$this->pattern.='/u';
		else
			$this->pattern.='$/u';
	
		if($this->references!==array())
			$this->routePattern='/^'.strtr($this->route,$tr2).'$/u';
	
		if(YII_DEBUG && @preg_match($this->pattern,'test')===false)
			throw new CException(Yii::t('yii','The URL pattern "{pattern}" for route "{route}" is not a valid regular expression.',
				array('{route}'=>$route,'{pattern}'=>$pattern)));
	}
	
	/**
	 * Creates a URL based on this rule.
	 * 
	 * Unlike {@link CUrlRule::createUrl()} always keeps host info and adds possibility
	 * to ignore additional URL parameters.
	 * 
	 * @param SiteUrlManager $manager The manager.
	 * @param string $route The route.
	 * @param array $params List of parameters.
	 * @param string $ampersand The token separating name-value pairs in the URL.
	 * @return mixed The constructed URL or false on error.
	 */
	public function createUrl($manager, $route, $params, $ampersand) {
		if($this->parsingOnly)
			return false;
		
		if($manager->caseSensitive && $this->caseSensitive===null || $this->caseSensitive)
			$case='';
		else
			$case='i';
		
		$tr=array();
		//get parameters from route references
		if($route!==$this->route)
		{
			if($this->routePattern!==null && preg_match($this->routePattern.$case,$route,$matches))
			{
				foreach($this->references as $key=>$name)
					$tr[$name]=$matches[$key];
			}
			else
				return false;
		}
		
		//remove parameters that have default values
		foreach($this->defaultParams as $key=>$value) {
			if(isset($params[$key])) {
				if($params[$key]==$value)
					unset($params[$key]);
				else
					return false;
			}
		}
		
		//check for presence of all parameters
		foreach($this->params as $key=>$value)
			if(!isset($params[$key]))
				return false;
		
		//check parameters values
		if($manager->matchValue && $this->matchValue===null || $this->matchValue) {
			foreach($this->params as $key=>$value) {
				if(!preg_match('/\A'.$value.'\z/u'.$case,$params[$key]))
					return false;
			}
			foreach($this->optParams as $key=>$param) {
				if( isset($params[$key]) && !preg_match('/\A'.$param['pattern'].'\z/u'.$case, $params[$key]) )
					return false;
			}
		}
		
		foreach($this->params as $key=>$value) {
			$tr["<$key>"] = urlencode($params[$key]);
			unset($params[$key]);
		}
		
		foreach ($this->optParams as $key=>$param) {
			if ( isset($params[$key]) )
				$value = $params[$key];
			elseif ( isset($param['default']) )
				$value = $param['default'];
			else
				$value = '';
			
			if ( isset($param['default']) && $value===$param['default'] )
				$value = '';
			
			$value = urlencode($value);
			if ($value!=='') {
				if ( isset($param['prefix']) )
					$value = $param['prefix'].$value;
				if ( isset($param['suffix']) )
					$value .= $param['suffix'];
			}
			
			$tr["<$key>"] = $value;
			unset($params[$key]);
		}
		
		$suffix=$this->urlSuffix===null ? $manager->urlSuffix : $this->urlSuffix;
		
		$url=strtr($this->template,$tr);
		
		//don't remove host info from generated URL, so siteUrlManager will be able to recognise it
		//and will not overwrite it
		
		if( empty($params) || $this->ignoreAdditional )
			return $url!=='' ? $url.$suffix : $url;
		
		if($this->append)
			$url.='/'.$manager->createPathInfo($params,'/','/').$suffix;
		else
		{
			if($url!=='')
				$url.=$suffix;
			$url.='?'.$manager->createPathInfo($params,'=',$ampersand);
		}
		
		return $url;
	}
	
	/**
	 * Parses a URL based on this rule.
	 * 
	 * @param SiteUrlManager $manager The URL manager.
	 * @param CHttpRequest $request The request object.
	 * @param string $pathInfo Path info part of the URL.
	 * @param string $rawPathInfo Path info that contains the potential URL suffix.
	 * @return mixed The route that consists of the controller ID and action ID or false on error.
	 */
	public function parseUrl($manager, $request, $pathInfo, $rawPathInfo) {
		if($this->verb!==null && !in_array($request->getRequestType(), $this->verb, true))
			return false;
		
		if($manager->caseSensitive && $this->caseSensitive===null || $this->caseSensitive)
			$case='';
		else
			$case='i';
		
		$pathInfo = $this->preparePathInfo($manager, $request, $pathInfo, $rawPathInfo);
		if ($pathInfo===false)
			return false;
		
		if( preg_match($this->pattern.$case,$pathInfo,$matches) ) {
			foreach($this->defaultParams as $name=>$value) {
				if(!isset($_GET[$name]))
					$_REQUEST[$name]=$_GET[$name]=$value;
			}
			foreach ($this->optParams as $name=>$param) {
				if ( isset($param['default']) )
					$_REQUEST[$name] = $_GET[$name] = $param['default'];
			}
			
			$tr=array();
			foreach($matches as $key=>$value)
			{
				if(isset($this->references[$key]))
					$tr[$this->references[$key]]=$value;
				else if(isset($this->params[$key]) || isset($this->optParams[$key]))
					$_REQUEST[$key]=$_GET[$key]=$value;
			}
			if($pathInfo!==$matches[0]) // there're additional GET params
				$manager->parsePathInfo(ltrim(substr($pathInfo,strlen($matches[0])),'/'));
			if($this->routePattern!==null)
				return strtr($this->route,$tr);
			else
				return $this->route;
		}
		else
			return false;
	}
	
	/**
	 * Parse a URL based on this rule and return parsed parameters in an array.
	 * 
	 * @param SiteUrlManager $manager The URL manager.
	 * @param CHttpRequest $request The request object.
	 * @param string $pathInfo Path info part of the URL.
	 * @param string $rawPathInfo Path info that contains the potential URL suffix.
	 * @return array|false Parsed parameters or false if this rule does not match.
	 */
	public function parseUrlVars($manager, $request, $pathInfo, $rawPathInfo) {
		if($this->verb!==null && !in_array($request->getRequestType(), $this->verb, true))
			return false;
		
		if($manager->caseSensitive && $this->caseSensitive===null || $this->caseSensitive)
			$case='';
		else
			$case='i';
		
		$pathInfo = $this->preparePathInfo($manager, $request, $pathInfo, $rawPathInfo);
		if ($pathInfo===false)
			return false;
		
		if( preg_match($this->pattern.$case, $pathInfo, $matches) ) {
			$vars = array();
			foreach($this->defaultParams as $name=>$value) {
				$vars[$name]=$value;
			}
			foreach ($this->optParams as $name=>$param) {
				if ( isset($param['default']) )
					$vars[$name] = $param['default'];
			}
			
			foreach($matches as $key=>$value) {
				if( isset($this->references[$key]) || isset($this->params[$key]) || isset($this->optParams[$key]) )
					$vars[$key] = $value;
			}
			if($pathInfo!==$matches[0]) { // there're additional GET params
				$pathVars = $manager->parsePathInfoVars(ltrim(substr($pathInfo,strlen($matches[0])),'/'));
				$vars = CMap::mergeArray($vars, $pathVars);
			}
			
			return $vars;
		} else
			return false;
	}
	
	/**
	 * Prepares path info for parsing.
	 * 
	 * @param SiteUrlManager $manager The URL manager.
	 * @param CHttpRequest $request The request object.
	 * @param string $pathInfo Path info part of the URL.
	 * @param string $rawPathInfo Path info that contains the potential URL suffix.
	 * @return string|false
	 */
	protected function preparePathInfo($manager, $request, $pathInfo, $rawPathInfo) {
		if($this->urlSuffix!==null)
			$pathInfo=$manager->removeUrlSuffix($rawPathInfo, $this->urlSuffix);
		
		// URL suffix required, but not found in the requested URL
		if($manager->useStrictParsing && $pathInfo===$rawPathInfo) {
			$urlSuffix = $this->urlSuffix===null ? $manager->urlSuffix : $this->urlSuffix;
			if($urlSuffix!='' && $urlSuffix!=='/')
				return false;
		}
		
		if ($this->isSiteRule) {
			$pathInfo = strtolower( $request->getBaseUrl($this->hasHostInfo) );
		} elseif($this->hasHostInfo) {
			$pathInfo=strtolower($request->getBaseUrl(true)).rtrim('/'.$pathInfo,'/');
		}
		
		$pathInfo.='/';
		
		return $pathInfo;
	}
}
