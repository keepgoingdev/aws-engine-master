<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController {
	
	/**
	 * @var string the default layout for the controller view. Defaults to '//layouts/column1',
	 * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
	 */
	public $layout='//layouts/column1';

	/**
	 * @var PropertiesContainer contains data for Facebook OpenGraph
	 */
	public $openGraph;
	
	/**
	 * Parse.ly page attributes
	 * @var stdClass
	 */
	public $parselyMeta;

    /**
     * @var array the structure of the global javascript variable awsL10n
     */
    public $awsL10n
        = array(
            'debug'                => '',
            'postID'               => '',
            'postName'             => '',
            'postImage'            => '',
            'postTitle'            => '',
            'ajaxurl'              => '',
        	'blog'                 => '',
            'subblogs'             => '',
            'homeURL'              => '',
            'isHome'               => 1,
            'isArchive'            => 1,
            'isSingle'             => '',
            'pageNumber'           => '',
            'baseURL'              => '',
            'activityLog'          => 1,
            'archivesPostsPortion' => 40,
            'archivesPortionShow'  => 10,
            'archivesMinQueue'     => 40
        );
	
	/**
	 * This method is invoked at the beginning of {@link render()}.
	 * You may override this method to do some preprocessing when rendering a view.
	 * @param string $view the view to be rendered
	 * @return boolean whether the view should be rendered.
	 */
    protected function beforeRender($view)
    {
        $clientScript = Yii::app()->clientScript;

        $clientScript->registerPackage('styles');
        $clientScript->registerPackage('base');

        $clientScript->registerScript('awsL10n', 'var awsL10n = ' . json_encode($this->awsL10n) .';', CClientScript::POS_HEAD);
        return true;
    }

	public function init() {
		parent::init();
		$this->openGraph = new PropertiesContainer();
		
		$this->openGraph->setProperties(array(
			'app_id'=>Yii::app()->params->app_id,
			'site_name'=>Yii::app()->urlManager->isDefaultSite()? Yii::app()->name : ucwords(Yii::app()->urlManager->currentSite),
		));
		
		$this->parselyMeta = new stdClass();
		
		$this->awsL10n['contentApi'] = Yii::app()->params['contentApi'];
		$this->awsL10n['usersApi'] = Yii::app()->params['usersApi'];
		$this->awsL10n['votingApi'] = Yii::app()->params['votingApi'];
		$this->awsL10n['commentGate'] = Yii::app()->params['commentGate'];
		
		$this->awsL10n['blog'] = Yii::app()->urlManager->currentSite;
		$this->awsL10n['subblogs'] = Yii::app()->params['subblogs'];
		$this->awsL10n['homeURL'] = Yii::app()->urlManager->createSiteUrl();
		$this->awsL10n['siteURLPattern'] = Yii::app()->urlManager->siteUrlPattern;
	}
	
	/**
	 * Finds a view file based on its name.
	 * 
	 * Local view file will be used if it exists, common view file otherwise.
	 * 
	 * @see CController::resolveViewFile()
	 * @see Utils::findFile()
	 * 
	 * @param string $viewName the view name
	 * @param string $viewPath the directory that is used to search for a relative view name
	 * @param string $basePath the directory that is used to search for an absolute view name under the application
	 * @param string $moduleViewPath the directory that is used to search for an absolute view name under the current module.
	 * If this is not set, the application base view path will be used.
	 * @return mixed the view file path. False if the view file does not exist.
	 */
	public function resolveViewFile($viewName, $viewPath, $basePath, $moduleViewPath=null) {
		if(empty($viewName))
			return false;
		
		if($moduleViewPath===null)
			$moduleViewPath=$basePath;
		
		if(($renderer=Yii::app()->getViewRenderer())!==null)
			$extension=$renderer->fileExtension;
		else
			$extension='.php';
		if($viewName[0]==='/')
		{
			if(strncmp($viewName,'//',2)===0)
				$viewFile=$basePath.$viewName;
			else
				$viewFile=$moduleViewPath.$viewName;
		}
		else if(strpos($viewName,'.'))
			$viewFile=Yii::getPathOfAlias($viewName);
		else
			$viewFile=$viewPath.DIRECTORY_SEPARATOR.$viewName;
		
		//$viewFile should be absolute here
		if($file=Utils::findFile($viewFile.$extension))
			return Yii::app()->findLocalizedFile($file);
		else if($extension!=='.php' && $file=Utils::findFile($viewFile.'.php'))
			return Yii::app()->findLocalizedFile($file);
		else
			return false;
	}

}
