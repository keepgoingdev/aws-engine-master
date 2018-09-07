<?php

/**
 * ArchivesWidget lists links to monthly blog archives
 */
class ArchivesWidget extends CWidget {
	/**
	 * Timestamp of first month to display 
	 * @var int
	 */
	public $start;

	/**
	 * Timestamp of last month to display
	 * @var int
	 */
	public $end;

	/**
	 * Widget title
	 * @var string
	 */
	public $title = 'Archive';

	/**
	 * Render archive list
	 */
	public function run() {
		$current = $this->end;
		$items = array();
		while ($current>=$this->start) {
			$year = date('Y', $current);
			$month = date('m', $current);
			$title = date('F', $current);
			
			$items[$year][] = array(
				'url'=>Yii::app()->urlManager->createUrl('date/archive', array('year'=>$year, 'month'=>$month)),
				'title'=>$title
			);
			
			$current = strtotime('-1 month', $current);
		}
		
		$this->render('archives-list', array('items'=>$items, 'title'=>$this->title));
	}
}
