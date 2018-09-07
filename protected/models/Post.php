<?php

/**
 * General model that represents the posts.
 * 
 * @property string $id MongoDB ID of the post.
 * @property string $permalink URL of the post.
 * @property string $category Name of the first category.
 * @property string $categoryUrl URL of the first category.
 * @property string|false $postImage URL of the full-size post image.
 * @property Author $author Author model.
 */
class Post extends AwsApiModel {
	
	public $_id;
	public $host;
	public $blog;
	public $slug;
	public $post_title;
	public $post_date;
	public $image;
	public $comment_count;
	public $likes;
	public $categories = array();
	
	public function subModels() {
		return array(
			'author' => 'Author',
		);
	}
	
	/**
	 * Returns the static model of the specified API model class.
	 * 
	 * @return AwsApiModel The static model class.
	 */
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	/**
	 * Initializes this model.
	 */
	public function init() {
		$this->blog = Yii::app()->urlManager->defaultSite;
		if (preg_match('#^https?://([^.]+)\.allwomenstalk\.com#i', $this->host, $matches)) {
			$this->blog = $matches[1];
		}
		if ($this->blog==='www')
			$this->blog = Yii::app()->urlManager->defaultSite;
	}
	
	/**
	 * Returns MongoDB ID of the post.
	 * 
	 * @return string
	 */
	public function getId() {
		return $this->_id->{'$id'};
	}
	
	/**
	 * Returns link to the post.
	 * 
	 * @param int $page number of post`s page
	 * @return string
	 */
	public function getPermalink($page=0) {
		$params = array(
			'site'=>$this->blog,
			'name'=>$this->slug,
		);
		if (!empty($page))
			$params['page'] = intval($page)+1;
		return Yii::app()->urlManager->createUrl('post/view', $params);
	}
	
	/**
	 * Returns first category name.
	 * 
	 * @return string
	 */
	public function getCategory() {
		$cat = reset($this->categories);
		return $cat? ucfirst($cat->id) : '';
	}
	
	/**
	 * Returns first category archive URL.
	 * 
	 * @return string
	 */
	public function getCategoryUrl() {
		$cat = reset($this->categories);
		return $cat? Yii::app()->urlManager->createSiteUrl($cat->id) : '#';
	}
	
	/**
	 * Returns URL of the post image of the specified size.
	 * 
	 * Checks that image is actually exists if it is located on the current blog.
	 * Location of images and mapping from size identifiers to subdirectories should be specified
	 * in the application configuration.
	 * 
	 * @param string $size Image size identifier.
	 * @return string|boolean URL or false if image is not found.
	 */
	public function getPostImage($size='full') {
		if (!$this->image)
			return false;
		
		$imgSize = trim(Yii::app()->params['postImageSizes'][$size], '/');
		if ($imgSize!=='')
			$imgSize .= '/';
		
		//check for existance of images from current blog only
		/*if ( Yii::app()->urlManager->currentSite === $this->blog ) {
		$file = Yii::getPathOfAlias("webroot").'/'.$imgBase.$imgSize.$this->image;
		if ( !is_file($file) )
			return false;
		}*/
		
		$blog = ($this->blog===Yii::app()->urlManager->defaultSite)? 'www' : $this->blog;
		return 'http://img.allw.mn/'.$blog.'/thumbs/'.$imgSize.$this->image;
	}
}
