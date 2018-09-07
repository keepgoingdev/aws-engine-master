<?php

class AwsApi extends CApplicationComponent {
	
	public $contentApiUrl;
	protected $contentClient;
	
	public function init() {
		parent::init();
		$this->contentClient = new RESTClient( array('server'=>$this->contentApiUrl) );
	}
	
	/**
	 * Universal function to interact with Content API
	 * 
	 * @param string|array $path API function path. If array is passed, its elements will be joined with '/'.
	 * @param string|array $params Query string or array of query parameters.
	 * @return mixed Parsed response or FALSE on failure.
	 */
	public function callContentApi($path, $params=array()) {
		$url = '';
		if ( is_array($path) ) {
			//filter out empty path elements
			$path = array_filter($path, function($v){
				return (string)$v !== '';
			});
			$url = implode('/', $path);
		} else {
			$url = $path;
		}
		
		$r = $this->contentClient->get($url, $params);
		$status = $this->contentClient->status();
		if (empty($status) || $status>=400)
			return false;
		
		return $r;
	}
	
	/**
	 * Get posts feed
	 * 
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param string|array $params Query string or array of query parameters.
	 * @return object|false Response with posts list or FALSE on failure.
	 */
	public function getPosts($orderBy='date', $params=array()) {
		return $this->callContentApi( array('posts', $this->apiOrder($orderBy)), $params );
	}
	
	/**
	 * Get posts from super-category
	 * 
	 * @param string $category Super-category slug.
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param string|array $params Query string or array of query parameters.
	 * @return object|false Response with posts list or FALSE on failure.
	 */
	public function getPostsByCategory($category, $orderBy='date', $params=array()) {
		return $this->callContentApi( array('posts', 'category', $category, $this->apiOrder($orderBy)), $params );
	}
	
	/**
	 * Get posts by tag
	 * 
	 * @param string $tag Tag slug.
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param string|array $params Query string or array of query parameters.
	 * @return object|false Response with posts list or FALSE on failure.
	 */
	public function getPostsByTag($tag, $orderBy='date', $params=array()) {
		return $this->callContentApi( array('posts', 'tag', $tag, $this->apiOrder($orderBy)), $params );
	}
	
	/**
	 * Get posts by author
	 * 
	 * @param string $author Author slug.
	 * @param string $orderBy Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param string|array $params Query string or array of query parameters.
	 * @return object|false Response with posts list or FALSE on failure.
	 */
	public function getPostsByAuthor($author, $orderBy='date', $params=array()) {
		return $this->callContentApi( array('posts', 'author', $author, $this->apiOrder($orderBy)), $params );
	}
	
	/**
	 * Get posts by year, month or day
	 * 
	 * @param string $date Date specifier: 'yyyy[-mm[-dd]]'.
	 * @param string|array $params Query string or array of query parameters.
	 * @return object|false Response with posts list or FALSE on failure.
	 */
	public function getPostsByDate($date, $params=array()) {
		return $this->callContentApi( array('posts', $date), $params );
	}
	
	/**
	 * Get posts from super-category by year, month or day
	 * 
	 * @param string $category Super-category slug.
	 * @param string $date Date specifier: 'yyyy[-mm[-dd]]'.
	 * @param string|array $params Query string or array of query parameters.
	 * @return object|false Response with posts list or FALSE on failure.
	 */
	public function getPostsByCategoryDate($category, $date, $params=array()) {
		return $this->callContentApi( array('posts', 'category', $category, $date), $params );
	}
	
	/**
	 * Get posts related to given
	 * 
	 * @param string $id Mongo-ID of the post.
	 * @param string|array $params Query string or array of query parameters.
	 * @return object|false Response with posts list or FALSE on failure.
	 */
	public function getRelatedPosts($id, $params=array()) {
		return $this->callContentApi( array('search', 'related', $id), $params );
	}
	
	/**
	 * Get post by its name (slug)
	 * 
	 * @param string $blog
	 * @param string $name
	 * @return mixed Post object or FALSE on failure.
	 */
	public function getPostByName($blog, $name) {
		return $this->callContentApi( array('posts', $blog, $name) );
	}
	
	protected function apiOrder($orderBy) {
		switch ($orderBy) {
		case 'most_liked':
		case 'like_count':
			return 'most_liked';
			break;
		
		case 'most_commented':
		case 'comment_count':
			return 'most_commented';
			break;
		
		case 'latest':
		case 'date':
		default:
			return null;
			break;
		}
	}
}
