var AWS = AWS || {};
AWS.mixins = AWS.mixins || {};

/**
 * Publish/subscribe mixin
 * 
 * Allows subscribing to object's events.
 * @mixin
 */
AWS.mixins.pubsub = (function() {
	/**
	 * Subscribe to object events
	 * 
	 * @param {Object|Function} subscriber The subscriber object or callback.
	 * @returns {Object|Function|null} Subscriber.
	 */
	var subscribe = function(subscriber) {
		var context, callback;
		if ( typeof subscriber === 'object' ) {
			context = subscriber;
			callback = null;
		} else if ( jQuery.isFunction(subscriber) ) {
			context = null;
			callback = subscriber;
		}
		
		if (callback || context) {
			this.subscribers.push({subscriber:subscriber, context:context, callback:callback});
			return subscriber;
		}
	};
	
	/**
	 * Unsubscribe from object events
	 * 
	 * @param {Object|Function} subscriber The subscriber that was passed to subscribe().
	 */
	var unsubscribe = function(subscriber) {
		for ( var i=this.subscribers.length-1; i>=0; i-- ) {
			if (this.subscribers[i].subscriber===subscriber) {
				this.subscribers.splice(i, 1);
				break;
			}
		}
	};
	
	/**
	 * Notify subscribers about an event
	 * 
	 * If subscriber is Object, its method on{event} will be called with the model as first argument,
	 * other arguments will be taken from args.
	 * If subscriber is Function, it will be called with event as first argumen, the model as seconf one,
	 * other arguments will be taken from args.
	 * @param {String} event Event name.
	 * @param {Array} [args] Argument to be passed to subscriber.
	 */
	var publish = function(event, args) {
		args = args || [];
		
		for ( var i=0; i<this.subscribers.length; i++) {
			var s = this.subscribers[i],
			    callback, cbArgs = [];
			
			if (s.context) {
				var cbName = 'on' + event;
				if ( jQuery.isFunction(s.context[cbName]) ) {
					callback = s.context[cbName];
				}
			} else {
				callback = s.callback;
				cbArgs.push(event);
			}
			
			if (callback) {
				cbArgs.push(this);
				cbArgs = cbArgs.concat(args);
				callback.apply(s.context, cbArgs);
			}
		}
	};
	
	return function() {
		this.subscribers = [];
		this.subscribe = subscribe;
		this.unsubscribe = unsubscribe;
		this.publish = publish;
	};
})();
