<?php

/**
 * MostCommentedWidget displays list of most commented posts
 */
class MostCommentedWidget extends CWidget {

	/**
	 * Number of posts to display
	 * @var int
	 */
	public $count = 10;

	/**
	 * Widget title
	 * @var string
	 */
	public $title = 'Most Commented';

	/**
	 * List of posts
	 * @var ArchivePost[]
	 */
	protected $_posts = array();

	/**
	 * Render list of most commented posts
	 */
	public function run() {
		$isDefaultSite = Yii::app()->urlManager->isDefaultSite();
		$category = $isDefaultSite? false : Yii::app()->urlManager->currentSite;
		$this->loadPosts($category);
		if (!empty($this->_posts))
			$this->render('posts-list', array(
				'posts'=>$this->_posts,
				'title'=>$this->title
			));
	}

	/**
	 * Load most commented posts models
	 * 
	 * @param bool|string $category Super-category to load posts from. Defaults to all super-categories.
	 * @return ArchivePost[] List of posts.
	 */
	protected function loadPosts($category=false) {
		if ($category) {
			$this->_posts = ArchivePost::model()->findByCategory($category, 'most_commented', $this->count);
		} else {
			$this->_posts = ArchivePost::model()->findAll('most_commented', $this->count);
		}

		return $this->_posts;
	}
}
