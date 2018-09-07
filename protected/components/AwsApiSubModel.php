<?php

abstract class AwsApiSubModel extends CModel {
	
	/**
	 * @var AwsApiSubModel Reference to the parent model.
	 */
	protected $_owner;
	
	/**
	 * @var AwsApiSubModel[] List of submodel objects.
	 */
	protected $_embedded = array();
	
	private static $_attributes = array(); // class name => attribute names
	
	/**
	 * Constructor.
	 *
	 * @param string $scenario scenario name. See {@link CModel::scenario} for more details about this parameter.
	 */
	public function __construct($scenario='insert', $owner=null) {
		if ( !is_null($owner) )
			$this->_owner = $owner;
		
		$this->setScenario($scenario);
		$this->init();
		$this->attachBehaviors($this->behaviors());
		$this->afterConstruct();
	}
	
	/**
	 * Initializes this model.
	 *
	 * This method is invoked when the instance is newly created and has
	 * its {@link scenario} set.
	 * You may override this method to provide code that is needed to initialize the model (e.g. setting
	 * initial property values.)
	 */
	public function init() {}
	
	/**
	 * Creates submodel instance if necessary and returns it, or passes on.
	 * 
	 * @see CComponent::__get()
	 */
	public function __get($name) {
		$subModels = $this->subModels();
		if( $this->hasSubModels() && isset($subModels[$name]) ) {
			// Late creation of embedded documents on first access
			if (!isset($this->_embedded[$name]) || is_null($this->_embedded[$name]) ) {
				$class = $subModels[$name];
				$doc = new $class($this->getScenario(), $this);
				$this->_embedded[$name] = $doc;
			}
			return $this->_embedded[$name];
		}
		else
			return parent::__get($name);
	}
	
	/**
	 * Creates submodel instance if necessary and sets its attributes or value, or passes value on.
	 * 
	 * @see CComponent::__set()
	 * @param string $name The submodel name.
	 * @param mixed $value Array of submodel attributes or submodel object itself.
	 */
	public function __set($name, $value) {
		$subModels = $this->subModels();
		if( $this->hasSubModels() && isset($subModels[$name]) ) {
			if(is_array($value)) {
				// Late creation of submodels on first access
				if ( is_null($this->_embedded[$name]) ) {
					$class = $subModels[$name];
					$doc = new $class($this->getScenario(), $this);
					$this->_embedded[$name] = $doc;
				}
				return $this->_embedded[$name]->attributes = $value;
			} else if ($value instanceof AwsApiSubModel)
				return $this->_embedded[$name] = $value;
		}
		else
			parent::__set($name, $value);
	}
	
	/**
	 * Checks if the submodel is set or passes on.
	 * 
	 * @see CComponent::__isset()
	 */
	public function __isset($name) {
		if( $this->hasSubModels() && isset($subModels[$name]) ) {
			return isset($this->_embedded[$name]);
		} else
			return parent::__isset($name);
	}
	
	/**
	 * Returns the list of attribute names.
	 *
	 * By default, this method returns all public properties of the class and submodels names.
	 * You may override this method to change the default.
	 * 
	 * @return array List of attribute names.
	 */
	public function attributeNames() {
		$className = get_class($this);
		if( !isset(self::$_attributes[$className]) ) {
			$class = new ReflectionClass(get_class($this));
			$names = array();
			foreach($class->getProperties() as $property) {
				$name = $property->getName();
				if($property->isPublic() && !$property->isStatic())
					$names[] = $name;
			}
			$names = array_merge($names, array_keys($this->subModels()));
			return self::$_attributes[$className] = $names;
		} else
			return self::$_attributes[$className];
	}
	
	/**
	 * Sets the attribute values in a massive way.
	 * 
	 * @param array|object $values Attribute values (name=>value) to be set.
	 * @param boolean $safeOnly Whether the assignments should only be done to the safe attributes.
	 * A safe attribute is one that is associated with a validation rule in the current {@link scenario}.
	 * @see CModel::getSafeAttributeNames()
	 * @see self::attributeNames()
	 */
	public function setAttributes($values, $safeOnly=true) {
		if (is_object($values))
			$values = (array)$values;
		
		if (!is_array($values))
			return;
		
		if ($this->hasSubModels()) {
			$attributes=array_flip($safeOnly ? $this->getSafeAttributeNames() : $this->attributeNames());
			
			foreach ($this->subModels() as $fieldName => $className)
				if( isset($values[$fieldName]) && isset($attributes[$fieldName]) ) {
					//submodel class will be instantiated in getter
					$this->$fieldName->setAttributes($values[$fieldName], $safeOnly);
					unset($values[$fieldName]);
				}
		}
		
		parent::setAttributes($values, $safeOnly);
	}
	
	/**
	 * Returns the list of submodels attributes (name => class name).
	 * 
	 * Override this method in subclass to define submodels.
	 * 
	 * @return array
	 */
	public function subModels() {
		return array();
	}
	
	/**
	 * Is there submodels defined?
	 * 
	 * @return boolean
	 */
	public function hasSubModels() {
		$subModels = $this->subModels();
		return !empty($subModels);
	}
	
	/**
	 * Override default setScenario method for populating to submodels.
	 * @see CModel::setScenario()
	 */
	public function setScenario($value)
	{
		foreach($this->_embedded as $doc)
			$doc->setScenario($value);
		parent::setScenario($value);
	}
	
}
