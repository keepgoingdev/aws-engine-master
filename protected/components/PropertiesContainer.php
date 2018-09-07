<?php

/**
 * Service class for create dynamical properties with ability of building chains of the nested elements
 * i.e. $a->b->c = 1; $a->b->d = 2; ...
 */

class PropertiesContainer
{
    protected $_properties = array();

    /**
     * Create (or set) property
     * @param $name string the name of property
     * @param $value | mixed
     */
    public function __set($name, $value)
    {
        $this->_properties[$name] = $value;
    }

    /**
     * Get value of property
     * @param $name string the name of property
     * @return PropertiesContainer
     */
    public function __get($name)
    {
        if(isset($this->_properties[$name])) {
            return $this->_properties[$name];
        }
        $object = new PropertiesContainer();
        $this->_properties[$name] = $object;
        return $object;
    }

    /**
     * Create (or set) group of properties
     * @param $params array
     */
    public function setProperties($params) {
        if(is_array($params)) {
            foreach($params as $name=>$value) {
                $this->$name = $value;
            }
        }
    }

    /**
     * Convert object property to string
     * @return string
     */
    public function __toString() {
        return '';
    }
}