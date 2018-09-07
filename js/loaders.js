var AWS = AWS || {};
AWS.modules = AWS.modules || {};

/**
 * More Loader
 * 
 * This loader allows creating AJAX-loaded lists with 'Load more' behavior.
 * The parameters should contain two callbacks:
 * 'load' - called when there is a need to load next portion of items.
 *          It will receive object with query parameter - next page token.
 *          It should return jqXHR, jQuery deferred or promise object.
 * 'render' - called when there is a need to render loaded items.
 *          It will receive loaded data.
 * @constructor
 * @param {Object} params
 * @returns {AWS.modules.MoreLoader}
 */
AWS.modules.MoreLoader = function(params) {
	AWS.mixins.pubsub.call(this);
	this.init();
	this.loadItems = params.load;
	this.renderItems = params.render;
};
jQuery.extend(AWS.modules.MoreLoader.prototype, {
	/**
	 * Initialise the loader
	 */
	init: function() {
		this.loading = false;
		this.finished = false;
		this.nextPageToken = '';
	},
	/**
	 * Load next items portion.
	 * 
	 * This function should be called when a user wants to see more items.
	 * @param {Object} [query] Query which will be passed to the load callback.
	 * @returns {Object} jQuery promise object.
	 */
	load: function(query) {
		var self = this;
		query = query || {};
		
		if (self.loading || self.finished)
			return;
		
		self.loading = true;
		self.publish('Loading');
		
		if (self.nextPageToken)
			query.next_page = this.nextPageToken;
		
		return self.loadItems(query).success(function(data){
			self.loading = false;
			self.publish('Loaded', [data]);
			self.renderItems(data);
			
			if (data.next_page) {
				self.nextPageToken = decodeURIComponent(data.next_page);
			} else {
				self.finish();
			}
		});
	},
	/**
	 * Stop the loader when there is no more items to load.
	 */
	finish: function() {
		this.finished = true;
		this.publish('Finish');
	}
});
