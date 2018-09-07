var AWS = AWS || {};
AWS.modules = AWS.modules || {};
AWS.ajaxControllers = AWS.ajaxControllers || {};

jQuery.extend(AWS, {
	config: {
		fonts: {family: 'Oswald'},
		permanentDOMEls: {
			$content: '#content',
			$postImage: '#single .post-image-wrap',
			$nextPage: '.paging .next',
			$nextCat: '.paging .next-cat'
		},
		layouts: {
			mobile: '(max-width: 767px)',
			mobileNarrow: '(max-width: 480px)',
			wide: '(min-width: 1300px)'
		},
		searchComplete: {
			//lookup: awsL10n.subblogs,
			width: 165,
			zIndex: 1100100,
			onSelect: function(value, data, input){
				e('searchCompletion', [value]);
				jQuery(input).closest('form').submit();
			}
		},
		ajax: {
			container: '#main',
			routes: [
				['get', '/?(?:(latest|most_liked|most_commented)/?)?(?:\\?.*)?(?:#.*)?', 'Archives.index'],
				['get', '/author/:name/?(?:\\?.*)?(?:#.*)?', 'Archives.author'],
				['get', '/category/:name/?(?:(latest|most_liked|most_commented)/?)?(?:\\?.*)?(?:#.*)?', 'Archives.category'],
				['get', '/tag/:name/?(?:\\?.*)?(?:#.*)?', 'Archives.tag'],
				['get', '/(\\d{4})(?:/(\\d{2}))?(?:/(\\d{2}))?/?(?:\\?.*)?(?:#.*)?', 'Archives.date']
				//['get', '/:name/?', 'Post.post']
			],
			popupRoutes: [
				['get', '#search', 'Search.search'],
				['get', '#activity', 'Activity.log'],
				['get', '#about', 'About.about'],
				['get', '#?', 'Popup404.notFound']
			]
		},
		templates: {
			archiveWrapper: '<%= this.archiveMeta() %><div id="posts" class="box-hold"></div>',
			archiveMeta: '<div id="<%= type %>-meta" class="archive-meta">'+
				'<h1 class="page-title"><%= title %></h1>'+
				'</div>',
			archiveMetaSort: '<div id="<%= type %>-meta" class="archive-meta">'+
				'<div class="dropdown">'+
				'<h1 class="page-title dropdown-toggle"><%= title %></h1>'+
				'<ul class="dropdown-menu">'+
				'<li><a href="<%= this.sortURL(\'most_liked\') %>">Most Liked</a></li>'+
				'<li><a href="<%= this.sortURL(\'most_commented\') %>">Most Commented</a></li>'+
				'<li><a href="<%= this.sortURL(\'latest\') %>">Latest</a></li>'+
				'</ul></div>'+
				'</div>',
			authorArchiveMeta: '<div id="author-meta" class="archive-meta">'+
				'<div id="author-avatar"><img class="avatar avatar-150 photo" width="150" height="150" src="<%= avatar %>"/></div>'+
				'<h1><%= display_name %></h1>'+
				'<% if(obj.description){ %> <div id="author-description">'+
					'<h4 class="author-about">About Me</h4> <%= description %>'+
				'</div> <% } %>'+
				//'<% if(obj.user_url){ %> <div id="author-website">'+
				//	'<strong>Website:</strong> <a href="<%= user_url %>"><%= user_url %></a>'+
				//'</div> <% } %>'+
				'</div>',
			archivePost: '<div id="<%= post_id %>" class="<%= classes %>" style="background-image: url(<%= this.postImage() %>);">'+
				'<a href="<%= post_link %>">'+
					'<h2><%= post_title %></h2>'+
					'<%= author.renderView() %>'+
					'<span class="counter">'+
						'<%= this.categoryLabel() %>'+
						'<% if(obj.likes){ %><span class="likes"><%= likes %></span><% } %>'+
						'<% if(obj.comment_count){ %><span class="comments"><%= comment_count %></span><% } %>'+
					'</span>'+
				'</a></div>',
			comment: '<div class="comment" data-id="<%= _id.$id %>">'+
				'<div class="image" data-id="<%= this.capID() %>" data-target="#modalPopup" data-toggle="modal">'+
					'<img class="avatar" src="<%= this.avatar() %>" />'+
				'</div>'+
				'<div class="comment-body">'+
					'<div class="comment-head">'+
						'<div class="comment-author">'+
							'<span data-id="<%= this.capID() %>" data-target="#modalPopup" data-toggle="modal">'+
								'<%= comment_author %>'+
							'</span>'+
						'</div>'+
					    '<span class="time"><%= this.timeAgo() %></span>'+
					'</div> '+
					'<p><%= this.getText() %></p>'+
					'<div class="comment-foot">'+
						'<% if (!obj.isReply) { %>'+
							'<button name="reply-comment" class="bt-link">Reply</button>'+
						'<% } %>'+
						'<button name="like-comment" class="bt-link like-comment"><span class="pic">k</span> <span class="like-text"><%= this.likeText() %></span></button>'+
					'</div>'+
				'</div>'+
				'<div class="replies">'+
					'<% if (obj.replies && replies.length > 5) { %>'+
						'<div class="all-replies"><button name="all-replies" class="bt-link">All Replies</button></div>'+
					'<% } %>'+
				'</div></div>',
			commentAuthorProfile: '<div class="cap">'+
					'<div class="image">'+
						'<img src="<%= this.img %>" alt="<%= this.name %>" />'+
						'<h1><%= this.name %></h1>'+
					'</div>'+
					'<div class="loading-icon" style="display:block;"><div class="spinner">1</div></div>'+
					'<div class="cap-data"><%= this.getPosts() %></div>'+
				'</div>',
			authorBlock: '<span class="author-block">'+
				'<span class="image"><img class="avatar avatar-32 photo" width="32" height="32" src="<%= avatar %>"/></span>'+
				'<span>By <%= display_name %></span>'+
			'</span>',
			searchHeader: '<div class="search-box"><form method="get" action="#search"><label for="search-input" class="pic">s</label><input id="search-input" name="query" type="text" placeholder="Search Posts, Authors, etc."/></form></div>',
			searchBody: '<div class="loading-icon"><div class="spinner">1</div></div>',
			activityHeader: '<h3>Recent Activity</h3>',
			activityBody: '<div class="loading-icon"><div class="spinner">1</div></div>',
			miniCategory: '<div class="<%= classes %> mini-category"><a href="<%= link %>" title="<%= name %>"><%= name %></a></div>',
			miniAuthor: '<div class="<%= classes %> mini-author"><a href="<%= posts_link %>" title="Posts by <%= name %>"><%= name %></a></div>',
			miniPost: '<div class="<%= classes %>">'+
				'<%= this.postImage() %>'+
				'<a href="<%= post_link %>" class="entry-link"><%= post_title %></a>'+
				'<div class="counter">'+
					'<% if(obj.likes){ %><span class="likes"><%= likes %></span><% } %>'+
					'<% if(obj.comment_count){ %><span class="comments"><%= comment_count %></span><% } %>'+
					'<span class="time"><%= timeAgo(apiDate(post_date)) %></span>'+
				'</div>'+
				'</div>',
			miniComment: '<div class="<%= classes %> mini-comment">'+
				'<%= this.avatar() %>'+
				'<div class="mini-body"><div><strong><%= this.authorList() %></strong> <%= this.commentedOn() %> <div class="post-link"><a href="<%= post_url %>"><%= post_title %></a></div></div>'+
				'<div class="time"><%= time_ago %></div></div>'+
				'</div>',
			postEvent: '<div class="<%= classes %>">'+
				'<%= this.postImage() %>'+
				'<a href="<%= post_link %>" class="entry-link"><%= post_title %></a>'+
				'<div class="time"><%= time_ago %></div>'+
				'</div>',
			commentLogin: '<div class="respond">'+
				'<a href="#" class="login-link bt-btn">To comment, please sign in</a>'+
				'</div>',
			commentForm: '<div class="respond">'+
				'<form method="post" action="http://app.allwomenstalk.com/service/comment-gate.php">'+
					'<textarea name="comment_content" placeholder="Add comment"><%= comment_content %></textarea>'+
					'<input type="submit" name="send-comment" value="Send" class="bt-btn">'+
					'<% if (obj.isReply) { %>'+
						'<button name="cancel-reply" class="bt-small">Cancel reply</a>'+
					'<% } %>'+
				'</form>'+
				'</div>'
		}
	},
	models: {},
	views: {},
	start: function(){
		var self = this;
		self.fontLoader = new self.modules.FontLoader(self.config.fonts);
		self.fontLoader.start();
		self.domCache = new self.modules.DomCache(self.config.permanentDOMEls);

		self.contentProcessor = new self.modules.ContentProcessor();
		
		self.config.searchComplete.lookup = awsL10n.subblogs;
		
		self.activity = new self.modules.Activity();
		//self.activity.start();

		self.router = new self.modules.Router(self.config.ajax.container, self.ajaxControllers, {
			base: rtrim(awsL10n.homeURL.replace( location.protocol+'//'+location.host, '' ), '/'), //strip proto & host to get only path from root
			routes: self.config.ajax.routes,
			siteURLPattern: awsL10n.siteURLPattern
		});
		if ( awsL10n.isHome || awsL10n.isArchive ) {
			on('posts.DOMProgress.AWS', function(){
				self.router.start();
			});
		}
		
		self.popupRouter = new self.modules.Router('body', self.ajaxControllers, { //using body here to catch all elements with 'data-href' attribute
			routes: self.config.ajax.popupRoutes,
			locationProxy: ['DataLocationProxy', 'popup-location', 'data-href']
		});
		on('footer.DOMProgress.AWS', function(){
			self.popupRouter.start();
		});
		if ( awsL10n.isSingle && awsL10n.pageNumber !== '') {
			self.postPaging = new self.modules.PostPaging(awsL10n.pageNumber);
		}
		
		self.comments = new self.modules.Comments(awsL10n.postID);
		on('sidebar.DOMProgress.AWS', function(){ 
			if (!isLayout('mobile'))
				self.comments.start();
		});
	}
});
on('head.DOMProgress.AWS', function(){ AWS.start(); });

/**
 * Fonts watcher
 *
 * Based on Google/Typekit WebFont Loader (https://github.com/typekit/webfontloader)
 */
AWS.modules.FontLoader = function(fontConfig){
	this.fontFamily = fontConfig.family;
	this.originalSizeA_ = this.getDefaultFontSize_(this.DEFAULT_FONTS_A);
	this.originalSizeB_ = this.getDefaultFontSize_(this.DEFAULT_FONTS_B);
	this.$requestedFontA_ = this.createHiddenElementWithFont_(this.DEFAULT_FONTS_A);
	this.$requestedFontB_ = this.createHiddenElementWithFont_(this.DEFAULT_FONTS_B);

	//this.lastObservedSizeA_ = this.originalSizeA_;
	//this.lastObservedSizeB_ = this.originalSizeB_;
	this.lastObservedSizeA_ = this.$requestedFontA_.outerWidth();
	this.lastObservedSizeB_ = this.$requestedFontB_.outerWidth();

	on('load', function(){
		e('fontsLoaded', ['load']);
	});
};
jQuery.extend(AWS.modules.FontLoader.prototype, {
	DEFAULT_FONTS_A: "arial,'URW Gothic L',sans-serif",
	DEFAULT_FONTS_B: "Georgia,'Century Schoolbook L',serif",
	DEFAULT_TEST_STRING: 'BESbswy',

	insertInto: function(tagName, e) {
		var t = document.getElementsByTagName(tagName)[0];

		if (!t) { // opera allows documents without a head
			t = document.documentElement;
		}

		if (t && t.lastChild) {
			// This is safer than appendChild in IE. appendChild causes random
			// JS errors in IE. Sometimes errors in other JS exectution, sometimes
			// complete 'This page cannot be displayed' errors. For our purposes,
			// it's equivalent because we don't need to insert at any specific
			// location.
			t.insertBefore(e, t.lastChild);
			return true;
		}
		return false;
	},
	createHiddenElementWithFont_: function(defaultFonts, defaultOnly){
		var styles = {
			position: 'absolute',
			top: '-999px',
			left: '-999px',
			fontSize: '300px',
			width: 'auto',
			height: 'auto',
			lineHeight: 'normal',
			margin: 0,
			padding: 0,
			fontVariant: 'normal',
			fontFamily: (defaultOnly? '' : this.fontFamily + ', ') + defaultFonts,
			fontStyle: 'normal',
			fontWeight: 'normal'
		};
		var $span = jQuery('<span />').css(styles);//.appendTo(document.documentElement); //body doesn't exist yet
		this.insertInto('body', $span.get(0));
		$span.text(this.DEFAULT_TEST_STRING);
		return $span;
	},
	getDefaultFontSize_: function(defaultFonts){
		var $defaultFont = this.createHiddenElementWithFont_(defaultFonts, true);
		var size = $defaultFont.outerWidth();
		$defaultFont.remove();

		return size;
	},
	start: function() {
		this.started_ = new Date().getTime();
		this.check_();
	},
	check_: function() {
		var sizeA = this.$requestedFontA_.outerWidth();
		var sizeB = this.$requestedFontB_.outerWidth();

		if ((this.originalSizeA_ != sizeA || this.originalSizeB_ != sizeB) &&
			this.lastObservedSizeA_ == sizeA && this.lastObservedSizeB_ == sizeB) {
			this.finish_(true);
		} else if ( (new Date().getTime()) - this.started_ >= 5000 ) {
			this.finish_(false);
		} else {
			this.lastObservedSizeA_ = sizeA;
			this.lastObservedSizeB_ = sizeB;
			this.asyncCheck_();
		}
	},
	asyncCheck_: function() {
		setTimeout(function(context, func) {
			return function() {
				func.call(context);
			};
		}(this, this.check_), 10);
	},
	finish_: function(success){
		this.$requestedFontA_.remove();
		this.$requestedFontB_.remove();
		if (success) {
			e('fontsLoaded', ['loaded']);
		}
	}
});

/**
 * jQuery DOM cache
 *
 * @param {Object} permanent Predefined commonly-used elements ({key: selector})
 * @returns {DomCache}
 */
AWS.modules.DomCache = function(permanent){
	this.permanent = permanent;
	this.cache = {};
	this.start();
};
jQuery.extend(AWS.modules.DomCache.prototype, {
	/**
	 * Determine DOM selector from cache key
	 *
	 * @param {String} key Cache key
	 * @returns {String} selector
	 */
	_getSelector: function(key){
		if ( this.permanent.hasOwnProperty(key) )
			return this.permanent[key];
		else
			return key;
	},

	/**
	 * Query the DOM and store result in the cache
	 *
	 * @param {String} key Cache key
	 * @param {String} selector DOM selector
	 * @returns {Object} jQuery object for selector
	 */
	_fetch: function(key, selector) {
		var $el = jQuery(selector);
		if ($el) {
			this.cache[key] = $el;
		}
		return $el;
	},

	/**
	 * Get the DOM element (either from cache or directly from the DOM)
	 *
	 * @param {String} key Cache key or selector
	 * @returns {Object} jQuery object for selector
	 */
	get: function(key){
		if ( this.cache.hasOwnProperty(key) ) {
			return this.cache[key];
		}

		var selector = this._getSelector(key);
		return this._fetch(key, selector);
	},

	/**
	 * Refresh cache for given key or selector
	 *
	 * @param {String} key Cache key or selector
	 */
	refresh: function(key){
		var selector = this._getSelector(key);
		this._fetch(key, selector);
	},

	/**
	 * Refresh all cache
	 */
	refreshCache: function(){
		var self = this;
		jQuery.each(self.cache, function(key, $el){
			self.refresh(key);
		});
	},
	
	/**
	 * Delete cached element
	 * 
	 * @param {String} key Cache key or selector.
	 */
	remove: function(key) {
		delete this.cache[key];
	},

	/**
	 * Refresh cache for permanent elements
	 */
	refreshPermanent: function(){
		var self = this;
		jQuery.each(self.permanent, function(key, selector){
			self._fetch(key, selector);
		});
	},

	/**
	 * Initialization
	 *
	 * Shedules refreshing of permanent elements when DOM will be ready
	 */
	start: function(){
		var self = this;
		jQuery(document).ready( function(){
			self.refreshPermanent();
		});
	}
});

//TODO: unify all universal 'call' functions (for Content API, Users API)
/**
 * AWS API interface
 * 
 * @constructor
 * @returns {AWS.modules.Api}
 */
AWS.modules.Api = function(){
};
jQuery.extend(AWS.modules.Api.prototype, {
	/**
	 * Universal function to interact with API
	 * 
	 * @param {String[]|String} path API function path. If array is passed, its elements will be joined with '/'.
	 * @param {Object} params Query parametes.
	 * @param {Function} callback Callback function.
	 * @returns {Object} jqXHR.
	 */
	call: function(path, params, callback) {
		var url = '';
		if ( jQuery.isArray(path) ) {
			//filter out empty path elements
			var filteredPath = jQuery.grep(path, function(el, i){
				return !!el;
			});
			url = '/' + filteredPath.join('/');
		} else if ( typeof path !== 'string' ) {
			url = '/' + path.toString();
		} else {
			url = path;
		}
		url = this.contentURL + url;
		
		params = params || {};
		params.format = 'jsonp';
		
		return jQuery.ajax({
			url: url,
			data: params,
			dataType: 'jsonp',
			success: callback
		});
	},
	
    /**
     * Get posts with 'query' API method
     *
     * @param {Object} query API query. May contain 'authors' and 'categories' parameters
     *     as well as other common API parameters ('count' etc.).
     * @param {Function} callback Callback function.
     * @returns {Object} jqXHR.
     */
    getDataByParams: function(path, params, callback) {
        return this.call(path, params, callback);
    },

	/**
	 * Get posts with 'query' API method
	 * 
	 * @param {Object} query API query. May contain 'authors' and 'categories' parameters 
	 *     as well as other common API parameters ('count' etc.).
	 * @param {Function} callback Callback function.
	 * @returns {Object} jqXHR.
	 */
	getPostsQuery: function(query, callback) {
		return this.call('/posts/query', query, callback);
	},
	/**
	 * Get posts from all blogs (from API)
	 * 
	 * @param {String} [orderBy="date"] Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param {Object} params Common API parameters ('count' etc.).
	 * @param {Function} callback Callback function.
	 * @returns {Object} jqXHR.
	 */
	getPosts: function(orderBy, params, callback) {
		return this.call(['posts', this._order(orderBy)], params, callback);
	},
	/**
	 * Get posts from super-category (from API)
	 * 
	 * @param {String} name Super-category slug.
	 * @param {String} [orderBy="date"] Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param {Object} params Common API parameters ('count' etc.).
	 * @param {Function} callback Callback function.
	 * @returns {Object} jqXHR.
	 */
	getPostsByCategory: function(name, orderBy, params, callback) {
		if (name==='diy' || name==='nails') { //XXX: temporary hackish redirect to search
			this.search(name, params, callback);
			return;
		}
		return this.call(['posts', 'category', name, this._order(orderBy)], params, callback);
	},
	/**
	 * Get posts by tag (from API)
	 * 
	 * @param {String} name Tag slug.
	 * @param {String} [orderBy="date"] Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param {Object} params Common API parameters ('count' etc.).
	 * @param {Function} callback Callback function.
	 * @returns {Object} jqXHR.
	 */
	getPostsByTag: function(name, orderBy, params, callback) {
		return this.call(['posts', 'tag', name, this._order(orderBy)], params, callback);
	},
	/**
	 * Get posts by author (from API)
	 * 
	 * @param {String} name Author slug.
	 * @param {String} [orderBy="date"] Field to sort posts by (either "date", "like_count" or "comment_count").
	 * @param {Object} params Common API parameters ('count' etc.).
	 * @param {Function} callback Callback function.
	 * @returns {Object} jqXHR.
	 */
	getPostsByAuthor: function(name, orderBy, params, callback) {
		return this.call(['posts', 'author', name, this._order(orderBy)], params, callback);
	},
	/**
	 * Get posts by year, month or day (from API)
	 * 
	 * @param {String} dateStr Date specifier: 'yyyy[-mm[-dd]]'.
	 * @param {Object} params Common API parameters ('count' etc.).
	 * @param {Function} callback Callback function.
	 * @returns {Object} jqXHR.
	 */
	getPostsByDate: function(dateStr, params, callback) {
		return this.call(['posts', dateStr], params, callback);
	},
	/**
	 * Get posts from super-category by year, month or day (from API)
	 * 
	 * @param {String} category Super-category slug.
	 * @param {String} dateStr Date specifier: 'yyyy[-mm[-dd]]'.
	 * @param {Object} params Common API parameters ('count' etc.).
	 * @param {Function} callback Callback function.
	 * @returns {Object} jqXHR.
	 */
	getPostsByCategoryDate: function(category, dateStr, params, callback) {
		return this.call(['posts', 'category', category, dateStr], params, callback);
	},
	getPostsRelatedTo: function(id, params, callback) {
		return this.call(['search', 'related', id], params, callback);
	},
	search: function(s, params, callback) {
		var query = params || {};
		query.q = s;
		return this.call('/search', query, callback);
	},
	
	/**
	 * Get comments of specified post
	 * 
	 * @param {String} id Mongo ID of the post.
	 * @param {String} [orderBy="latest"] Either 'latest' ('date'), 'popular' or 'active'.
	 * @param {Object} [params] Additional query parameters.
	 * @returns {Object} jqXHR.
	 */
	getComments: function(id, orderBy, params) {
		orderBy = orderBy || 'latest';
		if (orderBy==='latest' || orderBy==='date')
			orderBy = '';
		else
			orderBy = '/'+orderBy;
		
		params = params || {};
		params.format = 'jsonp';
		
		var url = this.contentURL+'/comments/post/'+id+orderBy;
		return jQuery.ajax({
			url: url,
			data: params,
			dataType: 'jsonp'
		});
	},
	/**
	 * Submit a comment
	 * 
	 * Returned promise object will be resolved with updated comment fields
	 * or rejected with an error message.
	 * @param {AWS.models.NewComment} comment New comment model.
	 * @returns {Object} jQuery promise object.
	 */
	sendComment: function(comment) {
		var self = this, sending = new jQuery.Deferred();
		
		if (!comment.comment_content) {
			sending.rejectWith(window, ['Please type a comment.']);
			return sending.promise();
		}
		
		var data = {
			post_id: comment.post.$id,
			user_id: comment.author_id,
			comment_parent: comment.wp_comment_parent,
			comment: comment.comment_content
		};
		
		jQuery.ajax({
			type: 'POST',
			url: self.commentGateURL,
			data: data
		}).done(function(data, textStatus, jqXHR){
			var $data = jQuery(data),
			    $error = $data.find('wp_error'),
			    id = $data.find('comment').attr('id'); //TODO: MonogID should be here
			
			if ($error.length) {
				sending.rejectWith(window, [$error.text()]);
				return;
			}
			
			sending.resolveWith(window, [{_id: {$id:id}, id: id}]);
		}).fail(function(jqXHR, textStatus, errorThrown){
			var error = jqXHR.responseText || errorThrown;
			sending.rejectWith(window, [error]);
		});
		
		return sending.promise();
	},
	
	/**
	 * Universal function to interact with Users API
	 * 
	 * @param {String[]|String} path API function path. If array is passed, its elements will be joined with '/'.
	 * @param {Object} params Query parametes.
	 * @param {Function} callback Callback function.
	 * @returns {Object} jqXHR.
	 */
	callUsers: function(path, params, callback) {
		var url = '';
		if ( jQuery.isArray(path) ) {
			url = '/' + path.join('/');
		} else if ( typeof path !== 'string' ) {
			url = '/' + path.toString();
		} else {
			url = path;
		}
		url = this.usersURL + url;
		
		params = params || {};
		params.format = 'jsonp';
		
		return jQuery.ajax({
			url: url,
			data: params,
			dataType: 'jsonp',
			success: callback
		});
	},
	getAllActivity: function(params, callback) {
		return this.callUsers('/activity/site', params, callback);
	},
	
	getPostLikes: function(id, callback) {
		var self = this;
		var data = {
			action: 'check',
			_id: id
		};
		return jQuery.ajax({
			url: self.votingURL+'/posts.php',
			data: data,
			dataType: 'json',
			success: callback
		});
	},
	likePost: function(id, callback) {
		var self = this;
		var data = {
			action: 'like',
			_id: id
		};
		return jQuery.ajax({
			type: 'POST',
			url: self.votingURL+'/posts.php',
			data: data,
			dataType: 'json',
			success: callback
		});
	},
	unlikePost: function(id, callback) {
		var self = this;
		var data = {
			action: 'unlike',
			_id: id
		};
		return jQuery.ajax({
			type: 'POST',
			url: self.votingURL+'/posts.php',
			data: data,
			dataType: 'json',
			success: callback
		});
	},
	
	getCommentLikes: function(id, callback) {
		var self = this;
		var data = {
			action: 'check',
			_id: id
		};
		return jQuery.ajax({
			url: self.votingURL+'/comments.php',
			data: data,
			dataType: 'json',
			success: callback
		});
	},
	likeComment: function(id, callback) {
		var self = this;
		var data = {
			action: 'like',
			_id: id
		};
		return jQuery.ajax({
			type: 'POST',
			url: self.votingURL+'/comments.php',
			data: data,
			dataType: 'json',
			success: callback
		});
	},
	unlikeComment: function(id, callback) {
		var self = this;
		var data = {
			action: 'unlike',
			_id: id
		};
		return jQuery.ajax({
			type: 'POST',
			url: self.votingURL+'/comments.php',
			data: data,
			dataType: 'json',
			success: callback
		});
	},
	
	/**
	 * Convert WP order field to API order field
	 * 
	 * @param {String} [order="date"] WP order field.
	 * @returns {String|null} API order field. May be null, which means default (by date) order.
	 */
	_order: function(order) {
		switch (order) {
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
});

/*
 * Models
 */
(function(){

/**
 * Model
 * 
 * Constructed model will be extended with model data.
 * @constructor
 * @param {Object} data Model data.
 * @returns {Model}
 */
var Model = function(data) {
	this.subscribers = [];
	jQuery.extend(this, data);
	this.init();
};
jQuery.extend(Model.prototype, {
	/**
	 * Initialise the model
	 * 
	 * This function is called during model construction. It may be used for 
	 * setting up additional model data.
	 */
	init: function() {
		
	},
	/**
	 * Destroy the model
	 * 
	 * This function should be called when the model is going to be destroyed.
	 * By default it notifies all subscribers about destroying.
	 */
	destroy: function() {
		this.publish('Destroy');
	},
	/**
	 * Subscribe to model events
	 * 
	 * @param {Object|Function} subscriber The subscriber object or callback.
	 * @returns {Object|Function|null} Subscriber.
	 */
	subscribe: function(subscriber) {
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
	},
	/**
	 * Unsubscribe from model events
	 * 
	 * @param {Object|Function} subscriber The subscriber that was passed to subscribe().
	 */
	unsubscribe: function(subscriber) {
		for ( var i=this.subscribers.length-1; i>=0; i-- ) {
			if (this.subscribers[i].subscriber===subscriber) {
				this.subscribers.splice(i, 1);
				break;
			}
		}
	},
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
	publish: function(event, args) {
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
	}
});

/**
 * Comment model
 * @constructor
 */
var Comment = function(data) {
	this.isReply = false;
	//defaults are used for new comments
	this._id = {$id: 'new'};
	this.children_count = 0;
	this.comment_author = 'Anonymous';
	this.author_id = false;
	this.comment_content = '';
	this.comment_karma = 0;
	this.comment_parent = false;
	this.likes = 0;
	this.dislikes = 0;
	this.liked = false;
	this.id = 'new';
	this.replies = [];
	this.author_avatar = 'http://allwomenstalk.com/wp-content/themes/allwomenstalk/images/author-av.jpg';
	Comment.superclass.constructor.apply(this, [data]);
};
extend(Comment, Model);
jQuery.extend(Comment.prototype, {
	init: function() {
		Comment.superclass.init.apply(this);
		//strip stickers
		this.comment_content = this.comment_content.replace(/:\w+:/g, '');
		//replace replies with its models
		if (this.replies) {
			for (var i in this.replies) { if (!this.replies.hasOwnProperty(i)) continue;
				this.replies[i] = model('Comment', $.extend(this.replies[i], {isReply:true}));
			}
		}
	},
	/**
	 * Add existing reply model to the comment
	 * 
	 * @param {AWS.models.Comment} comment Reply model.
	 */
	addChild: function(comment) {
		this.replies.unshift(comment);
		this.publish('Update');
	},
	/**
	 * Set likes count for the comment
	 * 
	 * @param {Number} likes
	 * @param {Boolean} liked Does current user liked the comment?
	 */
	setLikes: function(likes, liked) {
		liked = liked || false;
		this.likes = likes;
		this.liked = liked;
		this.publish('LikeUpdate');
	},
	/**
	 * Like the comment
	 */
	like: function() {
		if (this.liked) return;
		
		var self = this;
		self.likes++;
		self.setLikes(self.likes, true);
		api().likeComment(self._id.$id).fail( function(){
			self.likes--;
			self.setLikes(self.likes, false);
		}).always(function(){
			e('commentLike', self._id.$id);
		});
	},
	/**
	 * Unlike the comment
	 */
	unlike: function() {
		if (!this.liked) return;
		
		var self = this;
		self.likes--;
		self.setLikes(self.likes, false);
		api().unlikeComment(self._id.$id).fail( function(){
			self.likes++;
			self.setLikes(self.likes, true);
		}).always(function(){
			e('commentUnlike', self._id.$id);
		});
	}
});
AWS.models.Comment = Comment;

/**
 * A model for submitting comments
 * @constructor
 */
var NewComment = function(data) {
	this.wp_comment_parent = false;
	NewComment.superclass.constructor.apply(this, [data]);
};
extend(NewComment, Comment);
jQuery.extend(NewComment.prototype, {
	init: function() {
		var self = this;
		
		NewComment.superclass.init.apply(self);
		$(Auth).on('after-init', function(){
			self.updateAuth();
		});
		self.updateAuth();
	},
	/**
	 * Refresh the model when user authentication changes
	 */
	updateAuth: function() {
		this.comment_author = Auth.getDataChecked('user_name') || 'Anonymous';
		this.author_id = Auth.getDataChecked('user_id') || false;
		this.author_avatar = Auth.getDataChecked('imageUrl') || 'http://allwomenstalk.com/wp-content/themes/allwomenstalk/images/author-av.jpg';
		this.publish('Update');
	},
	/**
	 * Check if user is authenticated
	 * 
	 * @returns {Boolean}
	 */
	isLoggedIn: function() {
		return Auth.namedUser();
	},
	/**
	 * Format date in API format
	 * 
	 * @param {Date} date
	 * @returns {String}
	 */
	_formatDate: function(date) {
		return date.toString();
	},
	/**
	 * Set the model to reply mode
	 * 
	 * @param {AWS.models.Comment} comment Parent comment.
	 */
	replyTo: function(comment) {
		this.isReply = true;
		this.comment_parent = comment._id;
		this.wp_comment_parent = comment.id;
		this.comment_content = '@'+comment.comment_author+', ';
		this.publish('Update');
	},
	/**
	 * Return to regular comment mode
	 */
	cancelReply: function() {
		this.isReply = false;
		this.comment_parent = false;
		this.wp_comment_parent = false;
		this.comment_content = '';
		this.publish('Update');
	},
	/**
	 * Submit the comment model
	 * @param {String} content Comment text.
	 * @returns {Object} jQuery promise object.
	 */
	send: function(content) {
		var self = this;
		self.publish('SendStart');
		self.comment_content = content;
		self.comment_date = self._formatDate(new Date());
		self.publish('Update');
		
		return api().sendComment(self).done(function(data){
			jQuery.extend(self, data);
			self.publish('Update');
			self.publish('SendDone');
		}).fail(function(error){
			self.publish('SendFail', [error]);
		}).always(function(){
			self.publish('SendEnd');
		});
	}
});
AWS.models.NewComment = NewComment;

var ActivityEvent = function(data) {
	ActivityEvent.superclass.constructor.apply(this, [data]);
};
extend(ActivityEvent, Model);
jQuery.extend(ActivityEvent.prototype, {
	init: function() {
		ActivityEvent.superclass.init.apply(this);
		//FF doesn't understand hyphen as valid separator
		//server gives time in UTC
		var eventDate = this.date.replace(/-/g, '/')+' UTC';
		this.event_date = new Date(eventDate);
	},
	updateTime: function() {
		this.publish('TimeUpdate');
	}
});

var NewPostEvent = function(data) {
	NewPostEvent.superclass.constructor.apply(this, [data]);
};
extend(NewPostEvent, ActivityEvent);
jQuery.extend(NewPostEvent.prototype, {
	
});
AWS.models.NewPostEvent = NewPostEvent;
AWS.models.UserPostEvent = NewPostEvent;

var NewCommentEvent = function(data) {
	NewCommentEvent.superclass.constructor.apply(this, [data]);
};
extend(NewCommentEvent, ActivityEvent);
jQuery.extend(NewCommentEvent.prototype, {
	init: function() {
		NewCommentEvent.superclass.init.apply(this);
		this.data.authors = [this.data.comment_author];
	},
	isTweet: function() {
		return this.data.authors.length==1 && !!this.data.author_avatar.match(/^https?:\/\/(www.)?gravatar.com\/avatar\/f29b2764e5e98298e3177ef1fb1967e5/);
	},
	combine: function(event) {
		this.data.authors = array_unique( this.data.authors.concat(event.data.authors) );
		this.publish('Combine');
	}
});
AWS.models.NewCommentEvent = NewCommentEvent;
AWS.models.ReplyEvent = NewCommentEvent;

})();

/**
 * Templating engine
 * 
 * @constructor
 * @param {Object} templates List of templates.
 * @returns {AWS.modules.Template}
 */
AWS.modules.Template = function(templates){
	this.templates = templates || {};
	this.templateCache = {};
};
jQuery.extend(AWS.modules.Template.prototype, {
	/**
	 * Render data with template
	 * 
	 * @param {string} template Template name.
	 * @param {Object|Array} data Data to be rendered. If array is given,
	 *     the function will render each element and concatenate results.
	 * @param {Object} [context] Context object that may contain helper functions that can be called from template
	 *     (using 'this' keyword).
	 * @returns {String|Boolean} Rendered template or false if tempalte is not found.
	 */
	render: function(template, data, context){
		if ( jQuery.isArray(data) )
			return this.renderEach(template, data, context);
		
		if (this.templates[template])
			return this._srender(template, this.templates[template], data, context);
		return false;
	},
	/**
	 * Render data array with template
	 * 
	 * @param {string} template Template name.
	 * @param {Array} data Data to be rendered. The function will render each element and concatenate results.
	 * @param {Object} [context] Context object that may contain helper functions that can be called from template
	 *     (using 'this' keyword).
	 * @returns {String|Boolean} Rendered template or false if tempalte is not found.
	 */
	renderEach: function(template, data, context){
		var self = this;

		if ( !this.templates[template] ) return false;
		var html = '';
		jQuery.each(data, function(i, val){
			html += self.render(template, val, context);
		});
		return html;
	},
	// Simple JavaScript Templating
	// John Resig - http://ejohn.org/ - MIT Licensed
	// adapted from: http://ejohn.org/blog/javascript-micro-templating/
	// originally $.srender by Greg Borenstein http://ideasfordozens.com in Feb 2009
	// modified for Sammy by Aaron Quint for caching templates by name
	_srender: function(name, template, data, context){
		var self = this, fn;
		context = context || self;
		data = data || {};
		
		if ( self.templateCache[name] ) {
			fn = self.templateCache[name];
		} else {
			// If options escape_html is false, dont escape the contents by default
			//if (options && options.escape_html === false) {
				escaped_string = "\",$1,\"";
			/*} else {
				escaped_string = "\",h($1),\"";
			}*/
			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			fn = self.templateCache[name] = new Function("obj",
				"var ___$$$___=[],print=function(){___$$$___.push.apply(___$$$___,arguments);};" +
	
				// Introduce the data as local variables using with(){}
				"with(obj){___$$$___.push(\"" +
		
				// Convert the template into pure JavaScript
				String(template)
				.replace(/[\r\t\n]/g, " ")
				.replace(/\"/g, '\\"')
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)/g, "$1\r")
				.replace(/\t=(.*?)%>/g, escaped_string)
				.replace(/\t!(.*?)%>/g, "\",$1,\"")
				.split("\t").join("\");")
				.split("%>").join("___$$$___.push(\"")
				.split("\r").join("")
				+ "\");}return ___$$$___.join('');");
		}
		
		//extend context with render functions to enable sub-templating
		//TODO: this is ugly
		jQuery.extend(context, self);
		
		return fn.call(context, data);
	}
});

/*
 * Views
 */
(function() {

/**
 * Abstract view class
 * 
 * @constructor
 * @param {Object} data Item which is represented by this view.
 * @param {Object} [config] Additional parameters.
 * @returns {View}
 */
var View = function(data, config) {
	this.data = data;
	this.data.classes = '';
	this.$el = false;
	this.config = jQuery.extend({}, this.config, config);
	this.init();
};
jQuery.extend(View.prototype, {
	/**
	 * Default configuration
	 * @property {String} template Template name.
	 * @property {String} [classes] Adidtional CSS classes.
	 */
	config: {
		template: '',
		classes: ''
	},
	/**
	 * Default initialisation
	 * 
	 * Almost always should be overwritten by the child class.
	 */
	init: function() {
		this.update();
	},
	/**
	 * Default update action
	 * 
	 * Appends CSS classes from the 'config' property.
	 */
	update: function() {
		this.data.classes = this.config.classes? ' '+this.config.classes : '';
	},
	/**
	 * Default destroy action
	 * 
	 * Removes element associated with the view from the DOM.
	 */
	destroy: function() {
		if (this.$el) {
			this.$el.remove();
			this.$el = false;
		}
	},
	/**
	 * Render item with template
	 * 
	 * @returns {String} Rendered item.
	 */
	renderView: function() {
		return tmpl().render(this.config.template, this.data, this);
	},
	/**
	 * Update rendered view
	 * 
	 * @returns {Boolean|jQuery} Updated view DOM element or false if the view has no associated element.
	 */
	reRender: function() {
		this.update();
		if (!this.$el)
			return false;
		
		var $new = jQuery(this.renderView());
		this.$el.replaceWith($new);
		this.$el = $new;
		this._attach(this.$el);
		return this.$el;
	},
	/**
	 * Render the view and insert result before target
	 * 
	 * Also associates rendered element with the view.
	 * @param {jQuery} $target Element before which rendered view should be inserted.
	 * @returns {jQuery} Associated rendered element.
	 */
	insertBefore: function($target) {
		this.$el = jQuery(this.renderView());
		$target.before(this.$el);
		this._attach(this.$el);
		return this.$el;
	},
	/**
	 * Render the view and insert result to the beginning of target
	 * 
	 * Also associates rendered element with the view.
	 * @param {jQuery} $target Element into which rendered view should be inserted.
	 * @returns {jQuery} Associated rendered element.
	 */
	prependTo: function($target) {
		this.$el = jQuery(this.renderView());
		$target.prepend(this.$el);
		this._attach(this.$el);
		return this.$el;
	},
	/**
	 * Render the view and insert result to the end of target
	 * 
	 * Also associates rendered element with the view.
	 * @param {jQuery} $target Element into which rendered view should be inserted.
	 * @returns {jQuery} Associated rendered element.
	 */
	appendTo: function($target) {
		this.$el = jQuery(this.renderView());
		$target.append(this.$el);
		this._attach(this.$el);
		return this.$el;
	},
	/**
	 * Callback to be used in child classes when the view is attached to the DOM
	 * 
	 * @param {jQuery} $el Just attached element.
	 */
	_attach: function($el) {
		
	},
	_utmify: function(link) {
		if (this.config.utm) {
			var query = jQuery.parsequery(link);
			if (this.config.utm.source)
				query = query.set('utm_source', this.config.utm.source);
			if (this.config.utm.medium)
				query = query.set('utm_medium', this.config.utm.medium);
			if (this.config.utm.campaign)
				query = query.set('utm_campaign', this.config.utm.campaign);
			if (this.config.utm.term)
				query = query.set('utm_term', this.config.utm.term);
			return query.toString();
		}
		return link;
	}
});

/**
 * View for author block, mini-author block and author archive meta-block
 */
var AuthorBlock = function(author, config) {
	AuthorBlock.superclass.constructor.apply(this, [author, config]);
};
extend(AuthorBlock, View);
jQuery.extend(AuthorBlock.prototype, {
	/**
	 * @property {Boolean} [full=false] Use large avatar.
	 */
	config: {
		template: 'authorBlock',
		full: false
	},
	init: function() {
		AuthorBlock.superclass.init.apply(this);
		var author = this.data;
		var avatarSize = this.config.full? 150 : 32;
		
		author.posts_link = this._utmify(AWS.router.createSiteUrl()+'/author/'+(author._id? author._id : author.id)+'/');
		if (author.avatar) {
			var avatarQuery = jQuery.parsequery(author.avatar);
			author.avatar = avatarQuery.set('s', avatarSize).toString();
		}
		return author;
	}
});
AWS.views.AuthorBlock = AuthorBlock;

/**
 * View for mini-category block
 */
var MiniCategory = function(category, config) {
	MiniCategory.superclass.constructor.apply(this, [category, config]);
};
extend(MiniCategory, View);
jQuery.extend(MiniCategory.prototype, {
	config: {
		template: 'miniCategory'
	},
	init: function() {
		MiniCategory.superclass.init.apply(this);
		var category = this.data;
		
		category.name = ucfirst(category.id);
		category.link = this._utmify(AWS.router.createSiteUrl(category.id));
		return category;
	}
});
AWS.views.MiniCategory = MiniCategory;

/**
 * Abstract view for posts
 */
var Post = function(post, config) {
	Post.superclass.constructor.apply(this, [post, config]);
};
extend(Post, View);
jQuery.extend(Post.prototype, {
	/**
	 * @param {Boolean} [showCategories=false] Show category labels.
	 * @param {Boolean} [showCatLinks=true] Show link in category label.
	 */
	config: {
		template: '',
		showCategories: false,
		showCatLinks: true
	},
	init: function() {
		Post.superclass.init.apply(this);
		var post = this.data;
		var id = (post._id? post._id : post.id);
		id = (id.$id? id.$id : id);
		post.post_id = post.blog? 'post-'+post.blog+'-'+id : 'post-'+id;
		post.time_ago = timeAgo(new Date(post.post_date));
		
		if (post.blog) { //old format
			if (post.blog==='www')
				post.blog = 'aws';
			var link = AWS.router.createSiteUrl(post.blog) + '/' + post.post_name;
			post.post_link = this._utmify(link);
		} else {
			var matches = post.host.match(/^https?:\/\/(?:([^.]+)\.)?allwomenstalk\.com/);
			if (matches && matches[1]) {
				post.blog = matches[1];
			} else {
				post.blog = 'aws';
			}
			if (post.blog==='www')
				post.blog = 'aws';
			var link = AWS.router.createSiteUrl(post.blog) + '/' + post.slug;
			post.post_link = this._utmify(link);
		}
		
		post.classes += ' type-post hentry';
		if ( post.categories ) jQuery.each(post.categories, function(i, cat){
			post.classes += ' category-'+cat.id;
		});
		if ( post.image )
			post.classes += ' has-image';
		else
			post.classes += ' no-image';
		
		post.comment_count = shortenInt(post.comment_count);
		post.likes = shortenInt(post.likes);
		
		if (post.author) {
			post.author = new AuthorBlock(post.author);
		}
		
		return post;
	},
	/**
	 * Render post category label
	 * 
	 * @returns {String} Rendered label.
	 */
	categoryLabel: function(){
		var post = this.data,
		    html = '';
		if (this.config.showCategories && post.categories && post.categories[0])
			html = '<span class="mobile-category">'+post.categories[0].id+'</span>';
		return html;
	}
});

/**
 * View for archive posts
 */
var ArchivePost = function(post, config) {
	ArchivePost.superclass.constructor.apply(this, [post, config]);
};
extend(ArchivePost, Post);
jQuery.extend(ArchivePost.prototype, {
	config: {
		template: 'archivePost',
		showCategories: false,
		showCatLinks: true
	},
	init: function() {
		ArchivePost.superclass.init.apply(this);
		this.data.classes += ' box post';
	},
	/**
	 * Render post image
	 * 
	 * @returns {String} Rendered image.
	 */
	postImage: function() {
		var post = this.data,
			img = '';

		if (post.image) {
			img = 'http://img.allw.mn/'+(post.blog==='aws'? 'www' : post.blog)+'/thumbs/'+post.image;
		}

		return img;
	}
});
AWS.views.ArchivePost = ArchivePost;

/**
 * View for mini-post blocks
 */
var MiniPost = function(post, config) {
	MiniPost.superclass.constructor.apply(this, [post, config]);
};
extend(MiniPost, Post);
jQuery.extend(MiniPost.prototype, {
	config: {
		template: 'miniPost',
		showCategories: true,
		showCatLinks: true
	},
	init: function() {
		MiniPost.superclass.init.apply(this);
		this.data.post_id = 'mini-'+this.data.post_id;
		this.data.classes += ' mini-post';
	},
	/**
	 * Render post image
	 * 
	 * @returns {String} Rendered image.
	 */
	postImage: function() {
		var post = this.data,
		    html = '';
		
		if (post.image) {
			var img = 'http://img.allw.mn/'+(post.blog==='aws'? 'www' : post.blog)+'/thumbs/100x75/'+post.image;
			html = '<a href="'+post.post_link+'" class="post-image-link link-size-small" title="'+post.post_title+'">'+
				'<img src="'+img+'" alt="'+post.post_title+'" class="post-image size-small" /></a>';
		}
		
		return html;
	}
});
AWS.views.MiniPost = MiniPost;

/*
 * Comments
 */
/**
 * Regular comment view
 * @constructor
 * @param {AWS.models.Comment} data
 * @param {Object} [config]
 * @returns {AWS.views.Comment}
 */
var Comment = function(comment, config) {
	Comment.superclass.constructor.apply(this, [comment, config]);
};
extend(Comment, View);
jQuery.extend(Comment.prototype, {
	config: {
		template: 'comment'
	},
	init: function() {
		Comment.superclass.init.apply(this);
		this.data.subscribe(this);
	},
	destroy: function() {
		this.data.unsubscribe(this);
		Comment.superclass.destroy.apply(this);
	},
	_attach: function($el) {
		if ($.trim(this.data.comment_content)==='') {
			this.destroy();
			return;
		}
		
		//enable/disable some controls for not yet posted comments
		$el.find(':input').attr('disabled', (this.data.id==='new'));
		$el.data('view', this);
		this.appendReplies();
	},
	/**
	 * Format comment content
	 * 
	 * Hides part of too long comment.
	 * @returns {String} Content markup.
	 */
	getText: function() {
		var content = this.data.comment_content;
		if (content.length<=100)
			return content;
		
		var visible = content.substr(0, 100),
		    hidden = content.substr(100);
		
		return visible +
			'<span class="ellipsis">&hellip; </span>'+
			'<a class="see-more" href="#">See more</a>'+
			'<span class="hidden-text hidden">'+hidden+'</span>';
	},
	likeText: function() {
		return 'Like' + (this.data.likes? ' ('+shortenInt(this.data.likes)+')' : '');
	},
	timeAgo: function() {
		return timeAgo(this.data.comment_date);
	},
	avatar: function() {
		var av = this.data.author_avatar;
		if ( !!av.match(/^https?:\/\/upload.allwomenstalk.com/) ) {
			var avatarQuery = jQuery.parsequery(av);
			av = avatarQuery.set('default', 1).toString(); //set this only for AWS avatar URLs
		}
		return av;
	},
	capID: function() {
		// name
		var capID = this.data.comment_author + '*';
		
		// userID(aws) || gravatarID
		capID += ( this.data.comment_author_id ) ?
			this.data.comment_author_id + '*aws' :
			this.data.author_avatar.split('/')[4].split('?')[0];
		
		// type(aws||wr) * user(wr)
		if( this.data.user_id ) capID += '*wr*'+this.data.user_id;
		
		return capID;
	},
	onLikeUpdate: function() {
		if (!this.$el) return;
		
		var $like = this.$el.find('> .comment-body [name="like-comment"]'),
		    $likeText = $like.find('.like-text');
		$likeText.html(this.likeText());
		$like.toggleClass('liked', this.data.liked);
	},
	/**
	 * Render and attach comment replies
	 * 
	 * @param {Boolean} all Render all replies or only first 5?
	 * @returns {String}
	 */
	appendReplies: function(all) {
		if (!this.$el) return;
		
		var replies = this.data.replies;
		if (replies && replies.length) {
			var $replies = this.$el.find('> .replies');
			for (var i=0; i<replies.length; i++) {
				if (i>4 && !all) break;
				
				//prepend in reverse order
				var j = (all? replies.length-1 : Math.min(4, replies.length-1)) - i;
				var reply = view('Comment', replies[j]);
				reply.prependTo($replies);
			}
		}
	},
	appendRestReplies: function() {
		var replies = this.data.replies;
		if (replies && replies.length>5) {
			var $replies = this.$el.find('> .replies');
			for (var i=5; i<replies.length; i++) {
				var reply = view('Comment', replies[i]);
				reply.appendTo($replies);
			}
		}
	},
	onUpdate: function() {
		this.reRender();
	},
	onSendFail: function() {
		this.destroy();
	},
	onDestroy: function() {
		this.destroy();
	}
});
AWS.views.Comment = Comment;

/**
 * Comment/reply form
 * @constructor
 * @param {AWS.models.NewComment} data
 * @param {Object} [config]
 * @returns {AWS.views.CommentForm}
 */
var CommentForm = function(data, config) {
	CommentForm.superclass.constructor.apply(this, [data, config]);
};
extend(CommentForm, View);
jQuery.extend(CommentForm.prototype, {
	config: {
		template: 'commentLogin'
	},
	init: function() {
		CommentForm.superclass.init.apply(this);
		this.data.subscribe(this);
	},
	update: function() {
		CommentForm.superclass.update.apply(this);
		if( this.data.isLoggedIn() ) {
			jQuery('.sidebar-area').css({ bottom: 89 });
			this.config.template = 'commentForm';
		}
		else this.config.template = 'commentLogin';
	},
	/**
	 * Reinitialise and re-render with new data
	 * @param {AWS.models.NewComment} data
	 */
	reset: function(data) {
		this.data.unsubscribe(this);
		this.data = data;
		this.data.classes = '';
		this.init();
		this.reRender();
	},
	destroy: function() {
		this.data.unsubscribe(this);
		CommentForm.superclass.destroy.apply(this);
	},
	enable: function() {
		if (!this.$el)
			return;
		this.$el.find(':input').attr('disabled', false);
	},
	disable: function() {
		if (!this.$el)
			return;
		this.$el.find(':input').attr('disabled', true);
	},
	onUpdate: function() {
		this.reRender();
	},
	onDestroy: function() {
		this.destroy();
	},
	onSendFail: function(comment, error) {
		if (this.$el) {
			this.$el.find('form').append('<span class="error">'+error+'</span>');
		}
	}
});
AWS.views.CommentForm = CommentForm;

/*
 * Event views
 */
var PostEvent = function(post, config) {
	this.event = post;
	PostEvent.superclass.constructor.apply(this, [post.data, config]);
};
extend(PostEvent, MiniPost);
jQuery.extend(PostEvent.prototype, {
	config: {
		template: 'postEvent',
		showCategories: true,
		showCatLinks: true
	},
	init: function() {
		PostEvent.superclass.init.apply(this);
		var post = this.data;
		post.time_ago = timeAgo(this.event.event_date);
		this.event.subscribe(this);
		return post;
	},
	destroy: function() {
		this.event.unsubscribe(this);
		PostEvent.superclass.destroy.apply(this);
	},
	onTimeUpdate: function() {
		this.data.time_ago = timeAgo(this.event.event_date);
		if (this.$el) {
			jQuery('.time', this.$el).html(this.data.time_ago);
		}
	},
	onDestroy: function() {
		this.destroy();
	}
});
AWS.views.PostEvent = PostEvent;

var CommentEvent = function(comment, config) {
	this.event = comment;
	CommentEvent.superclass.constructor.apply(this, [comment.data, config]);
};
extend(CommentEvent, View);
jQuery.extend(CommentEvent.prototype, {
	config: {
		template: 'miniComment',
		avatarSize: 40
	},
	init: function() {
		CommentEvent.superclass.init.apply(this);
		this.event.subscribe(this);
	},
	update: function() {
		CommentEvent.superclass.update.apply(this);
		
		var comment = this.data;
		comment.time_ago = timeAgo(this.event.event_date);
		
		var avClass = (comment.authors.length<=1 && comment.author_avatar && !this.event.isTweet())? ' has-avatar' : ' no-avatar';
		comment.classes = this.config.classes? ' '+this.config.classes+avClass : avClass;
		return comment;
	},
	destroy: function() {
		this.event.unsubscribe(this);
		CommentEvent.superclass.destroy.apply(this);
	},
	authorList: function() {
		return this.data.authors.join(', ');
	},
	commentedOn: function() {
		return this.event.isTweet()? 'tweeted about' : (this.event.type==='ReplyEvent'? 'replied on' : 'commented on');
	},
	avatar: function() {
		if (this.data.authors.length<=1 && this.data.author_avatar && !this.event.isTweet()) {
			var avatarQuery = jQuery.parsequery(this.data.author_avatar);
			if ( !!this.data.author_avatar.match(/^https?:\/\/upload.allwomenstalk.com/) ) {
				avatarQuery = avatarQuery.set('default', 0); //set this only for AWS avatar URLs
			} else if ( !!this.data.author_avatar.match(/^https?:\/\/(?:[^\/]+\.)?gravatar.com/) ) {
				avatarQuery = avatarQuery.set('d', 404);
			}
			var av = avatarQuery.set('s', this.config.avatarSize).toString();
			return '<div class="image">'+
			    '<img class="avatar photo avatar-'+this.config.avatarSize+'" width="'+this.config.avatarSize+'" height="'+this.config.avatarSize+'" '+
			    'src="'+av+'" />'+
			    '</div>';
		}
		return '';
	},
	_attach: function($el) {
		//remove broken avatars
		var $av = $el.find('img.avatar');
		imgLoaded($av, {
			error: function() {
				$av.get(0).onerror = null;
				$av.closest('.mini-comment').removeClass('has-avatar').addClass('no-avatar');
				$av.closest('.image').remove();
			}
		});
	},
	onCombine: function(event) {
		this.reRender();
	},
	onTimeUpdate: function() {
		this.data.time_ago = timeAgo(this.event.event_date);
		if (this.$el) {
			jQuery('.time', this.$el).html(this.data.time_ago);
		}
	},
	onDestroy: function() {
		this.destroy();
	}
});
AWS.views.CommentEvent = CommentEvent;

/* Comment author's profile */
var Cap = function(author, config) {
	var cid = author.split('*'); // name*id*type*user
	// default image
	var d = 'http://allwomenstalk.com/wp-content/themes/allwomenstalk/images/author-av.jpg?default=1';

	this.name = cid[0];
	this.img = 'http://www.gravatar.com/avatar/'+cid[1]+'?d='+d+'&s=300';
	this.usertype = 'General';

	if( cid[2]=='aws' ) {
		this.img = 'http://upload.allwomenstalk.com/avatar/150/'+
					cid[1].slice(0,2)+'/'+cid[1].slice(2)+'.jpg?default=1';
		this.usertype = 'AWS';
		this.userID = cid[1];
	} else if( cid[2]=='wr' ) {
		this.usertype = 'Writer';
		this.userID = cid[3];
	}
	Cap.superclass.constructor.apply(this, [author, config]);
};
extend(Cap, View);
jQuery.extend(Cap.prototype, {
	init: function() {
		Cap.superclass.init.apply(this);

		e('OpenProfile', [this.usertype, this.name]);

		return this;
	},
	/**
	* Start the application
	*/
	getPosts: function(){
		if( this.usertype == 'Writer' ) this.writer(this.userID);
		else if( this.usertype == 'AWS' ) this.aws(this.userID);
		else jQuery('#modalPopup .modal-body .cap .loading-icon').hide();
	},
	writer: function(userID) {
		jQuery.ajax({
			url: awsL10n.contentApi+'/posts/author/'+userID+'?count=20',
			data: {format: 'jsonp'},
			dataType: 'jsonp',
			success: function(data) {
				var i, content = '',
					p = data.posts;

				for (i=0;i<p.length;i++) {
					var post = view('MiniPost', p[i], {template: 'postEvent'});
					content += post.renderView();
				}

				jQuery('#modalPopup .modal-body .cap .loading-icon').hide();
				jQuery('#modalPopup .modal-body .cap .cap-data').append(content);

				if( data.next_page )
					jQuery('#modalPopup .modal-body .cap .cap-data').append(
						'<span class="cap-link">'+
							'<a href="'+AWS.router.createSiteUrl()+'/author/'+userID+'/" target="_blank">View All</a>'+
						'</span>');
			}
		});
	},
	aws: function(userID) {
		jQuery.ajax({
			url: awsL10n.usersApi+'/activity/user/id/'+userID+'?count=20',
			data: {format: 'jsonp'},
			dataType: 'jsonp',
			success: function(data) {
				var i, content = '',
				ev = data.events;

				for (i=0;i<ev.length;i++) {
					var from = new Date(ev[i].date),
						type = 'published';

					switch(ev[i].type) { // default: NewPostEvent || UserPostEvent
						case 'NewCommentEvent': type = 'commented'; break;
						case 'ReplyEvent': type = 'replied'; break;
					}

					content += '<div class="mini-comment">'+
							type+' on' + '<div class="time">'+timeAgo(from)+'</div>'+
							'<div class="post-link">'+
								'<a href="'+ev[i].data.post_url+'">'+ev[i].data.post_title+'</a>'+
							'</div>'+
							'<div class="mini-content">'+ev[i].data.comment_content+'</div>'+
						'</div>';
				}

				jQuery('#modalPopup .modal-body .cap .loading-icon').hide();
				jQuery('#modalPopup .modal-body .cap .cap-data').append(content);
			}
		});
	}
});
AWS.views.Cap = Cap;

})();

/**
 * The Router - main JS app entry point
 *
 * @constructor
 * @param {string} element Selector of element on which we will operate.
 * @param {Object} controllers List of controllers or controllers constructors.
 * @param {Object} params Additional configuration parameters:
 *     {string} base Base application path;
 *     {Array} routes Array of routes like [method, path, callback];
 *     {Array} locationProxy Use non-default Sammy location proxy. Format: [ProxyName, ConstructorParameter1, ConstructorParameter2, ...]
 * @returns {AWS.modules.Router}.
 */
AWS.modules.Router = function(element, controllers, params){
	this.el = element;
	this.controllers = controllers || {};
	this.routes = [];

	jQuery.extend(this.config, params);
	this.init();
};
jQuery.extend(AWS.modules.Router.prototype, {
	config: {
		base: '',
		routes: [],
		siteURLPattern: ''
	},
	init: function(){
		var self = this;

		self._prepareRoutes();
		self.sammy = Sammy(self.el, function(){
			//completely disable HTML5 History API for Android browser, as it has too many glitches for now
			this.disable_push_state = (window.ui.browser==='Android Webkit Browser');
			this.debug = awsL10n.debug;
			if (self.config.locationProxy) {
				var args = self.config.locationProxy.slice(0),
				    ProxyConstructor = Sammy[ args.shift() ];
				args.unshift(this);
				var proxy = create(ProxyConstructor, args);
				this.setLocationProxy(proxy);
			}
		});
		self._registerRoutes();
	},
	/**
	 * Start the application
	 */
	start: function(){
		this.sammy.run();
	},
	/**
	 * Generate callback function for route
	 *
	 * @param {Function|string} callback Callback function, or it's name, or string like 'controller.method'.
	 * @param {Object|Function|string} [context] Callback context - either object or it's constructor or controller name.
	 * @returns {Function} Generated callback function.
	 */
	_createRouteCallback: function(callback, context){
		var self = this;

		var handler;
		//try to get controller name from first argument (second parameter is ignored in this case)
		if ( typeof callback === 'string' ) {
			handler = callback.split('.');
			if ( handler.length >= 2) {
				context = handler[0];
				callback = handler[1];
			}
		}

		return function(e){
			self._routeHandler(e, callback, context);
		};
	},
	/**
	 * Convert routes from config to Sammy format and add them to routes list
	 */
	_prepareRoutes: function(){
		var self = this;

		for (var i in self.config.routes) {
			var route = self.config.routes[i],
			    verb = route[0],
			    path = (route[1].charAt(0)!=='#'? '^'+self.config.base : '') + route[1], //don't add base URL for hash-based routes
			    callback = self._createRouteCallback(route[2]);

			var sammyRoute = [verb, path, callback];
			self.routes.push(sammyRoute);
		}
	},
	/**
	 * Add route to route list
	 *
	 * @param path @see this.addRoute
	 * @param callback @see this.addRoute
	 * @param [context] @see this.addRoute
	 */
	_addRoute: function(path, callback, context){
		var self = this;
		var url = (path.charAt(0)!=='#'? self.config.base : '') + path; //don't add base URL for hash-based routes

		var sammyRoute = ['get', url, self._createRouteCallback(callback, context)];
		self.routes.push(sammyRoute);
	},
	/**
	 * Register the route
	 *
	 * The function can be called in the following ways:
	 * a)
	 * @param {string} path Route path expression.
	 * @param {Function|string} callback Function that will be called on route running,
	 *     or function name, or string like 'controller.method'.
	 * @param {Object} [context] Context in which callback will run - object or it's constructor or controller name.
	 * b)
	 * @param {Object} routes Routes: pathes in keys, callbacks in values.
	 * @param {Object} [context] Context in which callbacks will run - object or it's constructor or controller name.
	 */
	addRoute: function(){
		var self = this;

		if ( jQuery.isPlainObject(arguments[0]) ) { //if array of routes is given
			var routes = arguments[0], context = arguments[1];

			jQuery.each(routes, function(path, cb){
				self._addRoute(path, cb, context);
			});
		} else {
			var path = arguments[0], callback = arguments[1], context = arguments[2];
			self._addRoute(path, callback, context);
		}
	},
	/**
	 * Register all routes in Sammy
	 */
	_registerRoutes: function(){
		this.sammy.mapRoutes(this.routes);
	},
	/**
	 * Common route callback
	 *
	 * Calls function determined from route options with following arguments:
	 *     {Sammy.Object} params List of route parameters extracted from URL;
	 *     {Sammy.EventContext} e Sammy event context.
	 *
	 * @param {Sammy.EventContext} e Sammy event context.
	 * @param {Function|string} callback Callback function or it's name.
	 * @param {Object|Function|String} [context] Callback context - either object or it's constructor or controller name.
	 */
	_routeHandler: function(e, callback, context){
		var controller=null;
		
		//if context name is given, try to find it in controllers collection
		if ( typeof context === 'string' ) {
			var constructor = this.controllers[context];
			if ( constructor ) {
				if ( this.currentController && this.currentController.constructor === constructor ) //same controller, no need to instantiate again
					controller = this.currentController;
				else if ( jQuery.isFunction(constructor) ) //if controller is function, instantiate it as object
					controller = new constructor(this, e.params);
				else
					controller = this.controllers[context];
			}
		} else if ( jQuery.isFunction(context) ) { //if context is function, run it
			controller = context(this, e.params);
		} else {
			controller = context;
		}

		//if context is not given try to use global object
		controller = controller || window;

		var method;
		if ( typeof callback === 'string' ) {
			method = controller[callback];
		} else {
			method = callback;
		}

		if ( this.currentController !== controller ) {
			if ( this.currentController && jQuery.isFunction(this.currentController.stop) ) {
				this.currentController.stop();
			}
			if ( jQuery.isFunction(controller.start) ) {
				controller.start(e.params);
			}
		}
		
		this.currentController = controller;
		
		method.call(controller, e.params, e);
	},
	
	/**
	 * Go to another URL
	 * 
	 * @param {String} location
	 */
	go: function(location) {
		this.sammy.setLocation(location);
	},
	/**
	 * Run route explicitly with additional parameters
	 * 
	 * NOTE: this bypasses internal procedures, so use with care.
	 * @param verb
	 * @param location
	 * @param params
	 */
	runRoute: function(verb, location, params) {
		if (verb==='get')
			this.sammy.last_location = ['get', location];
		this.sammy.runRoute('get', location, params);
	},
	
	/**
	 * Create home URL of specified site of the site network
	 * 
	 * The URL is based on the siteURLPattern config parameter, which is Yii-style router
	 * pattern with the 'site' parameter.
	 * @param {String} [site]
	 * @returns {String}
	 */
	createSiteUrl: function(site) {
		var def='', pat; //default site value and site parameter pattern
		var prefix='', suffix='';
		var matches;
		if (matches = this.config.siteURLPattern.match(/<\?site:?(?:([^:>]+):)?(.*?)?>/)) {
			//'site' is optional parameter
			//parse default value and pattern
			def = matches[1]? matches[1] : '';
			pat = matches[2];
			
			if ( pat && (matches = pat.match(/(.*?)\{(.+)\}(.*)/)) ) {
				prefix = matches[1]? matches[1] : '';
				pat = matches[2]? matches[2] : '';
				suffix = matches[3]? matches[3] : '';
			}
		} else if (matches = this.config.siteURLPattern.match(/<site:?(.*?)?>/)) {
			//'site' is regular parameter
			pat = matches[1];
		}
		
		def='aws'; //see Yii's SiteUrlManager::createSiteUrlRule() why this is overridden here
		
		//create URL template with parameters references
		var template = rtrim(this.config.siteURLPattern, '*');
		template = trim(template, '/');
		template = template.replace(/<\?(\w+).*?>/g, '<$1>'); //optional parameters
		template = template.replace(/<(\w+):?.*?>/g, '<$1>'); //ordinary parameters
		
		//determine final 'site' parameter value
		var value;
		if (site)
			value = site;
		else
			value = def;
		
		if (def && value===def)
			value = '';
		
		if (value!=='') {
			if (prefix)
				value = prefix+value;
			if (suffix)
				value = value+suffix;
		}
		
		var url = template.replace(/<site>/g, value);
		return url;
	}
});

(function(){

/**
 * Generic popup controller
 * 
 * @constructor
 * @param {AWS.modules.Router} router The router instance.
 * @param {Object} params Current route parameters.
 * @returns {PopupController}
 */
var PopupController = function(router, params) {
	this.router = router;
};
AWS.ajaxControllers.Popup = PopupController;
jQuery.extend(PopupController.prototype, {
	/**
	 * Start popup
	 * 
	 * @param {Object} params Current route parameters.
	 * @returns {Object} jQuery promise object of showing animation.
	 */
	start: function(params) {
		var self = this;
		
		$$('#popup').data('slide-origin', 'right');
		var promise = self.show();
		self.setupContentBox();
		
		on('resize.popup.AWS', function(){
			self.setupContentBox();
		});
		
		on('keyup.popup.AWS', function(e){
			if(e.keyCode === 27) { //ESC
				self.close();
			}
		});
		
		$$('.overlay').on('click.popup', function(e){
			//close popup only if target is outside of #popup
			if ( $$('.overlay').has(e.target).length <= 0 ) {
				self.close();
			}
		});
		
		return promise;
	},
	/**
	 * Stop popup
	 * 
	 * @returns {Object} jQuery promise object of hiding animation.
	 */
	stop: function() {
		var promise = this.hide();
		
		off('.popup');
		$$('#popup').off('.popup');
		$$('.overlay').off('.popup');
		
		return promise;
	},
	/**
	 * Close popup
	 */
	close: function() {
		this.router.go(''); // .stop() will be called from the router
	},
	
	/**
	 * Calculate and set popup content styles
	 */
	setupContentBox: function() {
		if ( !isLayout('mobile') ) {
			var maxHeight = $$('#popup').height() - $$('#popup-header').outerHeight(true) - 
			        parseInt( $$('#popup-content').css('margin-top') ) - parseInt( $$('#popup-content').css('margin-bottom') ) - 
			        parseInt( $$('#popup-content').css('padding-top') ) - parseInt( $$('#popup-content').css('padding-bottom') );
			
			$$('#popup-content').css('max-height', maxHeight);
		} else {
			$$('#popup-content').css('max-height', 'none');
		}
	},
	/**
	 * Show popup
	 * 
	 * @returns {Object} jQuery promise object of showing animation.
	 */
	show: function() {
		$$('.overlay').removeClass('hidden');
		$$('body').addClass('popup-slide');
		
		//explicetly set initial right position because
		//WebKit incorretly treats 100% as 100px
		//https://bugs.webkit.org/show_bug.cgi?id=29084
		var popupWidth = $$('#popup').outerWidth();
		var promise = $$('#popup').css({right:-popupWidth}).slide({x:'-100%'}, 500).promise();
		
		promise.done( function(){
			if (isLayout('mobile')) {
				$$('#wrapper').hide();
			}
			$$('body').removeClass('popup-slide');
		});
		return promise;
	},
	/**
	 * Hide popup
	 * 
	 * @returns {Object} jQuery promise object of hiding animation.
	 */
	hide: function() {
		$$('body').addClass('popup-slide');
		
		var promise = $$('#popup').slide({x:'0%'}, 500).promise();
		
		if ( isLayout('mobile') ) {
			$$('#wrapper').show();
		}
		
		promise.done( function(){
			$$('.overlay').addClass('hidden');
			$$('body').removeClass('popup-slide');
			
			$$('#popup-header').empty();
			$$('#popup-content-inner').empty();
		});
		return promise;
	}
});
	
/**
 * Search popup controller
 * 
 * @constructor
 * @param {AWS.modules.Router} router The router instance.
 * @param {Object} params Current route parameters.
 * @returns {Search}
 */
var Search = function(router, params){
	this.query = false;
	this.nextPageToken = '';
	this.loading = false;
	this.finished = false;
	this.stopped = true;
	Search.superclass.constructor.apply(this, [router, params]);
};
extend(Search, PopupController);
jQuery.extend(Search.prototype, {
	/**
	 * Start search popup
	 */
	start: function() {
		var self = this;
		self.stopped = false;
		$$('#popup').addClass('search');
		$$('#popup-header').html( tmpl().render('searchHeader') );
		$$('#popup-content-inner').html( tmpl().render('searchBody') );
		$$('#popup-content').scrollTop(0);
		
		$$().refresh('#search-input');
		$$().refresh('#popup-content .loading-icon');
		
		$$('#search-input').autocomplete(AWS.config.searchComplete);
		
		$$('#popup-content').on('scroll.search.AWS', function(e){
			if (!self.loading && self.query.length)
				self.maybeLoad();
		});
		on('scroll.search.AWS', function(e){
			if (!self.loading && self.query.length)
				self.maybeLoad();
		});
		
		var promise = Search.superclass.start.apply(this);
		promise.done(function(){
			$$('#search-input').focus();
		});
		
		e('searchOpen');
	},
	/**
	 * Stop search popup
	 */
	stop: function() {
		self.stopped = true;
		off('.search');
		$$('#popup-content').off('.search');
		$$('#popup-content').scrollTop(0);
		
		$$().remove('#search-input');
		$$().remove('#popup-content .loading-icon');
		
		var promise = Search.superclass.stop.apply(this);
		promise.done( function(){
			$$('#popup').removeClass('search');
		});
		
		e('searchClose');
	},
	
	/**
	 * Perform search
	 * 
	 * @param {Object} params Current route parameters.
	 */
	search: function(params) {
		var self = this;
		$$('#search-input').val(params.query);
		$$('#search-input-header').val(params.query);
		$$('#popup-content').scrollTop(0);
		$$('#popup-content .loading-icon').hide();
		jQuery('#popup-content-inner .search-item').remove();
		self.finished = false;
		self.nextPageToken = '';
		self.query = params.query;
		setCookie('aws-last-search', self.query, {domain:'.allwomenstalk.com', path:'/'});
		if (self.query.length <= 0)
			return;
		
		e('search', [self.query]);
		
		$$('#popup-content .loading-icon').show();
		self.load();
	},
	/**
	 * Load next portion of found items
	 * 
	 * @param {Function} [callback] Callback function.
	 */
	load: function(callback) {
		var self = this, params = {};
		
		if (self.finished)
			return;
		self.loading = true;
		
		if ( self.nextPageToken )
			params.next_page = decodeURIComponent(self.nextPageToken);
		
		api().search(self.query, params, function(data){
			if ( data.next_page ) {
				self.nextPageToken = data.next_page;
			} else {
				self.finish();
			}
			
			self.renderItems(data);
			
			//do we need to load more posts to fill the screen?
			if ( !self.maybeLoad() ) {
				self.loading = false;
			}
			
			if ( jQuery.isFunction(callback) )
				callback(data);
		});
	},
	/**
	 * Load next results portion if user scrolled to bottom
	 * 
	 * @returns {Boolean} Did we tried to load results?
	 */
	maybeLoad: function() {
		var self = this;
		
		if ( !isLayout('mobile') ) {
			var $scroller = $$('#popup-content-inner');
			var $container = $$('#popup-content');
		} else {
			var $scroller = $$('#popup'); //not document because of WebKit
			var $container = jQuery(window);
		}

		var positionBottom = $scroller.height();
		var scrollPosTop = $container.scrollTop();
		var scrollPosBottom = scrollPosTop + $container.height();

		var distanceBottom = positionBottom - scrollPosBottom;

		if (distanceBottom < 200 && !self.finished) {
			self.load();
			return true;
		}

		return false;
	},
	/**
	 * Finish the controller
	 * 
	 * This function is called when there are no more found items
	 */
	finish: function() {
		this.finished = true;
		$$('#popup-content .loading-icon').hide();
	},
	/**
	 * Render fetched items
	 * 
	 * @param {Object} data Found items.
	 */
	renderItems: function(data) {
		var self = this;
		
		var utm = {
			source: 'aws',
			medium: 'Website',
			campaign: 'Search',
			term: self.query
		};
		if (data.categories) {
			jQuery.each(data.categories, function(i, category){
				category = view('MiniCategory', category, {classes:'search-item', utm: utm});
				$$('#popup-content .loading-icon').before( category.renderView() );
			});
		}
		
		if (data.authors) {
			jQuery.each(data.authors, function(i, author){
				author = view('AuthorBlock', author, {template:'miniAuthor', classes:'search-item', utm: utm});
				$$('#popup-content .loading-icon').before( author.renderView() );
			});
		}
		
		if (data.posts) {
			jQuery.each(data.posts, function(i, post){
				post = view('MiniPost', post, {classes:'search-item', utm: utm});
				$$('#popup-content .loading-icon').before( post.renderView() );
			});
		}
	}
});
AWS.ajaxControllers.Search = Search;

/**
 * Activity popup controller
 * 
 * @constructor
 * @param {AWS.modules.Router} router The router instance.
 * @param {Object} params Current route parameters.
 * @returns {Activity}
 */
var Activity = function(router, params){
	this.events = [];
	this.nextPageToken = '';
	this.intervalID = false;
	this.loading = false;
	this.finished = false;
	this.stopped = true;
	Activity.superclass.constructor.apply(this, [router, params]);
};
extend(Activity, PopupController);
jQuery.extend(Activity.prototype, {
	/**
	 * Start activity popup
	 */
	start: function() {
		var self = this;
		self.stopped = false;
		self.events = [];
		$$('#popup').addClass('activity');
		$$('#popup-header').html( tmpl().render('activityHeader') );
		$$('#popup-content-inner').html( tmpl().render('activityBody') );
		$$('#popup-content').scrollTop(0);
		
		$$().refresh('#popup-content .loading-icon');
		
		on('newEvents.activity', function(e, events){
			self.renderItems(events, true);
		});
		$$('#popup-content').on('scroll.activity.AWS', function(e){
			if (!self.loading)
				self.maybeLoad();
		});
		on('scroll.activity.AWS', function(e){
			if (!self.loading)
				self.maybeLoad();
		});
		
		self.intervalID = setInterval( function(){ self.updateTime(); }, 60000);
		
		Activity.superclass.start.apply(this);
		
		e('activityOpen');
	},
	/**
	 * Stop activity popup
	 */
	stop: function() {
		this.stopped = true;
		
		off('.activity');
		$$('#popup-content').off('.activity');
		$$('#popup-content').scrollTop(0);
		$$().remove('#popup-content .loading-icon');
		
		if ( this.intervalID !== false ) {
			clearInterval(this.intervalID);
			this.intervalID = false;
		}
		
		var promise = Activity.superclass.stop.apply(this);
		promise.done( function(){
			//TODO: this is not actually destroying for now, just deleting the view through the model
			//we should delete only own views themself
			for (var i in this.events) { if (!this.events.hasOwnProperty(i)) continue;
				this.events[i].destroy();
			}
			this.events = [];
			
			$$('#popup').removeClass('activity');
		});
		
		e('activityClose');
	},
	
	/**
	 * Show activity log
	 * 
	 * @param {Object} params Current route parameters.
	 */
	log: function(params) {
		var self = this;
		$$('#popup-content').scrollTop(0);
		$$('#popup-content .loading-icon').show();
		jQuery('#popup-content-inner .activity-item').remove();
		self.finished = false;
		self.events = [];
		self.nextPageToken = '';
		
		self.showEvents();
	},
	/**
	 * Finish the controller
	 * 
	 * This function is called when there are no more events
	 */
	finish: function() {
		this.finished = true;
		$$('#popup-content .loading-icon').hide();
	},
	/**
	 * Fetch and show activity events
	 */
	showEvents: function() {
		var self = this, params = {};
		
		if (self.finished)
			return;
		self.loading = true;
		
		var callback = function(data) {
			if (self.stopped)
				return;
			
			if ( data.next_page ) {
				self.nextPageToken = data.next_page;
			} else {
				self.finish();
			}
			
			self.renderItems(data.events);
			
			//do we need to load more posts to fill the screen?
			if ( !self.maybeLoad() ) {
				self.loading = false;
			}
		};
		
		if ( !self.nextPageToken ) {
			activity().getLatest(callback);
		} else {
			activity().getMore(self.nextPageToken, callback);
		}
	},
	/**
	 * Load next events portion if user scrolled to bottom
	 * 
	 * @returns {Boolean} Did we tried to load events?
	 */
	maybeLoad: function() {
		var self = this;
		
		if ( !isLayout('mobile') ) {
			var $scroller = $$('#popup-content-inner');
			var $container = $$('#popup-content');
		} else {
			var $scroller = $$('#popup'); //not document because of WebKit
			var $container = jQuery(window);
		}

		var positionBottom = $scroller.height();
		var scrollPosTop = $container.scrollTop();
		var scrollPosBottom = scrollPosTop + $container.height();

		var distanceBottom = positionBottom - scrollPosBottom;

		if (distanceBottom < 200 && !self.finished) {
			self.showEvents();
			return true;
		}

		return false;
	},
	/**
	 * Render fetched events
	 * 
	 * @param {Object} data Events.
	 * @param {Boolean} [prepend=false] If true, rendered events be prepended, othervise appended.
	 */
	renderItems: function(events, prepend) {
		var self = this, eventView;
		prepend = prepend || false;
		
		//assume that all events always have been seen
		activity().updateCounter(0);
		
		if (events) {
			var newIDs = [];
			for (var i in events) {
				if (!events.hasOwnProperty(i)) continue;
				newIDs.push(events[i]._id.$id);
			}
			
			//add incoming events to the event list
			if (!prepend) {
				self.events = self.events.concat(events);
			} else {
				self.events = events.concat(self.events);
			}
			activity().combine(self.events);
			
			//prepend should be done in reverse order, only new events will be rendered
			var toRender = self.events.slice(0);
			if (prepend) {
				toRender.reverse();
			}
			
			//render new events
			jQuery.each(toRender, function(i, event){
				//skip old events
				if ( jQuery.inArray(event._id.$id, newIDs)<=-1 ) return true;
				
				switch(event.type) {
				case 'NewPostEvent':
					eventView = view('PostEvent', event, {classes:'activity-item'});
					break;
				case 'NewCommentEvent':
				case 'ReplyEvent':
					eventView = view('CommentEvent', event, {classes:'activity-item'});
					break;
				}
				
				if (eventView) {
					if (!prepend) {
						eventView.insertBefore($$('#popup-content .loading-icon'));
					} else {
						eventView.prependTo($$('#popup-content-inner'));
					}
				}
			});
		}
	},
	/**
	 * Callback for updating time of rendered events
	 */
	updateTime: function() {
		var self = this;
		jQuery.each(self.events, function(i, event){
			event.updateTime();
		});
	}
});
AWS.ajaxControllers.Activity = Activity;

/**
 * The "About" popup controller
 * 
 * @constructor
 * @param {AWS.modules.Router} router The router instance.
 * @param {Object} params Current route parameters.
 * @returns {About}
 */
var About = function(router, params) {
	About.superclass.constructor.apply(this, [router, params]);
};
extend(About, PopupController);
jQuery.extend(About.prototype, {
	start: function() {
		var $content = jQuery('#tmpl-copyright').clone();
		$content.attr('id', 'copyright');
		$$('#popup-content-inner').append($content);
		About.superclass.start.apply(this);
	},
	about: function() {
		//all done in start()
	}
});
AWS.ajaxControllers.About = About;

})();

AWS.ajaxControllers.Popup404 = function(router, params) {
	
};
jQuery.extend(AWS.ajaxControllers.Popup404.prototype, {
	notFound: function() {
		//nothing to do, because .stop() should already be called from previous controller
	}
});

/**
 * Activity logger
 * 
 * @constructor
 * @param {Object} config Config parameters.
 * @returns {AWS.modules.Activity}
 */
AWS.modules.Activity = function(config) {
	this.events = [];
	this.counter = 0;
	this.intervalID = false;
	this.promise = false;
	this.nextPageToken = false;
	this.firstUpdate = true;
	this.config = jQuery.extend({}, this.config, config);
};
jQuery.extend(AWS.modules.Activity.prototype, {
	config: {
		interval: 300000, //5 min
		count: 10
	},
	/**
	 * Start logger
	 */
	start: function() {
		var self = this;
		
		if ( self.intervalID !== false )
			return;
		
		setTimeout( function(){ self.update(); }, 10000); //first update after 10 sec
		self.intervalID = setInterval( function(){ self.update(); }, this.config.interval);
		
		setTimeout( function(){
			var counter = 0,
			    unread = parseInt(getCookie('aws-unread-events') || 0);
			
			var updater = function(){
				if (counter>=unread) return;
				
				counter++;
				self.updateCounter( counter );
				//exponential slowdown
				var timeout = 80.6*Math.pow(1.24, counter); //100ms for 1st event, 700ms for 10th event
				if (counter>=10) timeout = 700;
				setTimeout( function(){
					updater();
				}, timeout);
			};
			updater();
		}, 3000);
		on('newEvents.activityManager', function(e, events) {
			self.updateCounter(self.counter+events.length);
		});
	},
	/**
	 * Stop logger
	 */
	stop: function() {
		if ( this.intervalID !== false ) {
			clearInterval(this.intervalID);
			this.intervalID = false;
		}
		
		this.promise = false;
		off('.activityManager');
	},
	/**
	 * Fetch and store new activity events
	 * 
	 * @returns {Object} jQuery promise object of events loading.
	 */
	update: function() {
		var self = this,
		    first = self.firstUpdate;
		
		self.firstUpdate = false;
		self.promise = self.load( function(data){
			self.combine(data.events);
			
			if (!first) {
				var newEvents = self.findNew(self.events, data.events);
				if (newEvents.length) {
					e('newEvents', [newEvents]);
				}
			}
			
			self.events = data.events;
			
			if ( data.next_page ) {
				self.nextPageToken = data.next_page;
			}
		});
		return self.promise;
	},
	/**
	 * Load events
	 * 
	 * @param {Function} [callback] Callback function.
	 * @param {Object} [params] Api parameters.
	 * @returns {Object} jQuery promise object of events loading.
	 */
	load: function(callback, params) {
		var self = this, params = params || {};
		
		params.count = params.count || self.config.count;
		
		return api().getAllActivity(params, function(data){
			//substitute raw event objects with models
			var events = [];
			jQuery.each(data.events, function(i, event){
				if ( (event.type==='NewCommentEvent' || event.type==='ReplyEvent') && !event.data.post )
					return true;
				events.push( model(event.type, event) );
			});
			data.events = events;
			
			if ( jQuery.isFunction(callback) )
				callback(data);
		});
	},
	/**
	 * Get latest events (stored or loaded from API)
	 * 
	 * @param {Function} callback Callback function.
	 */
	getLatest: function(callback) {
		var self = this;
		
		if ( !self.promise ) { //not loaded
			self.update(self.firstUpdate);
		}
		//wait for completion of the current request
		self.promise.done( function() {
			callback( {
				events: self.events,
				next_page: self.nextPageToken
			} );
		});
	},
	/**
	 * Get next events portion
	 * 
	 * @param {String} pageToken Pagination token.
	 * @param {Integer} [count] Event count to be returned.
	 * @param {Function} [callback] Callback function.
	 */
	getMore: function(pageToken, count, callback) {
		var self = this;
		
		if ( jQuery.isFunction(count) ) {
			callback = count;
			count = false;
		}
		count = count || self.config.count;
		
		var params = {
			next_page: decodeURIComponent(pageToken),
			count: count
		};
		
		self.load( function(data){
			if ( jQuery.isFunction(callback) )
				callback(data);
		},
		params);
	},
	/**
	 * Update unread event counter
	 * 
	 * @param {Integer} count New unread event count.
	 */
	updateCounter: function(count) {
		this.counter = count;
		var display = count<=9? count : '9+';
		$$('#activity-bt .bubble').html(display);
		$$('#activity-bt .bubble').toggle(!!count);
		setCookie('aws-unread-events', count, {domain:'.allwomenstalk.com', path:'/'});
	},
	
	/**
	 * Combine events
	 * 
	 * Combines consecutive comment events of same post.
	 * @param {Array} events Array of event models.
	 * @returns {Array} Combined events array.
	 */
	//NOTE: this functions replaces given array in order to avoid situation when there are a combined event and
	//its components in the same event list. This could be happen when one client combines own event list,
	//and another one does not combine own list.
	//So clients should take care of full events cloning itself.
	combine: function(events) {
		var combined = [];
		
		for (var i=0; i<events.length; i++) {
			var event = events[i],
			    prevI = combined.length-1;
			
			//combine current event with previous if both are comment events
			//and their posts are the same
			if (prevI>=0 && (event.type==='NewCommentEvent' || event.type==='ReplyEvent') &&
			    event.data.post) {
				var prevEvent = combined[prevI];
				if ((prevEvent.type==='NewCommentEvent' || prevEvent.type==='ReplyEvent') &&
				    prevEvent.data.post && 
				    prevEvent.data.post.$id===event.data.post.$id) {
					prevEvent.combine(event);
					event.destroy();
					continue;
				}
			}
			
			combined.push(event);
		}
		
		//replace events array in-place
		//simple 'events=combined' will not work - this is just reassigning 'events' reference to another array,
		//original array will be left untouched with this approach
		var spliceArgs = [0, events.length];
		spliceArgs = spliceArgs.concat(combined);
		Array.prototype.splice.apply(events, spliceArgs);
		return events;
	},
	/**
	 * Find new events
	 * 
	 * Returns events that exists in newArray but not exists in oldArray.
	 * @param {Array} oldArray Old event models array.
	 * @param {Array} newArray New event models array.
	 * @returns {Array} New events.
	 */
	findNew: function(oldArray, newArray) {
		var oldIDs = [];
		for (var i in oldArray) {
			if (!oldArray.hasOwnProperty(i)) continue;
			oldIDs.push(oldArray[i]._id.$id);
		}
		
		var newEls = [];
		for (var i in newArray) {
			if (!newArray.hasOwnProperty(i)) continue;
			if ( jQuery.inArray(newArray[i]._id.$id, oldIDs)<=-1 ) {
				newEls.push(newArray[i]);
			}
		}
		
		return newEls;
	}
});

/**
 * AJAX post pagination
 */
AWS.modules.PostPaging = (function(){

var Page = function(params, context){
	params = params || {};
	
	//TODO: maybe it is better to always wrap page content through JS or use templates
	this.content = '<div class="post-page">'+this.LOADING_HTML+'</div>';
	this.isAttached = false;
	this.paging = context;
	this.animDuration = (typeof params.animDuration === 'undefined')? this.ANIM_DURATION : params.animDuration;
	
	jQuery.extend(this, params);
};
jQuery.extend(Page.prototype, {
	LOADING_HTML: '<div class="post-box loading"><div class="spinner">1</div></div>',
	ANIM_DURATION: 500,
	show: function(){
		if (this.$page)
			this.$page.show();
		return this;
	},
	fadeIn: function() {
		if (this.$page)
			return this.$page.fadeIn(this.animDuration);
	},
	hide: function(){
		if (this.$page)
			this.$page.hide();
		return this;
	},
	fadeOut: function() {
		if (this.$page)
			return this.$page.fadeOut(this.animDuration);
	},
	attachFirst: function(hidden){
		hidden = hidden || false;
		
		if (!this.isAttached)
			this.$page = $(this.content);
		if (hidden)
			this.hide();
		
		this.$page.prependTo($$('$content'));
		this.isAttached = true;
		return this;
	},
	attachAfter: function($el, hidden){
		hidden = hidden || false;
		
		if (!this.isAttached)
			this.$page = $(this.content);
		if (hidden)
			this.hide();
		
		this.$page.insertAfter($el);
		this.isAttached = true;
		return this;
	},
	destroy: function(){
		if (this.$page)
			this.$page.remove();
		this.isAttached = false;
	}
});

var PostPage = function(num, params, context) {
	params = params || {};
	
	PostPage.superclass.constructor.apply(this, [params, context]);
	this.num = num;
	this.title = '';
	this.content = '<div id="page-'+num+'" class="post-page">'+this.LOADING_HTML+'</div>';
	this.status = 'not loaded'; //['not loaded', 'loading', 'loaded', 'failed', 'rendered']
	
	this.isFirst = (this.num <= 1);
	this.isLast = (this.num >= this.paging.numPages);
	this.init(params);
};
extend(PostPage, Page);

jQuery.extend(PostPage.prototype, {
	init: function(params){
		params = params || {};
		jQuery.extend(this, params);
		
		var frame = '<iframe width="426" height="240" src="http://www.youtube.com/embed/$1?fs=1&amp;feature=oembed" frameborder="0" allowfullscreen="" id="iframe-$1"></iframe>';
		this.content = this.content
		        .replace(/https?\:\/\/www\.youtube\.com\/watch\?v\=(.+)/gm, frame)
		        .replace(/https?\:\/\/youtu\.be\/(.+)/gm, frame);
		this.content = autop(this.content);
		
		this.title = strip_tags(this.title);
		
		if (this.isAttached) {
			this.$page = jQuery('#page-'+this.num);
		}
		
		this.deferred = new jQuery.Deferred();
		if ( jQuery.inArray(this.status, ['loading', 'loaded', 'rendered']) > -1 )
			this.deferred.resolve();
		if ( this.status === 'failed' )
			this.deferred.reject();
	},
	load: function(){
		var self = this;
		
		if ( jQuery.inArray(self.status, ['loading', 'loaded', 'rendered']) > -1 )
			return self.deferred.promise();
	},
	
	show: function(){
		if ( !this.isAttached ) {
			//append new page content
			this.paging.attachPage(this.num);
		}
		PostPage.superclass.show.apply(this, arguments);
		this.status = 'rendered';
		e('postPageShowed', [this.num]);
		
		return this;
	},
	fadeIn: function() {
		if ( !this.isAttached ) {
			//append new page content
			this.paging.attachPage(this.num, true);
		}
		this.status = 'rendered';
		
		e('postPageShowed', [this.num]);
		
		return PostPage.superclass.fadeIn.apply(this, arguments);
	},
	url: function() {
		if (this.num <= 1) return awsL10n.baseURL;

		var query = jQuery.parsequery(awsL10n.baseURL), u='';
		if ( !query.get('p') ) { //using pretty links

			//find start position of a query url part
			var queryStart = awsL10n.baseURL.indexOf('?');
			queryStart = (queryStart<0)? awsL10n.baseURL.length : queryStart;

			var pageFrag = this.num+'/';
			if ( awsL10n.baseURL[queryStart-1] != '/' )
				pageFrag = '/'+pageFrag;
			u = [awsL10n.baseURL.slice(0, queryStart), pageFrag, awsL10n.baseURL.slice(queryStart)].join('');
		} else { //TODO: handle previews separately
			u = query.set('page', this.num).toString();
		}
		return u;
	}
});

var PostPaging = function(page) {
    var self = this;
    api().getDataByParams(['posts',awsL10n.blog,awsL10n.postName], {page: page}, function(data) {
        var pages = {},
            match,title,nextTitle,post,content,
            regexp = /<h(?:4|2)[^>]*>(.+)<\/h(?:4|2)>/,
            numPages = data.post_content.length,
            currentPage = page + 1,
            pages = {};

        for(var i in data.post_content) {
            //if(i < page) continue;
            post = data.post_content[i];
            match = post.match(regexp);
            if(i>=1 && match!=null) {
                title = match[1];
            } else {
                title = awsL10n.postTitle;
            }
            if(i == page + 1) {
                nextTitle = htmlspecialchars_decode(title, 'ENT_QUOTES');
            }
            if (i>=1)
            	post = post.replace(regexp, '<h1 class="h2">$1</h1>');
            content = {};
            content.title = htmlspecialchars_decode(title, 'ENT_QUOTES');
            //content.status = page == i?'rendered':'loaded';
            content.status = 'loaded';

            content.isAttached = page == i?true:false;
            //content.isAttached = true;
            content.isFirst = i == 0?true:false;
            content.isLast = (i== numPages-1)?true:false;
            //if(page != i) {
                content.content = '<div id="page-' + (parseInt(i) + 1) + '" class="post-page"><div class="post-box">' + post + '</div></div>';
            //}
            pages[parseInt(i)+1] = content;
        }
        self.numPages = parseInt(numPages);
        self.currentPage = parseInt(currentPage);
        self.navDisabled = false;
        self.nextCatURL = data.nextCatURL || '';
        self.pages = {};
        self.init(pages, nextTitle);
    });
};
jQuery.extend(PostPaging.prototype, {
	init: function(pages, nextTitle){
		var self = this;
		pages = pages || {};

		//instantiate pre-given pages
		for(n in pages) if (pages.hasOwnProperty(n)) {
			self.p(n, pages[n]);
		}
		
		self.addNavigation();
		self.setupPage(self.currentPage);
		on('footer.DOMProgress.AWS', function(){
			self.setupNextCat(self.currentPage);
		});
		
		/*if (self.currentPage+2<=self.numPages) {
			self.p(self.currentPage+2).title = nextTitle;
		}*/
		
		self.updateHistory(self.currentPage, true); //replace history to be able to return to the initial page

		$$('$nextPage').click(function(){
			e('postBottomNext', ['Next Page', $(this).attr('href')]);
			
			if ( self.navDisabled ) return false;
			self.queueShow(self.currentPage+1);
			return false;
		});
		$(document).keydown(function(e){
			if ( self.navDisabled ) return;
			
			var el = e.target;
			if (el.tagName=='INPUT' || el.tagName=='SELECT' || el.tagName == 'TEXTAREA' || (el.contentEditable && el.contentEditable == 'true'))
				return;
			
			var page;
			switch (e.which) {
			case 37: //left
				page = self.currentPage-1;
				break;
			
			case 39: //right
				page = self.currentPage+1;
				break;
				
			default:
				return;
				break;
			}
			
			self.queueShow(page);
			return false;
		});
		on('popstate', function(e){
			self.showFromHistory(e.originalEvent.state);
		});
		
		on('postPageLoaded', function(e, n, nextTitle){
			if (!self.p(n).isLast) {
				self.p(n+1).title = nextTitle;
			}
		});
	},
	p: function(n, params){
		n = parseInt(n);
		if ( this.pages[n] )
			return this.pages[n];
		
		this.pages[n] = new PostPage(n, params, this);
		return this.pages[n];
	},
	queueShow: function(pageNum, replaceHistory){
		var self = this;
		
		if ( pageNum<1 || pageNum>this.numPages ) return;
		
		//history should be updated right after another page is requested,
		//because user may navigate away (to another history entry, for example)
		//while new page is being loading & animating
		self.updateHistory(pageNum, replaceHistory);
		
		$$('$content').queue('fx', function(next){
			//popstate event may fire when returning from non-post page with reloading
			//in this case requested page is already shown, no need for animation or other actions
			if (pageNum===self.currentPage) {
				next();
				return;
			}
			self.showPage(pageNum, next);
		});
	},
	showFromHistory: function(state){
		if (!state) return;
		this.queueShow(state.page, true);
	},
	showPage: function(n, callback){
		var self = this, currPage = self.currentPage;
		if ( n<1 || n>self.numPages ) return;
		
		e('postPageSwitch', [currPage, n]);
		
		var $entryTitle = $$('#single .entry-title'),
		    $topImage = $$('$postImage');

		var preHeightBefore = $entryTitle.outerHeight(true) +
		    ( $topImage.is(':visible')? $topImage.outerHeight(true) : 0 );
		
		self.disableNavigation();
		self.setupPage(n);
		
		var preHeightAfter = $entryTitle.outerHeight(true) +
		    ( $topImage.is(':visible')? $topImage.outerHeight(true) : 0 );
		
		//to prevent page elements jumping
		var contentStyle = {};
		contentStyle.height = $$('$content').height() + 'px';
		var contentPaddingTop = preHeightBefore - preHeightAfter; //assuming that $content have no top padding initially
		if (contentPaddingTop>0)
			contentStyle.paddingTop = contentPaddingTop + 'px';
		$$('$content').css(contentStyle);
		
		var scrollTarget = $$('#single');
		var scrollTo = scrollTarget.offset().top - 75; // - fixed header height - some margin
		
		var next = self.p(n), current = self.p(currPage), loading = new Page({}, self);
		
		var nextLoading = next.load(); //starts loading next page if it is not yet loaded/loading
		
		//step 1: fade out current page
		var queue = current.fadeOut().promise();
		if (n==4) self.showAdvPopup();
		//step 2: attach loading page and scroll to top
		queue = queue.pipe( function(){
			loading.attachAfter(current.$page).show();
			return jQuery('html, body').animate({scrollTop: scrollTo}, 500).promise();
		});
		//step 3: fade in new page
		jQuery.when(queue, nextLoading).done( function(){
			loading.destroy();
			next.fadeIn().promise().done( function(){
				self.endShow(n);
				e('postPageSwitched', [n, next.url()]);
				if (jQuery.isFunction(callback))
					callback();
			});
			$$('$content').css({
				height: 'auto',
				paddingTop: 0
			});
		});
	},
	showAdvPopup: function(){
		var cookie = getCookie("adSenseInterstitial");
		if (cookie != "adSenseInterstitialValue") {
			asyncLoad(awsL10n.homeURL+"/js/adv-google-popup.js");
		}
	},
	endShow: function(pageNum){
		this.currentPage = pageNum;
		this.enableNavigation();

		//start loading next page
		var nextPage = this.currentPage+1;
		if ( nextPage<1 || nextPage>this.numPages ) return;
		this.p(nextPage).load();
	},
	attachPage: function(num, hidden){
		hidden = hidden || false;
		var newPage = this.p(num);

		//find last attached page after that we can insert given
		var last = 0;
		for (i in this.pages) {
			if ( !this.pages[i].isAttached) continue;
			if (num>i) {
				last = i;
			}
		}

		if (last) {
			newPage.attachAfter(this.p(last).$page, hidden);
		} else {
			//insert at first position
			newPage.attachFirst(hidden);
		}
	},
	setupPage: function(pageNum){
		var self = this, page = self.p(pageNum);
		
		if (page.isFirst) {
			$('#single strong.entry-title').remove();
			if ( $$('$postImage').length<=0 && awsL10n.postImage ) { //if there are no post image in DOM yet
				$$('$content').before('<div class="post-image-wrap wrap-size-full">'+
				                           '<h1 class="entry-title">'+
				                               '<a href="'+awsL10n.baseURL+'" title="'+awsL10n.postTitle+'">'+awsL10n.postTitle+'</a>'+
				                           '</h1>'+
				                           '<img class="post-image size-full" src="'+awsL10n.postImage+'" />'+
				                       '</div>');
			}
		} else {
			$$('$postImage').remove();
			if ($('#single strong.entry-title').length<=0) { //if there are no title in DOM yet
				$$('$content').before(
					'<strong class="entry-title">'+
					    '<a href="'+awsL10n.baseURL+'" title="'+awsL10n.postTitle+'">'+awsL10n.postTitle+'</a>'+
					'</strong>'
				);
			}
		}
		$$().remove('$postImage');
		
		$$('$nextPage').toggle(!page.isLast);
		self.setupNextCat(pageNum);
		
		//this function may be called when new page is not yet loaded
		jQuery.when(page.deferred).done( function(){
			if (page.title)
				document.title = page.title;
			
			//next page title should already be available when current page is loaded
			if (!page.isLast) {
				var nextPage = self.p(pageNum+1);
				$$('$nextPage').attr({title: nextPage.title, href:nextPage.url()});
				if (nextPage.title) {
					$$('$nextPage').html(nextPage.title);
				}
			}
		});
	},
	updateHistory: function(pageNum, replace) {
		var self = this, page = self.p(pageNum);
		var func = (replace)? 'replaceState' : 'pushState';
		
		if (window.history && history[func]) {
			history[func]({page: page.num}, page.title, page.url());
		}
	},
	addNavigation: function() {
		//link and anchor will be filled later
		jQuery('.paging-bottom').append('<a href="#" rel="next" class="next bt-btn" style="display:none;"></a>');
		$$().refresh('$nextPage');
		
		jQuery('.paging-bottom').append('<a href="#" rel="next" class="next-cat bt-btn" style="display:none;"></a>');
		$$().refresh('$nextCat');
	},
	enableNavigation: function(){
		$$('$nextPage').removeClass('disabled');
		this.navDisabled = false;
	},
	disableNavigation: function(){
		$$('$nextPage').addClass('disabled');
		this.navDisabled = true;
	},
	setupNextCat: function(pageNum) {
		var page = this.p(pageNum);
		
		if (page.isLast) {
			//pick one of the related posts
			var $relLinks = jQuery('#related .slide a');
			if ($relLinks.length) {
				var i = Math.floor( Math.random()*$relLinks.length ),
				    $relLink = $relLinks.eq(i);
				$$('$nextCat')
					.html($relLink.find('span').html())
					.attr('title', $relLink.find('span').html())
					.attr('href', $relLink.attr('href'))
					.click(function(){ e('postBottomNext', ['Next Post', $(this).attr('href')]); })
					.show();
			}
		} else {
			$$('$nextCat').hide();
		}
	}
});

return PostPaging;
})();


/*
 * Misc. stuff
 */
jQuery(document).ready( function(){
	var $body = jQuery('body');

	/* Related */
	if (awsL10n.isSingle) {
		jQuery('#related').iosSlider({
			snapToChildren: true,
			desktopClickDrag: true,
			autoSlide: true,
			infiniteSlider: true
		});

		var ref = document.referrer.indexOf('pinterest.com') != -1;
		var campaign = '?utm_source=aws&utm_medium=Website&utm_campaign=related_';
		var related = [];
		$.each( jQuery('#related .slide'), function(i, slide) {
			var a = $(slide).find('a'),
				img = $(slide).find('a img'),
				track = 'api';
			if (ref) related.push({
					url: a.attr('href'),
					title: $(slide).find('a span').text(),
					image_url: img.data('src'),
					track: track
				});
			else {
				img.attr('src', img.data('src'));
				img.removeAttr('data-src');
				a.attr('href', a.attr('href')+campaign+track);
			}
		});

		if (ref) {
			jQuery.ajax({
				url: 'http://gem.allw.mn/stats/pinterest.php',
				data: {format: 'jsonp'},
				dataType: 'jsonp',
				success: function(data) {
					var pinterest = [];
					$.each(data.data, function(i, post) {
						var unique = true;
						$.each(related, function(i, slide) {
							if (slide.url == post.url) {
								unique = false;
								slide.track += '+pinterest';
							}
						});
						if (unique) {
							post.track = 'pinterest';
							var a = document.createElement('a');
								a.href = post.url;
							var blog = a.hostname == 'allwomenstalk.com' ? 'www' : a.hostname.split('.')[0];
							post.image_url = 'http://img.allw.mn/'+blog+'/thumbs/'+post.image_url;

							pinterest.push(post);
						}
					});

					var i, result = [];
					for (i=0; i<6; i++) {
						if (related[i]) result.push(related[i]);
						if (pinterest[i]) result.push(pinterest[i]);
					}

					var content = '';
					$.each( result.slice(0,6), function(i, post) {
						content += '<div class="slide">'+
										'<a href="'+post.url+campaign+post.track+'" data-track="'+post.track+'">'+
											'<img alt="'+post.title+'" src="'+post.image_url+'">'+
											'<div><span>'+post.title+'</span></div>'+
										'</a>'+
									'</div>';
					});
					jQuery('#related .slider').html(content);
					jQuery('#related').iosSlider('update');
				}
			});
		}
	}

	/* Comment author's profile */
	if (awsL10n.isSingle) {
		jQuery('#sidebar').on('click', '[data-target="#modalPopup"]', function(){
			var id = this.getAttribute('data-id');
			if (id) {
				var cap = view('Cap', id, {template: 'commentAuthorProfile'});
				jQuery('#modalPopup .modal-body').html( cap.renderView() );
				if (jQuery.browser.msie) {
					jQuery('#modalPopup.fade').addClass('in').show();
					$body.on('click', '#modalPopup .close, .modal-backdrop.fade', function(){
						jQuery('.modal-backdrop.fade').remove();
					});
				}
			}
		});
	}

	/* Popular comments */
	if (awsL10n.isSingle && isLayout('mobile')) {
		api().getComments(awsL10n.postID, 'popular', {count: 3}).done(function(data){
			var html = '';
			$.each(data.comments, function(i, comment){
				comment.comment_content = comment.comment_content.replace(/:\w+:/g, '');
				if ($.trim(comment.comment_content)==='')
					return;
				html += '<div id="'+comment._id.$id+'" class="comment">'+
					'<span class="comment-author">'+comment.comment_author+':</span> '+
					comment.comment_content+
					'</div>';
			});
			$('#popular-comments').prepend(html);
		}).always(function(){
			$('#popular-comments .spinner').remove();
		});
	}

	/* Menu */
	var currMenuPage = 1;
	function menuType() {
		return isLayout('mobile')? 'left' : 'top';
	}
	function openMenu() {
		$body.addClass('menu-open');
		if (menuType()==='left') {
			$$('#menu').css({x: -180}).show().transition({ x: -1 }, 600, 'ease');
		} else {
			$$('#menu').css({x: 0}).show();
			$$('#menu').iosSlider({
				desktopClickDrag: true
			});
			currMenuPage = 1;
		}
	}
	function closeMenu() {
		$body.removeClass('menu-open');
		//setTimeout() is to prevent slider re-enabling due to unbind resize event bug related to smartresize
		setTimeout(function(){$$('#menu').iosSlider('destroy');}, 0);
		if (menuType()==='left') {
			$$('#menu').transition({x: -180}, 600, 'ease', function(){ $$('#menu').hide(); });
		}
	}
	function setMenuPage(p) {
		if (p<1)
			p = 1;
		
		//88 is the width of next/prev buttons
		var pagesCount = Math.ceil( ($$('#menu').find('ul').width()-88) / ($$('#menu').width()-88) );
		if (p>pagesCount)
			p = pagesCount;
		
		if (p===currMenuPage)
			return;
		
		var itemsCount = $$('#menu').find('li').length;
		var pItem = (p-1) * Math.round(itemsCount/pagesCount) + 1;
		$$('#menu').iosSlider('goToSlide', pItem);
		currMenuPage = p;
	}
	//open/close on button click
	$('#menu-link').click(function(){
		var open = $body.hasClass('menu-open');
		if (open)
			closeMenu();
		else
			openMenu();
		
		return false;
	});
	//close on body click (left bar version only)
	$body.on('click', function(e){
		if( $body.hasClass('menu-open') &&
		    menuType()==='left' &&
		    !$(e.target).closest('#menu').length ) {
			closeMenu();
		}
	});
	//open menu on page load (top bar version)
	if (menuType()==='top') {
		openMenu();
	}
	//switch menu on layout change
	var lastType = menuType();
	$(window).resize(function(){
		var type = menuType();
		if (lastType!==type) {
			//close top bar menu on mobile layout and open otherwise
			if (type==='top')
				openMenu();
			else if (type==='left')
				closeMenu();
		}
		lastType = type;
	});
	$$('#menu').find('.prev').click(function(){
		setMenuPage(currMenuPage-1);
	});
	$$('#menu').find('.next').click(function(){
		setMenuPage(currMenuPage+1);
	});
	
	/* Show/hide tags */
	jQuery('.switch-tags').click( function(){
		var $switchLink = jQuery(this);
		var $hiddenTags = $switchLink.prev('.hidden-tags');
		$hiddenTags.toggle(300, function(){
			if ( $hiddenTags.is(':visible') ) {
				$switchLink.html('-');
				e('postTag', ['More']);
			} else {
				$switchLink.html('+');
				e('postTag', ['Less']);
			}
		});
		return false;
	});
	
	/* Dropdowns */
	//show/hide
	$body.on('click', '.archive-meta .dropdown', function() {
		jQuery(this).toggleClass('open');
	});
	//hide when clicked outside or on a link
	$body.on('click', function(e){ //document is not working for dropdown links somehow
		var $dropdowns = jQuery('.dropdown.open'), 
		    $target = jQuery(e.target).not('a'); //skip links
		
		//hide only those that not has target or are not target itself
		$dropdowns = $dropdowns.not( $dropdowns.has($target) ).not($target);
		$dropdowns.removeClass('open');
	});
	
	/* Post likes */
	if (awsL10n.isSingle) {
		var $likes = jQuery('#post-likes');
		
		var like = function(noapi) {
			var likes = $likes.data('likes') || 0,
			    noapi = noapi || false;
			likes += 1;
			
			$likes.unbind('click');
			$likes.click(function(){ unlike(); return false; });
			
			$likes.data('likes', likes);
			$likes.html(likes? ' '+shortenInt(likes) : ' Like?');
			$likes.removeClass('notliked').addClass('liked');
			
			if (!noapi) {
				api().likePost(awsL10n.postID, function(data, textStatus, jqXHR){
					e('postLike', [awsL10n.postID]);
				}).error(function(jqXHR, textStatus, errorThrown){
					unlike(true);
				});
			}
		};
		var unlike = function(noapi) {
			var likes = $likes.data('likes') || 0,
			    noapi = noapi || false;
			likes -= 1;
			
			$likes.unbind('click');
			$likes.click(function(){ like(); return false; });
			
			$likes.data('likes', likes);
			$likes.html(likes? ' '+shortenInt(likes) : ' Like?');
			$likes.removeClass('liked').addClass('notliked');
			
			if (!noapi) {
				api().unlikePost(awsL10n.postID, function(data, textStatus, jqXHR){
					e('postUnlike', [awsL10n.postID]);
				}).error(function(){
					like(true);
				});
			}
		};
		
		//IE9 wants it to be global variable
		postLikesXHR = api().getPostLikes(awsL10n.postID);
		postLikesXHR.done(function(data, textStatus, jqXHR){
			if (!data.success) return;
			
			//find current post in results set (howewer, set should contain only one element)
			var postLike = jQuery.grep(data.items, function(like, i){
				return (like.type==='post' && like.object.$id===awsL10n.postID);
			});
			if (!postLike[0]) return;
			postLike = postLike[0];
			
			$likes.addClass(postLike.liked? 'liked' : 'notliked');
			$likes.html(postLike.likes? ' '+shortenInt(postLike.likes) : ' Like?').data('likes', postLike.likes);
			
			if (!postLike.liked) {
				$likes.click(function(){ like(); return false; });
			} else {
				$likes.click(function(){ unlike(); return false; });
			}
		});
	}
	
	/* Sidebar popup */
	$('.sidebar-area').data('slide-origin', 'right');
	$('#single-author-block .comments, [name="show-comments"]').click(function(){
		if( isLayout('mobile') ) {
			if (!AWS.comments.started)
				AWS.comments.start();
			var $sidebar = $('.sidebar-area'),
			    sidebarWidth = $sidebar.outerWidth(); //https://bugs.webkit.org/show_bug.cgi?id=29084
			$body.addClass('popup-slide');
			$sidebar.show();
			$sidebar.css({right: -sidebarWidth}).slide({x: '-100%'}, 500, 'linear', function(){
				$$('body').removeClass('popup-slide');
				$('.main-area').hide();
				$('html, body').scrollTop($(document).height());
			});
		}
	});
	
	$('.sidebar-close').click(function(){
		var $sidebar = $('.sidebar-area');
		$body.addClass('popup-slide');
		$('.main-area').show();
		$sidebar.slide({x: '0%'}, 500, 'linear', function(){
			$$('body').removeClass('popup-slide');
			$sidebar.hide();
		});
	});

	/* Modal image */
	var modalImage = $('#modalImage').on('click', function(){ $(this).hide(); });
	$body.on('click', 'a > img.size-full', function(){
		if (!this.src)
			return;

		modalImage.show().find('.modalImage').css('background-image', 'url('+this.src+')');

		$('html').off('keyup').on('keyup', function(ev) {
			if (27 === ev.keyCode)
				modalImage.hide();
		});
		e('postImage');

		return false;
	});

	/* Event tracking */
	if (typeof _gaq == 'object') {

		// Archive
		if (awsL10n.isHome)
			jQuery('#posts').on('click', 'a', function(){
				_gaq.push(['_trackEvent', 'Homepage', 'All links', this.href]);
			});
		if (awsL10n.isArchive)
			jQuery('#posts').on('click', '.post a', function(){
				_gaq.push(['_trackEvent', 'Archive', 'Posts links', this.href]);
			});
		jQuery('#posts').on('click', '#vertical-strip .vs-post a', function(){
			_gaq.push(['_trackEvent', 'Archive', 'Trending', this.href]);
		});
		on('archiveLoadPosts', function(){
			_gaq.push(['_trackEvent', 'Infinite archives', 'Load', window.location.toString()]);
		});
		jQuery('#main').on('click', '.archive-meta .dropdown-menu a', function(){
			_gaq.push(['_trackEvent', 'Infinite archives', 'Sort', this.href]);
		});

		// Header
		jQuery('#categories a').click(function(){
			_gaq.push(['_trackEvent', 'Categories', jQuery(this).text(), this.href]);
		});
		jQuery('#menu .prev').click(function(){
			_gaq.push(['_trackEvent', 'Categories', 'Prev']);
		});
		jQuery('#menu .next').click(function(){
			_gaq.push(['_trackEvent', 'Categories', 'Next']);
		});
		jQuery('#menu-link').click(function(){
			_gaq.push(['_trackEvent', 'Header', 'LeftMenu']);
		});
		jQuery('#logo a').click(function(){
			_gaq.push(['_trackEvent', 'Header', 'Logo']);
		});
		jQuery('#header-links a[data-href="#about"]').click(function(){
			_gaq.push(['_trackEvent', 'Header', 'About']);
		});
		// Search
		on('searchOpen', function(){
			_gaq.push(['_trackEvent', 'Header', 'Search']);
			_gaq.push(['_trackEvent', 'Search', 'Open']);
		});
		on('searchClose', function(){
			_gaq.push(['_trackEvent', 'Search', 'Close']);
		});
		on('searchCompletion', function(e, query){
			_gaq.push(['_trackEvent', 'Search', 'Autocomplete', query]);
		});
		on('search', function(e, query){
			_gaq.push(['_trackEvent', 'Search', 'Search', query]);
		});
		jQuery('#popup').on('click', '.search-item a', function(){
			_gaq.push(['_trackEvent', 'Search', 'Link', this.href]);
		});
		// Activity
		on('activityOpen', function(){
			_gaq.push(['_trackEvent', 'Header', 'Activity']);
			_gaq.push(['_trackEvent', 'Activity', 'Open']);
		});
		on('activityClose', function(){
			_gaq.push(['_trackEvent', 'Activity', 'Close']);
		});
		jQuery('#popup').on('click', '.activity-item a', function(){
			_gaq.push(['_trackEvent', 'Activity', 'Link', this.href]);
		});

		// Posts
		on('postLike', function(e, id){
			_gaq.push(['_trackEvent', 'Posts', 'Like', window.location.toString()]);
		});
		on('postUnlike', function(e, id){
			_gaq.push(['_trackEvent', 'Posts', 'Unlike', window.location.toString()]);
		});
		on('postImage', function(){
			_gaq.push(['_trackEvent', 'Posts', 'Image', window.location.toString()]);
		});
		jQuery('#single').on('click', '.pin-it-button', function(){
			_gaq.push(['_trackEvent', 'Share button', 'PinIt', window.location.toString()]);
		});
		
		on('postTag', function(e, name){
			_gaq.push(['_trackEvent', 'Posts', 'Tag', name]);
		});
		jQuery('#tags').on('click', 'a[rel="tag"]', function(){
			_gaq.push(['_trackEvent', 'Posts', 'Tag', jQuery(this).text()]);
		});
		jQuery('#related').on('click', 'a', function(){
			_gaq.push(['_trackEvent', 'Related posts', jQuery(this).data('track'), this.href]);
		});
		on('postBottomNext', function(e, dest, url){ // Next Page || Next Post
			_gaq.push(['_trackEvent', 'Post Navigation', dest, url]);
		});
		on('postPageSwitched', function(e, num, url){
			var trackURL = '/'+url.replace(awsL10n.homeURL, ''); //remove proto & host
			_gaq.push(['_trackPageview', trackURL]);
		});

		// Comments
		jQuery('.comment-sort-wrap button').click( function(){
			_gaq.push(['_trackEvent', 'Comments', 'Sort', jQuery(this).text()]);
		});
		on('commentReply', function(e, id){
			_gaq.push(['_trackEvent', 'Comments', 'Reply', id]);
		});
		on('commentLike', function(e, id){
			_gaq.push(['_trackEvent', 'Comments', 'Like', window.location.toString()]);
		});
		on('commentUnlike', function(e, id){
			_gaq.push(['_trackEvent', 'Comments', 'Unlike', window.location.toString()]);
		});
		on('Auth', function(e, source, mode){ // Comments || Header, login || profile
			mode = ucfirst(mode);
			_gaq.push(['_trackEvent', 'Auth', source, mode]);
			if (mode != 'Profile') _gaq.push(['_trackEvent', source, 'Login']);
			else _gaq.push(['_trackEvent', 'Header', 'Profile', Auth.getDataChecked('user_id')]);
		});
		on('commentSend', function(){
			_gaq.push(['_trackEvent', 'Comments', 'Send']);
		});
		on('OpenProfile', function(e, usertype, username){ // comment author
			_gaq.push(['_trackEvent', 'OpenProfile', usertype, username]);
		});
	}
	
	//Ads refreshing
	on('postPageSwitched', function(e, num, url) {
		if (typeof googletag === 'object' && googletag.pubads)
			googletag.pubads().refresh();
	});
	
	/* Share */
	var permalink = 'http://' + window.location.hostname + '/' + window.location.pathname.split('/')[1] + '/',
	    title = encodeURIComponent( jQuery('meta[property="og:title"]').attr('content') ).replace(/'/g, '%27'),
	    content = encodeURIComponent('Please check it out: ') + title + '%0A' + encodeURI(permalink),
	    p1 = "_gaq.push(['_trackEvent', 'Share button', '",
	    p2 = "', '"+permalink+"']);window.open('http",
	    p3 = permalink+"', '_blank', 'scrollbars=0, resizable=1, menubar=0, left=200, top=200, width=550, height=440, toolbar=0, status=0');return false",
	    fb = p1+'Facebook'+p2+'://www.facebook.com/sharer.php?t='+title+'&u='+p3,
	    tw = p1+'Twitter'+p2+'://twitter.com/share?text='+title+'&url='+p3,
	    ehref = 'mailto:?Subject='+title+'&body='+content,
	    eclick = "_gaq.push(['_trackEvent', 'Share button', 'Email', '"+permalink+"'])";
	jQuery('#soc-fb').attr('onclick', fb);
	jQuery('#soc-tw').attr('onclick', tw);
	jQuery('#soc-em').attr('onclick', eclick);
	jQuery('#soc-em').attr('href', ehref);
	
	jQuery.getJSON('http://graph.facebook.com/?id='+permalink+'&callback=?', function(data) {
		if( data.shares ) jQuery('#soc-fb').append( ' <span>'+shortenInt(data.shares)+'</span>' );
	});
	jQuery.getJSON('http://urls.api.twitter.com/1/urls/count.json?url='+permalink+'&callback=?', function(data) {
		if( data.count ) jQuery('#soc-tw').append( ' <span>'+shortenInt(data.count)+'</span>' );
	});
	
	var lastSearchQuery = getCookie('aws-last-search');
	if (lastSearchQuery) {
		jQuery('#search-input-header').val(lastSearchQuery);
	}
	jQuery('#search-input-header').autocomplete(AWS.config.searchComplete);
	
	AWS.isPinterestUser = !!getCookie('aws-pinter') || (document.referrer && !!document.referrer.match(/^https?:\/\/pinterest.com/));
	if (AWS.isPinterestUser) {
		setCookie('aws-pinter', '1', {domain:'.allwomenstalk.com', path:'/'});
	}
	
});

/**
 * Videos & images auto-width
 */
AWS.modules.ContentProcessor = function(params){
	params = params || {};
	this.iframeCounter = 0;
	jQuery.extend(this.config, params);
	this.init();
};
jQuery.extend(AWS.modules.ContentProcessor.prototype, {
	config: {
		contentSelector: '#content .post-page:visible .post-box',
		widthLimit: 0.9
	},
	init: function(){
		var self = this;
		on('smartresize', function(){ self.updateIframes(); });
		jQuery(document).ready(function(){ self.updateImages(); self.updateIframes(); });
		on('postPageSwitch', function(e, current, next){ self.stopVideos($$('#page-'+current+' .post-box')); });
		on('postPageSwitched', function(e, num){ self.updateImages(jQuery('#page-'+num+' .post-box')); self.updateIframes(jQuery('#page-'+num+' .post-box')); });
	},
	updateIframes: function($context){
		var self = this;
		$context = $context || jQuery(self.config.contentSelector);

		$context.find('iframe').each(function() {
			var $this = jQuery(this);
			var defWidth = parseInt($this.attr('width')), defHeight = parseInt($this.attr('height'));
			var newWidth = $this.width(); //calculated width - 100%
			if (defWidth > 0 && defHeight > 0) {
				var k = defWidth / defHeight;
				var newHeight = newWidth/k;
			} else {
				var newHeight = 'auto';
			}
			if (newHeight)
				$this.attr({width:newWidth, height: newHeight});
			
			//youtube api needs id on every video
			if ( !$this.attr('id') ) {
				$this.attr('id', 'iframe-'+self.iframeCounter);
				self.iframeCounter++;
			}
		});
	},
	updateImages: function($context){
		var self = this;
		$context = $context || jQuery(this.config.contentSelector);
		
		function enlargeImage($img) {
			if ($img.width() >= $context.width()*self.config.widthLimit)
				$img.addClass('bigimage');
		}
		function addPinIt($img) {
			if ( isLayout('mobile') ||
			    !AWS.isPinterestUser )
				return;
			self.addPinIt($img);
		}

		var $pinPics = $$('$content').find('.pin-it img'),
		    $pics = $$('$content').find('img:not(.bigimage)' ).not($pinPics);
		$pics.each( function(i, pic){
			var $this = jQuery(pic);
			if (pic.complete) {
				enlargeImage($this);
				addPinIt($this);
			} else {
				$this.load( function(){
					enlargeImage($this);
					addPinIt($this);
				});
			}
		}); // end each pic
	},
	
	stopVideos: function($context) {
		$context = $context || jQuery(this.config.contentSelector);
		$context.find('iframe').each(function() {
			callPlayer(this.id, "stopVideo");
		});
	},
	addPinIt: function($img) {
		if ( $img.parent().hasClass('pinned') ) return;
		
		var shareURLRaw = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search, //without hash
		    shareURL = encodeURIComponent(shareURLRaw);
		var titleRaw = document.title,
		    title = encodeURIComponent(titleRaw);
		var mediaRaw = $img.attr('src'),
		    media = encodeURIComponent(mediaRaw);
		var href = 'http://pinterest.com/pin/create/button/?url='+shareURL+'&media='+media+'&description='+title;
		
		var pinLink = '<span class="pin-it"><a href="'+href+'" class="pin-it-button" count-layout="horizontal" target="_blank"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a></span>';
		$img.wrap('<span class="image-wrap pinned" />');
		$img.after(pinLink);
	}
	
});

/*
 * Utilities
 */

function $$(key) {
	if (key)
		return AWS.domCache.get(key);
	else
		return AWS.domCache;
}

function api(){
	if ( !AWS.api ) {
		AWS.api = new AWS.modules.Api();
		AWS.api.contentURL = awsL10n.contentApi;
		AWS.api.usersURL = awsL10n.usersApi;
		AWS.api.votingURL = awsL10n.votingApi;
		AWS.api.commentGateURL = awsL10n.commentGate;
	}
	
	return AWS.api;
}

function activity() {
	return AWS.activity;
}

function tmpl(){
	if ( !AWS.template )
		AWS.template = new AWS.modules.Template( AWS.config.templates );

	return AWS.template;
}

function model(model, data) {
	return new AWS.models[model](data);
}
function view(view, data, config) {
	return new AWS.views[view](data, config);
}

/**
 * Trigger event shortland
 *
 * @param event
 * @param params
 */
function e(event, params){
	jQuery(window).trigger(event, params);
}
function on(event, func){
	jQuery(window).bind(event, func);
}
function off(event, func){
	jQuery(window).unbind(event, func);
}

function htmlspecialchars_decode (str, quote_style) {
	if (typeof quote_style == 'undefined') quote_style= 'ENT_COMPAT';
	str= str.replace(/&amp;/g, '&');
	if (quote_style !=  'ENT_NOQUOTES')
	str= str.replace(/&quot;/g, '"');
	if (quote_style ==  'ENT_QUOTES')
	str= str.replace(/'/g, "'");
	str= str.replace(/&lt;/g, '<');
	return str.replace(/&gt;/g, '>');
}
function ucfirst(str) {
	str += '';
	var f = str.charAt(0).toUpperCase();
	return f + str.substr(1);
}
function rtrim (str, charlist) {
	charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
	var re = new RegExp('[' + charlist + ']+$', 'g');
	return (str + '').replace(re, '');
}
function trim (str, charlist) {
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: mdsjack (http://www.mdsjack.bo.it)
	// +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
	// +      input by: Erkekjetter
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +      input by: DxGx
	// +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
	// +    tweaked by: Jack
	// +   bugfixed by: Onno Marsman
	// *     example 1: trim('    Kevin van Zonneveld    ');
	// *     returns 1: 'Kevin van Zonneveld'
	// *     example 2: trim('Hello World', 'Hdle');
	// *     returns 2: 'o Wor'
	// *     example 3: trim(16, 1);
	// *     returns 3: 6
	var whitespace, l = 0,
		i = 0;
	str += '';

	if (!charlist) {
		// default list
		whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
	} else {
		// preg_quote custom list
		charlist += '';
		whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
	}

	l = str.length;
	for (i = 0; i < l; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}

	l = str.length;
	for (i = l - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}

	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}
function strip_tags (input, allowed) {
	allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
}
function array_unique (inputArr) {
    var key = '',
        tmp_arr2 = [],
        val = '';

    var __array_search = function (needle, haystack) {
        var fkey = '';
        for (fkey in haystack) {
            if (haystack.hasOwnProperty(fkey)) {
                if ((haystack[fkey] + '') === (needle + '')) {
                    return fkey;
                }
            }
        }
        return false;
    };

    for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
            val = inputArr[key];
            if (false === __array_search(val, tmp_arr2)) {
                tmp_arr2[key] = val;
            }
        }
    }

    return tmp_arr2;
}

function shortenInt(i){
	if ( i >= 1000) i = Math.floor(i/1000) + 'k';
	return i;
}
function autop(pee) {
	var preserve_linebreaks = false, preserve_br = false,
		blocklist = 'table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|option|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|noscript|samp|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary';
	
	if ( pee.indexOf('<object') != -1 ) {
		pee = pee.replace(/<object[\s\S]+?<\/object>/g, function(a){
			return a.replace(/[\r\n]+/g, '');
		});
	}
	
	pee = pee.replace(/<[^<>]+>/g, function(a){
		return a.replace(/[\r\n]+/g, ' ');
	});
	
	// Protect pre|script tags
	if ( pee.indexOf('<pre') != -1 || pee.indexOf('<script') != -1 ) {
		preserve_linebreaks = true;
		pee = pee.replace(/<(pre|script)[^>]*>[\s\S]+?<\/\1>/g, function(a) {
			return a.replace(/(\r\n|\n)/g, '<wp-temp-lb>');
		});
	}
	
	// keep <br> tags inside captions and convert line breaks
	if ( pee.indexOf('[caption') != -1 ) {
		preserve_br = true;
		pee = pee.replace(/\[caption[\s\S]+?\[\/caption\]/g, function(a) {
			// keep existing <br>
			a = a.replace(/<br([^>]*)>/g, '<wp-temp-br$1>');
			// no line breaks inside HTML tags
			a = a.replace(/<[a-zA-Z0-9]+( [^<>]+)?>/g, function(b){
				return b.replace(/[\r\n\t]+/, ' ');
			});
			// convert remaining line breaks to <br>
			return a.replace(/\s*\n\s*/g, '<wp-temp-br />');
		});
	}
	
	pee = pee + '\n\n';
	pee = pee.replace(/<br \/>\s*<br \/>/gi, '\n\n');
	pee = pee.replace(new RegExp('(<(?:'+blocklist+')(?: [^>]*)?>)', 'gi'), '\n$1');
	pee = pee.replace(new RegExp('(</(?:'+blocklist+')>)', 'gi'), '$1\n\n');
	pee = pee.replace(/<hr( [^>]*)?>/gi, '<hr$1>\n\n'); // hr is self closing block element
	pee = pee.replace(/\r\n|\r/g, '\n');
	pee = pee.replace(/\n\s*\n+/g, '\n\n');
	pee = pee.replace(/([\s\S]+?)\n\n/g, '<p>$1</p>\n');
	pee = pee.replace(/<p>\s*?<\/p>/gi, '');
	pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')(?: [^>]*)?>)\\s*</p>', 'gi'), "$1");
	pee = pee.replace(/<p>(<li.+?)<\/p>/gi, '$1');
	pee = pee.replace(/<p>\s*<blockquote([^>]*)>/gi, '<blockquote$1><p>');
	pee = pee.replace(/<\/blockquote>\s*<\/p>/gi, '</p></blockquote>');
	pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')(?: [^>]*)?>)', 'gi'), "$1");
	pee = pee.replace(new RegExp('(</?(?:'+blocklist+')(?: [^>]*)?>)\\s*</p>', 'gi'), "$1");
	pee = pee.replace(/\s*\n/gi, '<br />\n');
	pee = pee.replace(new RegExp('(</?(?:'+blocklist+')[^>]*>)\\s*<br />', 'gi'), "$1");
	pee = pee.replace(/<br \/>(\s*<\/?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)>)/gi, '$1');
	pee = pee.replace(/(?:<p>|<br ?\/?>)*\s*\[caption([^\[]+)\[\/caption\]\s*(?:<\/p>|<br ?\/?>)*/gi, '[caption$1[/caption]');
	
	pee = pee.replace(/(<(?:div|th|td|form|fieldset|dd)[^>]*>)(.*?)<\/p>/g, function(a, b, c) {
		if ( c.match(/<p( [^>]*)?>/) )
			return a;
		
		return b + '<p>' + c + '</p>';
	});
	
	// put back the line breaks in pre|script
	if ( preserve_linebreaks )
		pee = pee.replace(/<wp-temp-lb>/g, '\n');
	
	if ( preserve_br )
		pee = pee.replace(/<wp-temp-br([^>]*)>/g, '<br$1>');
	
	return pee;
}
function timeAgo(from, to) {
	if( !(to instanceof Date) ) to = new Date();
	//TODO: parce date more precisely
	if( !(from instanceof Date) ) from = new Date( from.replace('+', ' +').replace('T', ' ').replace(/-/g, '/') );
	
	var since = '',
	    diff = Math.round(Math.abs(to - from)/1000); //in seconds
	if(diff <= 3600) since = Math.round(diff / 60).toString() + 'm ago'; /* 1 minute .. 60 minutes */
	else if( diff>3600 && diff<=86400 ) since = Math.round(diff / 3600).toString() + 'h ago'; /* 1 hour ..  24 hours */
	else if( diff>86400 && diff<=604800 ) since = Math.round(diff / 86400).toString() + 'd ago'; /* 1 day .. 7 days */
	else if( diff>604800 && diff<=3024000 ) since = Math.round(diff / 604800).toString() + 'w ago'; /* 1 week .. 5 weeks */
	
	return since;
}

/**
 * Convert date from API format to JS Date object
 * 
 * API format, UTC:
 * YYYY-MM-DD hh:mm:ss
 * 
 * @param {String} date The date in API format.
 * @returns {Date} Corresponding JS Date object.
 */
function apiDate(date) {
	//FF doesn't understand hyphen as valid separator
	//server gives time in UTC
	return new Date(date.replace(/-/g, '/')+' UTC');
}

function shuffleArray(arr, b) {
	var i = arr.length, j, t;
	while( i ){
		j = Math.floor( ( i-- ) * Math.random() );
		t = b && typeof arr[i].shuffle!=='undefined' ? shuffleArray(arr[i]) : arr[i]; //FIXME: arr[i].shuffle?!? WTF?
		arr[i] = arr[j];
		arr[j] = t;
	}
	return arr;
}

//http://stackoverflow.com/questions/2815683/jquery-javascript-replace-tag-type
function replaceElm(oldTagName, newTagName, targetElm) {
  var target = targetElm || window.document;
  var allFound = target.getElementsByTagName(oldTagName);
  for (var i=0; i<allFound.length; i++) {
    var tmp = document.createElement(newTagName);
    for (var k=0; k<allFound[i].attributes.length; k++) {
      var name = allFound[i].attributes[k].name;
      var val = allFound[i].attributes[k].value;
      tmp.setAttribute(name,val);
    }
    tmp.innerHTML = allFound[i].innerHTML;
    allFound[i].parentNode.insertBefore(tmp, allFound[i]);
    allFound[i].parentNode.removeChild(allFound[i]);
  }
}
function replaceSingleElm(newTagName, targetElm) {
    var tmp = document.createElement(newTagName);
    for (var k=0; k<targetElm.attributes.length; k++) {
      var name = targetElm.attributes[k].name;
      var val = targetElm.attributes[k].value;
      tmp.setAttribute(name,val);
    }
    tmp.innerHTML = targetElm.innerHTML;
    targetElm.parentNode.insertBefore(tmp, targetElm);
    targetElm.parentNode.removeChild(targetElm);
}
function asyncLoad(src) {
	var element = document.createElement("script");
	element.type = 'text/javascript';
	element.async = true;
	element.src = src;
	document.body.appendChild(element);
}

/*
 * Cookie functions (http://javascript.ru/unsorted/top-10-functions#3-2-i-1-getcookie-setcookie-deletecookie)
 */
function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
	  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, props) {
	props = props || {};
	var exp = props.expires;
	if (typeof exp == "number" && exp) {
		var d = new Date();
		d.setTime(d.getTime() + exp*1000);
		exp = props.expires = d;
	}
	if(exp && exp.toUTCString) { props.expires = exp.toUTCString(); }

	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value;
	for(var propName in props){
		updatedCookie += "; " + propName;
		var propValue = props[propName];
		if(propValue !== true){ updatedCookie += "=" + propValue; }
	}
	document.cookie = updatedCookie;

}

function deleteCookie(name) {
	setCookie(name, null, { expires: -1 });
}

/*
 * @author       Rob W (http://stackoverflow.com/a/7513356/938089
 * @description  Executes function on a framed YouTube video (see previous link)
 *               For a full list of possible functions, see:
 *               http://code.google.com/apis/youtube/js_api_reference.html
 * @param String frame_id The id of (the div containing) the frame
 * @param String func     Desired function to call, eg. "playVideo"
 * @param Array  args     (optional) List of arguments to pass to function func*/
function callPlayer(frame_id, func, args) {
    if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
    var iframe = document.getElementById(frame_id);
    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }
    if (iframe) {
        // Frame exists, 
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": args || [],
            "id": frame_id
        }), "*");
    }
}

//Fire callbacks when the image is loaded or failed to load in a cross-browser way
// http://lucassmith.name/2008/11/is-my-image-loaded.html
function imgLoaded(img, load, error) {
	var prop, succ, fail;
	succ = (typeof load.load === 'function')? load.load : load;
	fail = (typeof load.error === 'function')? load.error : error;

	if (typeof img === 'string')
		img = document.getElementById(img);
	else if (img instanceof jQuery)
		img = img.get(0);
	
	if (!img)
		return null;
	
	prop = typeof img.naturalWidth === 'undefined' ? 'width' : 'naturalWidth';

	// Loaded?
	if (img.complete) {
		if (img[prop]) {
			if (typeof succ === 'function')
				succ.call(img);
		} else if (typeof fail === 'function') {
			fail.call(img);
		}
	} else {
		if (typeof succ === 'function') {
			img.onload = succ;
		}
		if (typeof fail === 'function') {
			img.onerror = fail; //NOTE: IE8 may fire this each time img is accesed
		}
	}

	return img;
}

function isLayout(layout) {
	//always 'normal' layout for browsers which don't support media queries
	if (!$.support.mediaQueries || !window.matchMedia) {
		return layout==='normal';
	}
	
	var media = '';
	if (layout in AWS.config.layouts)
		media = AWS.config.layouts[layout];
	else
		media = layout;
	return !!window.matchMedia(media).matches;
}
function getLayout() {
	if (isLayout('mobile'))
		return 'mobile';
	if (isLayout('wide'))
		return 'wide';
	return 'normal';
}


//TODO: modernise and extend this, especially for Android (Dolphin, versions etc.)
//detect.js - browser & os detection
//2011 (c) Ben Brooks Scholz. MIT Licensed.

;(function (window) {

 var browser,
     version,
     mobile,
     os,
     osversion,
     bit,
     ua = window.navigator.userAgent,
     platform = window.navigator.platform;

 if ( /MSIE/.test(ua) ) {
     
     browser = 'Internet Explorer';
     
     if ( /IEMobile/.test(ua) ) {
         mobile = 1;
     }
     
     version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];
     
 } else if ( /Chrome/.test(ua) ) {
     
     browser = 'Chrome';
     version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];
     
 } else if ( /Opera/.test(ua) ) {
     
     browser = 'Opera';
     
     if ( /mini/.test(ua) || /Mobile/.test(ua) ) {
         mobile = 1;
     }
     
 } else if ( /Android/.test(ua) ) {
     
     browser = 'Android Webkit Browser';
     mobile = 1;
     os = /Android\s[\.\d]+/.exec(ua);
     
 } else if ( /Firefox/.test(ua) ) {
     
     browser = 'Firefox';
     
     if ( /Fennec/.test(ua) ) {
         mobile = 1;
     }
     version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
     
 } else if ( /Safari/.test(ua) ) {
     
     browser = 'Safari';
     
     if ( (/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua)) ) {
         os = 'iOS';
         mobile = 1;
     }
     
 }

 if ( !version ) {
     
      version = /Version\/[\.\d]+/.exec(ua);
      
      if (version) {
          version = version[0].split('/')[1];
      } else {
          version = /Opera\/[\.\d]+/.exec(ua)
          if (version) {
              version = version[0].split('/')[1];
          }
      }
      
 }
 
 if ( platform === 'MacIntel' || platform === 'MacPPC' ) {
     os = 'Mac OS X';
     osversion = /10[\.\_\d]+/.exec(ua)[0];
     if ( /[\_]/.test(osversion) ) {
         osversion = osversion.split('_').join('.');
     }
 } else if ( platform === 'Win32' || platform == 'Win64' ) {
     os = 'Windows';
     bit = platform.replace(/[^0-9]+/,'');
 } else if ( !os && /Linux/.test(platform) ) {
     os = 'Linux';
 } else if ( !os && /Windows/.test(ua) ) {
     os = 'Windows';
 }

 window.ui = {
     browser : browser,
     version : version,
     mobile : mobile,
     os : os,
     osversion : osversion,
     bit: bit
 };
}(this));

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
window.matchMedia = window.matchMedia || (function(doc, undefined){

  var bool,
      docElem  = doc.documentElement,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');

  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){
	var refNode  = docElem.firstElementChild || docElem.firstChild;

    div.innerHTML = '&shy;<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';

    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth === 42;
    docElem.removeChild(fakeBody);

    return { matches: bool, media: q };
  };

}(document));
$.support.mediaQueries = window.matchMedia && window.matchMedia( "only all" ).matches;

function extend(Child, Parent) {
	var F = function() { };
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}

//apply on constructor
//http://stackoverflow.com/questions/1959247/javascript-apply-on-constructor-throwing-malformed-formal-parameter
create = function(){
    function tempCtor() {};
    return function(Constructor, args){
        tempCtor.prototype = Constructor.prototype;
        var instance = new tempCtor();
        Constructor.apply(instance, args);
        return instance;
    };
}();

function timeFromStart(){
	var now = new Date();
	return (now.getTime() - startTime.getTime())/1000;
}

/*
 * jQuery shuffle plugin
 * http://james.padolsey.com/javascript/shuffling-the-dom/
 */
(function($){
 
    $.fn.shuffle = function() {
 
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
 
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
 
        return $(shuffled);
 
    };
 
})(jQuery);

if ( window.XDomainRequest ) {
	jQuery.ajaxTransport(function( s ) {
		if ( s.crossDomain && s.async ) {
			if ( s.timeout ) {
				s.xdrTimeout = s.timeout;
				delete s.timeout;
			}
			var xdr;
			return {
				send: function( _, complete ) {
					function callback( status, statusText, responses, responseHeaders ) {
						xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
						xdr = undefined;
						complete( status, statusText, responses, responseHeaders );
					}
					xdr = new XDomainRequest();
					xdr.onload = function() {
						callback( 200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType );
					};
					xdr.onerror = function() {
						callback( 404, "Not Found" );
					};
					xdr.onprogress = jQuery.noop;
					xdr.ontimeout = function() {
						callback( 0, "timeout" );
					};
					xdr.timeout = s.xdrTimeout || Number.MAX_VALUE;
					xdr.open( s.type, s.url );
					xdr.send( 
						( s.hasContent && s.data ) 
						|| null
					);
				},
				abort: function() {
					if ( xdr ) {
						xdr.onerror = jQuery.noop;
						xdr.abort();
					}
				}
			};
		}
	});
}

/* ===================================================
 * bootstrap-transition.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
 
