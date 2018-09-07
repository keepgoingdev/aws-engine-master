<?php

class DateController extends Controller {
	
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
	 * Lists date archive
	 * 
	 * @param int|string $year
	 * @param int|string $month
	 * @param int|string $day
	 */
	public function actionArchive($year, $month=0, $day=0) {
		$year = sprintf('%04d', $year); $month = sprintf('%02d', $month); $day = sprintf('%02d', $day);
		
		$date = $year;
		$title = $year;
		$urlParams = array('year'=>$year);
		
		if (intval($month)) {
			$date .= "-$month";
			$urlParams['month'] = $month;
		}
		
		if (intval($day)) {
			$date .= "-$day";
			$urlParams['day'] = $day;
			$title = intval($day).' '.$title;
		}
		
		if (intval($month)) {
			$title = date('M', mktime(0, 0, 0, $month)).' '.$title;
		}
		
		$this->loadModel($date);
		
		$url = Yii::app()->urlManager->createUrl('date/archive', $urlParams);
		
		$this->pageTitle = $title;
		$this->openGraph->setProperties(array(
			'type'=>'archive',
			'url'=>$url,
			'title'=>$title,
		));
		
		$this->parselyMeta->title = 'Date - '.$title;
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
	 * @param string $date Date specifier: 'yyyy[-mm[-dd]]'.
	 * @return ArchivePost[] List of posts.
	 */
	public function loadModel($date) {
		if (Yii::app()->urlManager->isDefaultSite())
			$this->_posts = ArchivePost::model()->findByDate($date, 10);
		else
			$this->_posts = ArchivePost::model()->findByCategoryDate(Yii::app()->urlManager->currentSite, $date, 10);
		
		if (empty($this->_posts))
			throw new CHttpException(404, 'The requested page does not exist.');
		
		return $this->_posts;
	}
}
