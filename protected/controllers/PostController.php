<?php

class PostController extends Controller {
	
	public $layout='//layouts/column2';
	private $_model;
	
	public function actionView($name, $page=1) {
        $page = intval($page)-1;
        $this->loadModel(Yii::app()->urlManager->currentSite, $name);
		if(!isset($this->_model->post_content[$page])) {
			throw new CHttpException(404, 'The requested page does not exist.');
		}

        $this->_model->page = $page;
        $this->pageTitle = $this->_model->title.' | '.Yii::app()->name;
        $this->_model->getOpenGraphData($this->openGraph);
        
        $this->parselyMeta->title = $this->_model->title;
        $this->parselyMeta->link = $this->_model->permalink;
        $this->parselyMeta->image_url = $this->_model->postImage;
        $this->parselyMeta->type = 'post';
        $this->parselyMeta->post_id = $this->_model->id;
        $this->parselyMeta->pub_date = $this->_model->post_date;
        $this->parselyMeta->section = $this->_model->category;
        $this->parselyMeta->author = $this->_model->author->display_name;
        $this->parselyMeta->tags = $this->_model->tags;

        $this->awsL10n['postID'] = $this->_model->id;
        $this->awsL10n['postName'] = $name;
        $this->awsL10n['postImage'] = $this->_model->getPostImage();
        $this->awsL10n['postTitle'] = $this->_model->post_title;
        $this->awsL10n['isArchive'] = '';
        $this->awsL10n['isSingle'] = 1;
        $this->awsL10n['isHome'] = '';
        $this->awsL10n['pageNumber'] = $page;
        
        //adjusted to always point to actually current site, not that blog from where the post came
        $this->awsL10n['baseURL'] = 
        	Yii::app()->urlManager->createUrl('post/view', array(
        		'site'=>Yii::app()->urlManager->currentSite,
        		'name'=>$this->_model->slug,
        	));

		$related = $this->loadRelatedPosts($this->_model->id);
		$this->render('view', array('post'=>$this->_model, 'related'=>$related));
	}

    public function loadModel($blog, $name) {
		if ( $this->_model === null ) {
			$this->_model = SinglePost::model()->findByName($blog, $name);
			if ($this->_model===null)
				throw new CHttpException(404, 'The requested page does not exist.');
		}
		return $this->_model;
	}
	
	public function loadRelatedPosts($id) {
		$related = ArchivePost::model()->findRelated($id, 5);
		
		return $related? $related : array();
	}
	
	public function getPost() {
		return $this->_model;
	}
	
}
