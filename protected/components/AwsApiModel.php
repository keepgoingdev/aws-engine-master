<?php

abstract class AwsApiModel extends AwsApiSubModel {
	
	private static $_models = array(); // class name => model
	
	/**
	 * Constructor.
	 * 
	 * @param string $scenario scenario name. See {@link CModel::scenario} for more details about this parameter.
	 */
	public function __construct($scenario='insert') {
		if($scenario===null) // internally used by populateRecord() and model()
			return;
		
		parent::__construct($scenario);
	}
	
	/**
	 * Returns the static model of the specified API model class.
	 *
	 * The model returned is a static instance of the AwsApiModel class.
	 * It is provided for invoking class-level methods (something similar to static class methods.)
	 * 
	 * EVERY derived AwsApiModel class must override this method as follows,
	 * <pre>
	 * public static function model($className=__CLASS__) {
	 *     return parent::model($className);
	 * }
	 * </pre>
	 * 
	 * @param string $className active record class name.
	 * @return AwsApiModel API model instance.
	 */
	public static function model($className=__CLASS__) {
		if(isset(self::$_models[$className]))
			return self::$_models[$className];
		else {
			$model = self::$_models[$className] = new $className(null);
			$model->attachBehaviors($model->behaviors());
			return $model;
		}
	}
	
	/**
	 * Creates an API document with the given attributes.
	 * 
	 * This method should be internally used by the find methods of derived classes.
	 * @param array $attributes attribute values (attribute name=>attribute value).
	 * @return AwsApiModel|null the newly created document. The class of the object is the same as the model class.
	 * Null is returned if the input data is false.
	 */
	public function populateDocument($attributes) {
		if($attributes!==false) {
			$doc = $this->instantiate($attributes);
			$doc->setScenario('update');
			$doc->init();
			$doc->attachBehaviors($doc->behaviors());
			return $doc;
		}
		else
			return null;
	}
	
	/**
	 * Creates a list of documents based on the input data.
	 * 
	 * This method should be internally used by the find methods of derived classes.
	 * @param array $data list of attribute values for the documents.
	 * @param string $index the name of the attribute whose value will be used as indexes of the query result array.
	 * If null, it means the array will be indexed by zero-based integers.
	 * @return array list of documents.
	 */
	public function populateDocuments($data, $index=null) {
		$docs = array();
		foreach($data as $attributes) {
			if( ($doc=$this->populateDocument($attributes)) !== null ) {
				if($index===null)
					$docs[]=$doc;
				else
					$docs[$doc->$index]=$doc;
			}
		}
		return $docs;
	}
	
	/**
	 * Creates an API model instance.
	 *
	 * This method is called by {@link populateDocument} and {@link populateDocuments}.
	 * You may override this method if the instance being created
	 * depends the attributes that are to be populated to the document.
	 * @param array $attributes list of attribute values for the document.
	 * @return AwsApiModel the document.
	 */
	protected function instantiate($attributes) {
		$class = get_class($this);
		$model = new $class(null);
		$model->setAttributes($attributes, false);
		
		return $model;
	}
	
}
