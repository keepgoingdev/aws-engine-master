<?php

/**
 * Post model to be used in various archives.
 */
class ArchivePost extends Post {
	
	/**
	 * Loads posts from all super-categories.
	 * 
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param integer $count Amount of posts to load.
	 * @return ArchivePost[]|null List of posts.
	 */
	public function findAll($orderBy='date', $count=10) {
		$r = Yii::app()->api->getPosts($orderBy, array('count'=>$count));
		if (!$r)
			return null;
		
		return $this->populateDocuments($r->posts);
	}
	
	/**
	 * Loads posts from super-category.
	 * 
	 * @param string $category Super-category slug.
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param integer $count Amount of posts to load.
	 * @return ArchivePost[]|null List of posts.
	 */
	public function findByCategory($category, $orderBy='date', $count=10) {
		$r = Yii::app()->api->getPostsByCategory($category, $orderBy, array('count'=>$count));
		if (!$r)
			return null;
		
		return $this->populateDocuments($r->posts);
	}
	
	/**
	 * Loads posts by tag
	 * 
	 * @param string $tag Tag slug.
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param integer $count Amount of posts to load.
	 * @return ArchivePost[]|null List of posts.
	 */
	public function findByTag($tag, $orderBy='date', $count=10) {
		$r = Yii::app()->api->getPostsByTag($tag, $orderBy, array('count'=>$count));
		if (!$r)
			return null;
		
		return $this->populateDocuments($r->posts);
	}
	
	/**
	 * Loads posts by author
	 * 
	 * @param string $author Author slug.
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param integer $count Amount of posts to load.
	 * @return (ArchivePost[]|Author)[]|null Author model and list of posts.
	 */
	public function findByAuthor($author, $orderBy='date', $count=10) {
		$r = Yii::app()->api->getPostsByAuthor($author, $orderBy, array('count'=>$count));
		if (!$r)
			return null;
		$posts = $this->populateDocuments($r->posts);
		$author = new Author();
		$author->setAttributes($r->author, false);
		
		return array($posts, $author);
	}
	
	/**
	 * Loads posts by year, month or day
	 * 
	 * @param string $date Date specifier: 'yyyy[-mm[-dd]]'.
	 * @param integer $count Amount of posts to load.
	 * @return ArchivePost[]|null List of posts.
	 */
	public function findByDate($date, $count=10) {
		$r = Yii::app()->api->getPostsByDate($date, array('count'=>$count));
		if (!$r)
			return null;
		
		return $this->populateDocuments($r->posts);
	}
	
	/**
	 * Loads posts from super-category by year, month or day
	 * 
	 * @param string $category Super-category slug.
	 * @param string $date Date specifier: 'yyyy[-mm[-dd]]'.
	 * @param integer $count Amount of posts to load.
	 * @return ArchivePost[]|null List of posts.
	 */
	public function findByCategoryDate($category, $date, $count=10) {
		$r = Yii::app()->api->getPostsByCategoryDate($category, $date, array('count'=>$count));
		if (!$r)
			return null;
		
		return $this->populateDocuments($r->posts);
	}
	
	/**
	 * Loads posts related to given
	 * 
	 * @param string $id Mongo-ID of the post.
	 * @param integer $count Amount of posts to load.
	 * @return ArchivePost[]|null List of posts.
	 */
	public function findRelated($id, $count=10) {
		$r = Yii::app()->api->getRelatedPosts($id, array('count'=>$count));
		if (!$r)
			return null;
		
		return $this->populateDocuments($r->posts);
	}
	
	/**
	 * Returns the static model of the specified API model class.
	 * 
	 * @return AwsApiModel The static model class.
	 */
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}
}
