<?php

class PageController extends Controller {
	
	public $layout='//layouts/page';
	
	public function actionView($name) {
		$name = str_replace('.', '', $name);
		$name = trim($name, '/\\');
		
		if ($this->getViewFile($name)) //check if static pages view file exists...
			$this->render($name);
		else //... and forward to post if it is not
			$this->forward('post/view');
	}
}
