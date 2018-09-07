var AWS = AWS || {};
AWS.ajaxControllers = AWS.ajaxControllers || {};

(function(){
/**
 * Infinite archives controller
 * 
 * @param params
 * @returns {AWS.ajaxControllers.Archives}
 */
var Archives = function(router, params){
	this.type = '';
	this.name = params['name'] || '';
	this.nextPageToken = '';
	this.xhr = false;
	this.blog = awsL10n.blog;
	this.queue = [];
	this.postsContainer = jQuery('#posts');
	this.portion = parseInt(awsL10n.archivesPostsPortion);
	this.portionShow = parseInt(awsL10n.archivesPortionShow);
	this.minQueue = parseInt(awsL10n.archivesMinQueue);
	this.orderBy = 'latest';
	this.stopped = true;
};
Archives.adCounter = 0;
jQuery.extend(Archives.prototype, {
	/*
	 * Functions to be called from Router
	 */
	index: function(params, e){
		params = params || {};
		params.name = this.blog!=='aws' ? this.blog : 'latest';

		this.startArchive('index', params, e);
	},
	author: function(params, e){
		this.startArchive('author', params, e);
	},
	category: function(params, e){
		this.startArchive('category', params, e);
	},
	tag: function(params, e){
		this.startArchive('tag', params, e);
	},
	date: function(params, e){
		params = params || {};
		var dateStr = '', first = true;
		jQuery.each(params['splat'], function(i, val){
			if ( !val ) return true;
			dateStr += (first? '' : '-') + val;
			first = false;
		});
		
		params.name = dateStr;
		this.startArchive('date', params, e);
	},
	
	/**
	 * Start archive
	 * 
	 * @param {String} type Archive type (e. g. 'index', 'category').
	 * @param {Object} params The query parameters.
	 * @param {Sammy.EventContext} e Sammy event context.
	 */
	startArchive: function(type, params, e){
		var self = this;
		jQuery(window).on('resize', function(){
			setTimeout(function(){ self.resize(); }, 50);
		});

		params = params || {};
		params.orderby = (params.splat? params.splat[0] : 'latest') || 'latest';
		params.name = params.name || '';
		
		if ( self.type===type && self.name===params.name && self.orderBy===params.orderby ) { //this is the same archive, nothing to do
			return;
		}
		
		//this is another archive, stop previous if it is initialised
		if (!self.stopped) {
			self.stop();
		}
		
		self.type = type;
		self.name = params.name;
		self.orderBy = params.orderby;
		
		self.showCategories = (self.type!=='category' && self.blog==='aws');
		self.nextPageToken = '';
		self.finished = false;
		self.stopped = false;
		self.eventContext = e;
		self.queue = [];
		
		//start with finished showing and loading processes with no posts
		self.showing = new jQuery.Deferred();
		self.showing.resolve();
		self.loading = new jQuery.Deferred();
		self.loading.resolveWith(self, [ {posts:[]} ]);
		
		$$('#infinite-more').show();
		$$('#main').html( tmpl().render('archiveWrapper', {}, self) );
		self.postsContainer = $$('#main').find('#posts');
		
		self.isMasonry = false; //masonry will be setted up after first posts show
		on('fontsLoaded.archives.AWS trendingLoaded.archives.AWS smartresize.archives.AWS', function(e,p){
			self.resize();
		});
		
		on('scroll.archives.AWS', function(){
			if (self.showing.state()!=='pending')
				self.maybeShowPortion();
		});
		
		self.showPortion(true);
	},
	/**
	 * Destroy current archive presentation
	 * 
	 * Called when user leaves the archive.
	 */
	stop: function(){
		this.stopped = true;
		$$('#infinite-more').show();
		$$('#main').empty();
		off('.archives');
		
		//stop all asynchonous stuff
		if (this.loading instanceof jQuery.Deferred)
			this.loading.reject();
		if (this.showing instanceof jQuery.Deferred)
			this.showing.reject();
		if (this.xhr && this.xhr.abort)
			this.xhr.abort();
	},
	/**
	 * Finish current archive presentation
	 * 
	 * Called when there are no more posts in the archive.
	 */
	finish: function(){
		this.finished = true;
		$$('#infinite-more').hide();
	},
	/**
	 * Show the next posts portion
	 * 
	 * @param {Boolean} [first=false] Do we showing first posts portion in the current archive?
	 */
	showPortion: function(first) {
		var self = this;
		first = first || false;
		
		var showCb = function(data) {
			if (first && self.type==='author') self.showAuthorMeta(data);
			
			var portion = Math.min(self.portionShow, self.queue.length);
			var show = self.queue.splice(0, portion);
			
			//load next portion
			if (self.queue.length<self.minQueue) {
				self.loadPosts();
			}
			
			return self.showPosts(show, first);
		};
		
		if (self.showing.state()==='pending') return;
		
		var count = self.portion;
		if ( !self.isMasonry && !(first && !isLayout('mobileNarrow')) ) {
			count = 15; //dirty override for mobile
		}
		
		//if there is not enough posts, load them
		if (self.queue.length<self.portionShow) {
			self.loadPosts(count);
			//and show after just started or previous loading process finishes
			self.showing = self.loading.pipe(showCb);
		} else {
			//else don't wait for any loading process
			self.showing = showCb();
		}
		
		self.showing.done( function(){
			self.resize();
			// showing state is "resolved" here, so we can show again
			if (!self.finished)
				self.maybeShowPortion();
		});
	},
	/**
	 * Load next posts portion if user scrolled window to bottom
	 * 
	 * @returns {Boolean} Did we tried to load posts?
	 */
	maybeShowPortion: function() {
		var self = this;
		
		if ( !$$('#main').is(':visible') )
			return false;
		
		var positionBottom = jQuery(document).height();
		var scrollPosTop = jQuery(window).scrollTop();
		var scrollPosBottom = scrollPosTop + jQuery(window).height();

		var distanceBottom = positionBottom - scrollPosBottom;
		
		if (distanceBottom < 500) {
			self.showPortion();
			return true;
		}
		
		return false;
	},
	/**
	 * Load next posts portion
	 * 
	 * @param {Number} [count] How many posts to load.
	 * @returns {jQuery.Deferred} jQuery promise of loading.
	 */
	loadPosts: function(count){
		var self = this;
		count = count || self.portion;
		
		//if we're busy now, return current loading deferred
		if (self.loading.state()==='pending') {
			return self.loading;
		}
		//else load posts and instantiate new deferred
		self.loading = new jQuery.Deferred();
		
		if (self.finished) {
			//this will not overwrite the response of previous load
			//because of single-threaded JS nature
			self.loading.resolveWith(self, [ {posts:[]} ]);
			return self.loading;
		}
		
		e('archiveLoadPosts');
		
		var params = {
			count: count
		};
		if ( self.nextPageToken )
			params.next_page = decodeURIComponent(self.nextPageToken);
		
		var apiFunc, args = [];
		if ( awsL10n.blog !== 'aws' && self.type == 'index' ) { //subblogs index
			apiFunc = 'PostsByCategory'; //from corresponding super-category
			args.push(self.blog);
			args.push(self.orderBy);
		} else if ( awsL10n.blog !== 'aws' && self.type == 'date' ) { //subblogs date
			apiFunc = 'PostsByCategoryDate'; //from corresponding super-category by date
			args.push(self.blog);
			args.push(self.name); //date here
		} else if ( this.type == 'author' ) {
			apiFunc = 'PostsByAuthor'; //main blog: by author
			args.push(self.name);
			args.push(self.orderBy);
		} else if ( this.type == 'category' ) {
			apiFunc = 'PostsByCategory'; //main blog: by super-category
			args.push(self.name);
			args.push(self.orderBy);
		} else if ( this.type == 'tag' ) {
			apiFunc = 'PostsByTag'; //main blog: by tag
			args.push(self.name);
			args.push(self.orderBy);
		} else if ( this.type == 'date' ) {
			apiFunc = 'PostsByDate'; //main blog: by date
			args.push(self.name); //date here
		} else {
			apiFunc = 'Posts';
			args.push(self.orderBy);
		}
		
		args.push(params);
		//add callback
		args.push( function(data){
			self.queue = self.queue.concat(data.posts);
			
			if ( data.next_page ) {
				self.nextPageToken = data.next_page;
			} else {
				self.finish();
			}
			
			self.loading.resolveWith(self, [data]);
		});
		
		apiFunc = 'get' + apiFunc;
		
		self.xhr = api()[apiFunc].apply(api(), args);
		return self.loading.promise();
	},

	resize: function() {
		var cont = jQuery('.box-hold'),
			w = jQuery(document.body).width(),
			cn = Math.round(w/320) || 1,
			cw = Math.floor((w - cn*2) / cn);

		cont.css('width', w).find('.post').css({
			width: cn==1 ? w : cw,
			'margin-bottom': 2
		});
		jQuery('#vertical-strip').length && jQuery('.post:lt('+(cn*2)+'):gt('+(cn-1)+')').css('margin-bottom', jQuery('#vertical-strip').height());
	},

	/**
	 * Render archive meta-information
	 * 
	 * @returns {String} Rendered template.
	 */
	archiveMeta: function(){
		var self = this;
		var title = (self.type!=='author')? self.name : '';
		if (self.type!=='date') {
			title = title.replace(/-/g, ' ');
		} else {
			var date = self.name.split('-');
			var year=parseInt(date[0]), month=parseInt(date[1]), day=parseInt(date[2]);
			if (year) {
				title = year;
				if (day) {
					title = day + ' ' + title;
				}
				if (month) {
					var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					var monthName = monthNames[month-1];
					if (monthName) {
						title = monthName + ' ' + title;
					}
				}
			}
		}
		title = ucfirst(title);
		
		var t = ( self.type==='index' || (self.type==='category' && self.blog==='aws') ) ?
				'archiveMetaSort' : 'archiveMeta';
			
		return tmpl().render(t, {title: title, type:self.type}, self);
	},
	/**
	 * Show meta-information for author archive
	 * 
	 * This function is called after first posts loading, because full author info comes with them.
	 * @param {Object} data Data from API.
	 */
	showAuthorMeta: function(data){
		if ( !data || !data.author ) return;
		var author = view('AuthorBlock', data.author, {template:'authorArchiveMeta', full:true});
		jQuery('#author-meta').replaceWith( author.renderView() );
	},
	/**
	 * Retrieve base URL for this archive
	 * 
	 * Returns URL with trailing slash.
	 * @returns {String} Base URL.
	 */
	baseURL: function() {
		var front, slug;
		switch (this.type) {
		case 'category':
		case 'author':
		case 'tag':
			front = this.type+'/';
			slug = this.name+'/';
			break;
		
		case 'date':
			front = '';
			slug = this.name.replace(/-/g, '/')+'/';
			break;

		case 'index':
		default:
			front = '';
			slug = '';
			break;
		}
		
		return awsL10n.homeURL + '/' + front + slug;
	},
	sortURL: function(order) {
		return this.baseURL() + order;
	},
	
	/**
	 * Smart sort posts by popularity and date
	 * 
	 * Mixes popular posts with recent.
	 * 
	 * @param {Object[]} posts Posts to be sorted, ordered by date.
	 * @returns {Object[]} Sorted posts.
	 */
	_sortPosts: function(posts){
		//break posts into two lists
		var recentNum = Math.ceil(posts.length/2);
		var recent = posts.slice(0, recentNum),
		    popular = posts.slice(recentNum);
		
		//sort popular list
		popular.sort(function(a, b){
			var aScore = a.comment_count + a.likes,
			    bScore = b.comment_count + b.likes;
			return (aScore>bScore)? -1 : ( (aScore==bScore)? 0 : 1 );
		});
		
		//finally, merge recent with popular
		var sorted = [],
		    maxLength = Math.max(recent.length, popular.length);
		for (var i=0; i<=maxLength-1; i++) {
			if (recent.hasOwnProperty(i)) {
				sorted.push(recent[i]);
			}
			if (popular.hasOwnProperty(i)) {
				sorted.push(popular[i]);
			}
		}
		
		return sorted;
	},
	/**
	 * Append posts from API
	 * 
	 * @param {String} html Rendered posts HTML.
	 * @param {Boolean} [first=false] Is this the first posts portion in the current archive?
	 * @returns {jQuery.Deferred} jQuery promise of showing animation.
	 */
	_appendPosts: function(html, first){
		var self = this, $posts = jQuery(html);
		first = first || false;
		
		//self.isMasonry is fast, matchMedia() is used for the first posts portion,
		//when Masonry is not initialized yet
		var isMasonry = self.isMasonry || (first && !isLayout('mobileNarrow'));
		var enableAds = self.type==='index' && awsL10n.adsHome && isMasonry;
		
		if (enableAds) {
			if (!window.googletag) {
				googletag = {};
				googletag.cmd = googletag.cmd || [];
				(function() {
					var gads = document.createElement('script');
					gads.async = true;
					gads.type = 'text/javascript';
					var useSSL = 'https:' == document.location.protocol;
					gads.src = (useSSL ? 'https:' : 'http:') +
					'//www.googletagservices.com/tag/js/gpt.js';
					var node = document.getElementsByTagName('script')[0];
					node.parentNode.insertBefore(gads, node);
				})();
				googletag.cmd.push(function() {
					googletag.pubads().collapseEmptyDivs();
				});
			}
			
			var adID = "archive-ad-"+Archives.adCounter;
			$posts = $posts.add('<div class="box post home-ad-container"><div id="'+adID+'" class="home-ad"></div>');
		}
		
		self.postsContainer.append($posts);
		
		if (enableAds) {
			googletag.cmd.push(function() {
				googletag.defineSlot(awsL10n.adsHomeUnit, [160, 600], adID).addService(googletag.pubads());
				googletag.enableServices();
				googletag.display(adID);
			});
			Archives.adCounter++;
		}

		var defer;
		//animate posts only when masonry is enabled
		if (isMasonry) {
			defer = self._animate($posts);
		} else {
			$posts.addClass('shown');
			
			//no animation, resolve immediately
			defer = new jQuery.Deferred();
			defer.resolve();
		}
		
		return defer.promise();
	},
	/**
	 * Animate posts one-by-one
	 * 
	 * @param {jQuery} $bricks Posts to be animated.
	 * @returns {jQuery.Deferred} jQuery promise of animation.
	 */
	_animate: function($bricks){
		var self = this, defer = new jQuery.Deferred();
		
		//queue show function with delay
		$bricks.each( function(i, el){
			self.postsContainer.queue('posts', function(next){
				jQuery(el).addClass('shown');
				next();
			} ).delay(150, 'posts');
		});
		//finally resolve deferred
		self.postsContainer.queue('posts', function(next){
			defer.resolve();
			next();
		});
		self.postsContainer.dequeue('posts'); //start/continue queue execution
		
		return defer.promise();
	},
	/**
	 * Show posts from API (first or further portions)
	 * 
	 * @param {Object[]} posts Posts from API.
	 * @param {Boolean} [first=false] Is this the first posts portion in the current archive?
	 * @returns {jQuery.Deferred} jQuery promise of showing animation.
	 */
	showPosts: function(posts, first){
		var self = this, html = '';
		first = first || false;
		
		if (first && self.type==='index' && self.orderBy==='latest') { //sort first posts by popularity
			posts = self._sortPosts(posts);
		}

		var postsCounter = this.postsCounter || 0;
		jQuery.each(posts, function(i, post){
			if (self.type!='author' && self.type!='tag') {
				if (++postsCounter == 3)
					html += self.trending.loadHtml();
				if (postsCounter%10 == 5) // 5th and every 10th after
					html += self.adv3Lift.loadHtml( Math.ceil(postsCounter/10) );
			}

			post = view('ArchivePost', post, {showCategories: self.showCategories});
			html += post.renderView();
		});
		this.postsCounter = postsCounter;
		var animating = self._appendPosts(html, first);

		if (first && postsCounter >= 3)
			self.trending.init();

		if (postsCounter >= 5)
			self.adv3Lift.loadScript(postsCounter);

		return animating;
	},
	adv3Lift: {
		loadHtml: function(counter) {
			return '<div id="adv3lift'+counter+'"></div>';
		},
		loadScript: function(postsCounter) {
			var i, el, script;
			for(i=5;i<=postsCounter;i=i+10) { // 5th and every 10th after
				el = document.getElementById('adv3lift'+Math.ceil(i/10));
				if (el && !el.innerHTML) {
					script = document.createElement('script');
					script.async = true;
					script.type = 'text/javascript';
					script.src = 'http://ib.3lift.com/ttj?inv_code=allwomenstalk_main';
					el.appendChild(script);
				}
			}
		}
	},
	/*
	 * Trending
	 */
	trending: {
		count: 5,
		campaign: '?utm_source=aws&utm_medium=Website&utm_campaign=trending',
		url: 'http://gem.allw.mn/stats/trending.php',
		storage: {
			key: 'gl',
			cache: localStorage,
			get: function() {
				var value = this.cache && this.cache.getItem(this.key);
				return value && JSON.parse(value);
			},
			set: function(value) {
				this.cache && this.cache.setItem(this.key, JSON.stringify(value));
			}
		},
		loadHtml: function() {
			return '<div id="vertical-strip" class="box">'+
						'<h2>Trending</h2>'+
						'<div class="vs-posts"></div>'+
						'<div class="loading-icon"><div class="spinner">1</div></div>'+
					'</div>';
		},
		init: function() {
			jQuery('#vertical-strip .loading-icon').show();

			this.container = jQuery('#vertical-strip .vs-posts');
			this.get();
		},
		get: function() {
			var posts = this.storage.get() || {};
			if (posts.data) {
				this.build(posts.data);
				if (posts.date != this.createDate())
					this.refresh();			// refresh data if out of date
			}
			else this.refresh('build');		// get data if not exists
		},
		refresh: function(build) {
			var self = this;
			jQuery.getJSON(this.url+'?callback=?', function(_) {
				var posts = [];
				jQuery.each(_.data, function(i, post) {
					posts.push({
						url: post.url,
						title: post.title,
						cat: post.category
					});
				});

				self.saveCache(posts);
				build && self.build(posts);
			});
		},
		build: function(posts) {
			this.container.siblings('.loading-icon').remove();
			if (posts.length) {
				var self = this;
				jQuery.each( this.prepare(posts), function(i, post) {
					var url = post.host+'/'+post.slug + self.campaign+'google';
					self.container.append(
						'<div class="vs-post">'+
							'<h2><a href="'+url+'">'+post.title+'</a></h2>'+
						'</div>'
					);
				});

				Archives.prototype.resize();
			}
		},
		prepare: function(data) {
			var self = this,
				count = 0,
				posts = [];

			jQuery.each( this.shuffle(data), function(i, post) {
				var url = document.createElement('a');
					url.href = post.url;

				post.host = 'http://'+url.hostname;
				post.slug = url.pathname.replace(/\//g, '');
				posts.push(post);

				if (++count == self.count)
					return false;
			});

			return posts;
		},
		createDate: function(days) {
			var d = new Date();

			return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
		},
		saveCache: function(posts) {
			this.storage.set({
				date: this.createDate(),
				data: posts
			});
		},
		shuffle: function(arr) {
			var temp, rand, i = arr.length;
			while(i) {
				rand = Math.floor( (i--) * Math.random() );
				temp = arr[i];
				arr[i] = arr[rand];
				arr[rand] = temp;
			}
			return arr;
		}
	}
});

AWS.ajaxControllers.Archives = Archives;
})();
