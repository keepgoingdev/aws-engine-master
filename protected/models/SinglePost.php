<?php

class SinglePost extends Post {
	
	public $post_content;
    public $tags = array();
    public $pageTitle;
    public $page = 0;

    const OPEN_GRAPH_DESC_LENGTH = 55;
	
	/**
	 * Load single post.
	 * 
	 * @param string $blog The original blog of the post.
	 * @param string $name Post slug.
	 * @return AwsApiModel|null Post model.
	 */
	public function findByName($blog, $name) {
		$post = Yii::app()->api->getPostByName($blog, $name);
		return $this->populateDocument($post);
	}
	
	/**
	 * Returns the static model of the specified API model class.
	 * 
	 * @return AwsApiModel The static model class.
	 */
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}
	
    /**
     * Returns link to the tag`s page
     * @param string $name tag name
     * @return string
     */
    public function getTaglink($name) {
        $params = array(
            'site'=>Yii::app()->urlManager->defaultSite,
            'name'=>$name,
        );
        return Yii::app()->urlManager->createUrl('tag/archive', $params);
    }
	
	/**
     * Returns post's page meta title
     * @return string
     */
    public function getTitle()
    {
        if($this->pageTitle === null) {
            $title = $this->getTitleForPage($this->page);
            if($title != '') {
                $title .= ' - ';
            }
            $this->pageTitle = $title. $this->post_title;
        }
        return $this->pageTitle;
    }

    /**
     * Return title of the page
     * @param $page page number
     * @param $empty string | null  if $empty is not empty but $title is empty - return value of $empty
     * @return null|string
     */
    public function getTitleForPage($page, $empty = null) {
        $title = '';
        if ($page >= 1) {
            if (preg_match("~<h(?:4|2)[^>]*>(.+)</h(?:4|2)>~U", $this->post_content[$page], $matches)) {
                $title = strip_tags($matches[1]);
            }
        }
        if($title == '' && $empty !== null) {
            $title = $empty;
        }
        return $title;
    }

    /**
     * Return content of the current page
     * @return string
     */
    public function getContent() {
    	$content = $this->post_content[$this->page];
    	
    	$frame = '<iframe width="426" height="240" src="http://www.youtube.com/embed/$1?fs=1&amp;feature=oembed" frameborder="0" allowfullscreen="" id="iframe-$1"></iframe>';
    	$content = preg_replace('/(*ANY)https?\:\/\/www\.youtube\.com\/watch\?v\=(.+)/m', $frame, $content);
    	$content = preg_replace('/(*ANY)https?\:\/\/youtu\.be\/(.+)/m', $frame, $content);
    	//make only first title h1
    	if ($this->page>=1)
    		$content = preg_replace('/<h(?:4|2)[^>]*>(.+?)<\/h(?:4|2)>/is', '<h1 class="h2">$1</h1>', $content, 1);
    	$content = Utils::autop($content);
    	
        return $content;
    }

    /**
     * Create data for Facebook OpenGraph block
     * @param PropertiesContainer $data
     */
    public function getOpenGraphData(PropertiesContainer $data)
    {
        $desc = preg_replace(
            "/^([\x20\r\n\t]|\xc2\xa0)+|([\x20\r\n\t]|\xc2\xa0)+$/", '', strip_tags($this->post_content[$this->page])
        );
        $desc = array_chunk(preg_split("~\s+~", $desc), self::OPEN_GRAPH_DESC_LENGTH);
        $desc = implode(' ', $desc[0]);
        $data->setProperties(
            array(
                 'title'       => $this->title,
                 'description' => $desc,
                 'type'        => 'article',
                 'url'         => $this->getPermalink(),
                 'image'       => $this->getPostImage()
            )
        );
    }
	
}
