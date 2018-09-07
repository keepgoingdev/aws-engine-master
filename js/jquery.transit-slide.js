/**
 * jQuery Transit Slide - fallback for transitions and translate for jQuery Transit
 */
(function($){
	var rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i;
	
	//step functions for animation of slide transform properties
	$.fx.step['x'] = function(fx){
		$.cssHooks['x'].set( fx.elem, fx.now + fx.unit );
	};
	$.fx.step['y'] = function(fx){
		$.cssHooks['y'].set( fx.elem, fx.now + fx.unit );
	};
	
	registerFallbackCssHook('x');
	registerFallbackCssHook('y');
	
	function parseValue(val) {
		var parts = rfxnum.exec(val);
		
		return {
			val: parseFloat(parts[2]),
			unit: parts[3] || 'px' //NOTE: the case of properties that don't need unit is not considered
		};
	}
	
	function getSlideProperty($elem, prop) {
		var slideProp,
		    slideOrigin = $elem.data('slide-origin') || 'top left';
		if (prop=='x')
			slideProp = slideOrigin.search(/right/)!=-1? 'right' : 'left';
		else
			slideProp = slideOrigin.search(/bottom/)!=-1? 'bottom' : 'top';
		
		return slideProp;
	}
	
	/**
	 * Convert CSS units of the property of the element
	 * 
	 * This function may change element's style and not return it back!
	 * (this is for performance purposes if multiple subsequent conversions occurs)
	 * 
	 * The 'target' parameter accepts reference point, to which element may be moved
	 * in order to compute property value in target units.
	 * Property values are perpesented as object with following properties:
	 *   val - numeric value;
	 *   unit - string unit representation.
	 * 
	 * @param {Node} elem The element for which units are going to be converted.
	 * @param {string} prop The CSS property of the element.
	 * @param {Object} source Initial property value.
	 * @param {Object} target Property value with target unit and reference value.
	 * @params {Object} coeffs Cache for conversion factors.
	 * @returns {Object} Converted property value.
	 */
	function convertUnit(elem, prop, source, target, coeffs) {
		if (coeffs.px == undefined)
			coeffs.px = 1;
		
		if (source.unit===target.unit)
			return source;
		
		if (source.val==0) {
			return {
				val: 0,
				unit: target.unit
			};
		}
		
		//compute conversion factors source/target unit to pixels
		if (coeffs[source.unit]==undefined || coeffs[target.unit]==undefined) {
			var fx = new $.fx(elem, {}, prop); //used for getting values in pixels
			
			//move element to the known value in units and get corresponding pixels value
			if (coeffs[source.unit]==undefined) {
				$.style(elem, prop, (source.val || 1)+source.unit);
				coeffs[source.unit] = (source.val || 1)/fx.cur();
			}
			
			if (coeffs[target.unit]==undefined) {
				$.style(elem, prop, (target.val || 1)+target.unit);
				coeffs[target.unit] = (target.val || 1)/fx.cur();
			}
			
			//NOTE: return element to initial state would have to be here
		}
		
		//compute converted value using factor source unit to target unit
		return {
			val: source.val * coeffs[target.unit]/coeffs[source.unit],
			unit: target.unit
		};
	}
	
	function slideFallback($elem, prop, fromValue, toValue) {
		//if transforms are not supported, we need to convert translate values
		//to the coordinate system of absolute positioning, considering initial
		//element offset and absolute position property (slide origin)
		
		var fallbackProp = getSlideProperty($elem, prop);
		
		var slideFrom = parseValue(fromValue),          //initial translate value
			slideTo = parseValue(toValue),              //target translate value
			from = parseValue($elem.css(fallbackProp)); //current absolute position
		
		//percents in translate values refer to element width/height,
		//so they can't be used for position values - convert to pixels instead
		var slidePercentCoeff = $elem.prop('offset'+(prop=='x'? 'Width' : 'Height'))/100;
		if (slideFrom.unit=='%') {
			slideFrom.val *= slidePercentCoeff;
			slideFrom.unit = 'px';
		}
		if (slideTo.unit=='%') {
			slideTo.val *= slidePercentCoeff;
			slideTo.unit = 'px';
		}
		
		var coeffs = {};
		
		//round pixels values because some ugly browsers rounds them itself
		//and gotten value may not be equal to set value
		if (slideFrom.unit=='px')
			slideFrom.val = Math.round(slideFrom.val);
		if (slideTo.unit=='px')
			slideTo.val = Math.round(slideTo.val);
		
		//converge all values to target unit
		slideFrom = convertUnit($elem.get(0), fallbackProp, slideFrom, slideTo, coeffs);
		from = convertUnit($elem.get(0), fallbackProp, from, slideTo, coeffs);
		
		//compute target value in position coordinate system
		var sign = (fallbackProp=='right' || fallbackProp=='bottom')? -1 : 1;
		var to = {
			val: from.val + sign*(slideTo.val - slideFrom.val),
			unit: slideTo.unit
		};
		
		var props = {};
		props[fallbackProp] = to.val+to.unit;
		$elem.css(props);
	}
	
	function registerFallbackCssHook(prop) {
		var originalHook = $.cssHooks[prop].set;
		
		/**
		 * CSS hook for translate transforms with fallback to absolute positioning properties
		 * 
		 * Which position property will be used depends on translate direction (x or y)
		 * and the 'slide-origin' data of the element ('left', 'top right', 'bottom left' and so on).
		 */
		$.cssHooks[prop].set = function(elem, value) {
			if (!$.support.transform) {
				var $elem = $(elem),
				    fromValue = $elem.css('transit:transform').get(prop);
				slideFallback($elem, prop, fromValue, value);
			}
			
			//call original CSS hook after fallback applying,
			//so we can get initial transform state above
			return originalHook.call(this, elem, value);
		};
	};
	
	/**
	 * Animate translate transform using transitions or regular jQuery animation mechanism
	 */
	$.fn.slide = function(properties, duration, easing, callback) {
		//Account for '.slide(properties, callback).
		if (typeof duration === 'function') {
			callback = duration;
			duration = undefined;
		}
		
		//Account for '.slide(properties, duration, callback)'.
		if (typeof easing === 'function') {
			callback = easing;
			easing = undefined;
		}
		
		if (typeof properties.complete !== 'undefined') {
			callback = properties.complete;
			delete properties.complete;
		}
		
		var leaveTransforms = false;
		if (typeof properties.leaveTransforms !== 'undefined') {
			leaveTransforms = properties.leaveTransforms;
			delete properties.leaveTransforms;
		}
		
		if ($.support.transform && !leaveTransforms) {
			var appliedTransform = this.css('transit:transform'),
			    fromX = appliedTransform.get('x'),
			    fromY = appliedTransform.get('y');
			
			//restore previously applied transform, because it may be reset
			//at the end of previous animation
			this.css({transform: appliedTransform});
			//reset fallback transform
			//current fallback translate value was calculated from previously applied transform
			if (properties.x!=undefined)
				slideFallback(this, 'x', fromX, 0);
			if (properties.y!=undefined)
				slideFallback(this, 'y', fromY, 0);
		}
		
		var cb = function() {
			var $this = $(this);
			if ($.support.transform && !leaveTransforms) {
				//set fallback transform
				//current fallback translate value is 0, so fromValue = 0
				if (properties.x!=undefined)
					slideFallback($this, 'x', 0, properties.x);
				if (properties.y!=undefined)
					slideFallback($this, 'y', 0, properties.y);
				//reset transform
				$this.get(0).style[$.support.transform] = 'none';
			}
			if (callback)
				callback.apply(this);
		};
		
		if (!$.support.transition) {
			return $.fn.animate.call(this, properties, duration, easing, cb);
		} else {
			//Substitute x and y with appropriate position attribute in the property map.
			//This allows Transit to build proper CSS transition if transforms are not supported.
			//The position attribute (left/right/top/bottom) depends on the element,
			//so we set it here instead of in registerFallbackCssHook().
			var origXMap = $.transit.propertyMap.x, origYMap = $.transit.propertyMap.y;
			if (!$.support.transform) {
				if (properties.x!=undefined)
					$.transit.propertyMap.x = getSlideProperty(this, 'x');
				if (properties.y!=undefined)
					$.transit.propertyMap.y = getSlideProperty(this, 'y');
			}
			
			var ret = $.fn.transition.call(this, properties, duration, easing, cb);
			
			$.transit.propertyMap.x = origXMap;
			$.transit.propertyMap.y = origYMap;
			
			return ret;
		}
	};
})(jQuery);
