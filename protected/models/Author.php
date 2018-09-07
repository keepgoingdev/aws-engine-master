<?php

class Author extends AwsApiSubModel {
	public static $avSizes = array(50, 150);
	const AV_SIZE_DEFAULT = 150;
	
	public $_id;
	public $display_name;
	public $avatar;
	public $gplus_uid;
	public $description;
	
	public function getId() {
		return $this->_id;
	}
	
	public function getAvatar($size=self::AV_SIZE_DEFAULT) {
		$size = intval($size);
		if (!$this->avatar)
			return false;
		
		$uploadAwsPattern = '/^(https?:\/\/upload\.allwomenstalk\.com\/avatar\/)(\d+)(\/.*)/i';
		if ( preg_match($uploadAwsPattern, $this->avatar) ) {
			//find best of allowed sizes (the one with minimal difference)
			foreach (self::$avSizes as $s)
				$diff[$s] = abs($size-$s);
			$size = array_keys($diff, min($diff));
			
			$url = preg_replace($uploadAwsPattern, '${1}'.$size[0].'$3', $this->avatar);
		} else {
			$url = Utils::addQueryArg('s', $size, $this->avatar);
		}
		
		return $url;
	}
	
	public function getPostsLink() {
		return Yii::app()->createUrl('author/archive', array(
			'site'=>Yii::app()->urlManager->defaultSite,
			'name'=>$this->id
		));
	}
	
	public function getGPlusLink() {
		if (!isset($this->gplus_uid))
			return false;
		return 'https://plus.google.com/'.$this->gplus_uid.'?rel=author';
	}
	
}