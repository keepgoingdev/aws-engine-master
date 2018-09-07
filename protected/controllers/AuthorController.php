<?php

class AuthorController extends Controller {
	
	public $layout='//layouts/column1';
	
	/**
	 * List of posts
	 * @var ArchivePost[]
	 */
	private $_posts = array();
	
	/**
	 * Author model
	 * @var Author
	 */
	private  $_author;
	
	/**
	 * Returns the directory containing view files for this controller ('protected/views/archives')
	 * 
	 * @return string
	 */
	public function getViewPath() {
		if(($module=$this->getModule())===null)
			$module=Yii::app();
		return $module->getViewPath().DIRECTORY_SEPARATOR.'archives';
	}
	
	/**
	 * Lists author archive on the main blog
	 * 
	 * @throws CHttpException if author archive requested on not the main blog.
	 * @param string $name Author slug.
	 */
	public function actionArchive($name) {
		if (!Yii::app()->urlManager->isDefaultSite())
			throw new CHttpException(404, 'The requested page does not exist.');
		
		$this->loadModel($name);
		
		$title = $this->_author->display_name;
		$url = $this->_author->postsLink;
		$this->pageTitle = $title;
		$this->openGraph->setProperties(array(
			'type'=>'author',
			'url'=>$url,
			'title'=>$title,
			'description'=>preg_replace(
				"/^([\x20\r\n\t]|\xc2\xa0)+|([\x20\r\n\t]|\xc2\xa0)+$/", '', strip_tags($this->_author->description)
			),
		));
		
		$this->parselyMeta->title = 'Author - '.$title;
		$this->parselyMeta->type = 'sectionpage';
		$this->parselyMeta->link = $url;
		
		$this->awsL10n['isArchive'] = true;
		$this->awsL10n['isSingle'] = false;
		$this->awsL10n['isHome'] = false;
		
		$this->render('archive', array('posts'=>$this->_posts));
	}
	
	/**
	 * Load posts models
	 * 
	 * @throws CHttpException if there are no posts found or there was another load error.
	 * @param string $author Author slug.
	 * @return ArchivePost[] List of posts.
	 */
	public function loadModel($author) {
		list($this->_posts, $this->_author) = ArchivePost::model()->findByAuthor($author, 'date', 10);
		if (empty($this->_posts))
			throw new CHttpException(404, 'The requested page does not exist.');
		
		return $this->_posts;
	}
}
