<?php

class CategoryController extends Controller {
	
	public $layout='//layouts/column1';
	
	/**
	 * List of posts
	 * @var ArchivePost[]
	 */
	private $_posts = array();
	
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
	 * Lists posts archive for the main blog's category
	 * 
	 * @throws CHttpException if category archive requested on not the main blog.
	 * @param string $name Super-category to load posts from.
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 */
	public function actionArchive($name, $orderBy='date') {
		if (!Yii::app()->urlManager->isDefaultSite())
			throw new CHttpException(404, 'The requested page does not exist.');
		
		$this->loadModel($name, $orderBy);
		
		$title = ucwords($name);
		$url = Yii::app()->urlManager->createUrl('category/archive', array('name'=>$name));
		
		$this->pageTitle = $title;
		$this->openGraph->setProperties(array(
			'type'=>'category',
			'url'=>$url,
			'title'=>$title,
		));
		
		$this->parselyMeta->title = $title;
		$this->parselyMeta->type = 'sectionpage';
		$this->parselyMeta->link = $url;
		
		$this->awsL10n['isArchive'] = true;
		$this->awsL10n['isSingle'] = false;
		$this->awsL10n['isHome'] = false;
		
		$this->render('archive', array('posts'=>$this->_posts));
	}
	
	/**
	 * Load posts models.
	 * 
	 * @throws CHttpException if there are no posts found or there was another load error.
	 * @param string $category Super-category to load posts from.
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @return ArchivePost[] List of posts.
	 */
	public function loadModel($category, $orderBy='date') {
		$this->_posts = ArchivePost::model()->findByCategory($category, $orderBy, 10);
		if (empty($this->_posts))
			throw new CHttpException(404, 'The requested page does not exist.');
		
		return $this->_posts;
	}
}
