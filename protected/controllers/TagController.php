<?php

class TagController extends Controller {
	
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
	 * Lists tag archive on the main blog
	 * 
	 * @throws CHttpException if tag archive requested on not the main blog.
	 * @param string $name Tag slug.
	 */
	public function actionArchive($name) {
		if (!Yii::app()->urlManager->isDefaultSite())
			throw new CHttpException(404, 'The requested page does not exist.');
		
		$this->loadModel($name);
		
		$title = ucfirst(str_replace('-', ' ', $name));
		$url = Yii::app()->urlManager->createUrl('tag/archive', array('name'=>$name));
		
		$this->pageTitle = $title;
		$this->openGraph->setProperties(array(
			'type'=>'tag',
			'url'=>$url,
			'title'=>$title,
		));
		
		$this->parselyMeta->title = 'Tag - '.$title;
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
	 * @param string $tag Tag slug.
	 * @return ArchivePost[] List of posts.
	 */
	public function loadModel($tag) {
		$this->_posts = ArchivePost::model()->findByTag($tag, 'date', 10);
		if (empty($this->_posts))
			throw new CHttpException(404, 'The requested page does not exist.');
		
		return $this->_posts;
	}
}
