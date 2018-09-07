<?php

class HomeController extends Controller {
	
	public $layout='//layouts/column1';
	
	/**
	 * List of posts
	 * @var ArchivePost[]
	 */
	private $_posts = array();
	
	/**
	 * Most liked posts
	 * @var ArchivePost[]
	 */
	private $_mlPosts = array();
	
	/**
	 * Returns the directory containing view files for this controller ('protected/views/archives').
	 * 
	 * @return string
	 */
	public function getViewPath() {
		if(($module=$this->getModule())===null)
			$module=Yii::app();
		return $module->getViewPath().DIRECTORY_SEPARATOR.'archives';
	}
	
	/**
	 * Lists posts archive for the blog's home page
	 * 
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 */
	public function actionArchive($orderBy='date') {
		//don't handle WP Pending and Draft post previews
		if (isset($_GET['preview']) && $_GET['preview']==='true')
			throw new CHttpException(404, 'The requested page does not exist.');
		
		$isDefaultSite = Yii::app()->urlManager->isDefaultSite();
		$category = $isDefaultSite? false : Yii::app()->urlManager->currentSite;
		$this->loadModel($category, $orderBy);
		$this->loadMostLiked($category);
		
		$title = $isDefaultSite? Yii::app()->name : ucwords(Yii::app()->urlManager->currentSite);
		$url = Yii::app()->urlManager->createSiteUrl();
		
		$this->pageTitle = $title;
		$this->openGraph->setProperties(array(
			'type'=>'blog',
			'url'=>$url,
			'title'=>$title,
			'description'=>Yii::app()->params['siteDescription'],
		));
		
		$this->parselyMeta->title = $title;
		$this->parselyMeta->type = $isDefaultSite? 'frontpage' : 'sectionpage';
		$this->parselyMeta->link = $url;
		
		$this->awsL10n['isArchive'] = true;
		$this->awsL10n['isSingle'] = false;
		$this->awsL10n['isHome'] = true;
		
		$this->render('home', array('posts'=>$this->_posts, 'mlPosts'=>$this->_mlPosts));
	}
	
	/**
	 * Load posts models.
	 * 
	 * @throws CHttpException if there are no posts found or there was another load error.
	 * @param string $category Super-category to load posts from. Defaults to all super-categories.
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @return ArchivePost[] List of posts.
	 */
	public function loadModel($category=false, $orderBy='date') {
		if ($category) {
			$this->_posts = ArchivePost::model()->findByCategory($category, $orderBy, 10);
		} else {
			$this->_posts = ArchivePost::model()->findAll($orderBy, 10);
		}
		if (empty($this->_posts))
			throw new CHttpException(404, 'The requested page does not exist.');
		
		return $this->_posts;
	}
	
	/**
	 * Load most liked posts models.
	 * 
	 * @param string $category Super-category to load posts from. Defaults to all super-categories.
	 * @return ArchivePost[] List of posts.
	 */
	public function loadMostLiked($category=false) {
		if ($category) {
			$this->_mlPosts = ArchivePost::model()->findByCategory($category, 'most_liked', 5);
		} else {
			$this->_mlPosts = ArchivePost::model()->findAll('most_liked', 5);
		}
		
		return $this->_mlPosts;
	}
}
