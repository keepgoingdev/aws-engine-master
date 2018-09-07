var AWS = AWS || {};
AWS.modules = AWS.modules || {};

/**
 * Comments module
 * 
 * @constructor
 * @param {String} id Post ID.
 * @param {Object} [params] Additional parameters.
 * @returns {AWS.modules.Comments}
 */
AWS.modules.Comments = function(id, params) {
	this.postID = id;
	this.sending = false;
	this.started = false;
	this.init(params);
};
jQuery.extend(AWS.modules.Comments.prototype, {
	/**
	 * Initialise the module
	 * 
	 * @param {Object} [params] Additional parameters.
	 */
	init: function(params) {
		params = params || {};
		
		this.comments = {};
		if (!this.loader) {
			this.loader = new AWS.modules.MoreLoader({
				load: $.proxy(this.load, this),
				render: $.proxy(this.render, this)
			});
			this.loader.subscribe(this);
		} else {
			this.loader.init();
		}
	},
	/**
	 * Start the module
	 * 
	 * Binds events and starts loading of comments.
	 */
	start: function() {
		var self = this,
		    $comments = $('#comments');
		
		//load more comments
		$comments.on('click', '[name="more-comments"]', function(){
			self.loader.load();
			return false;
		});
		
		//show full comment text
		$comments.on('click', '.see-more', function(){
			var $comment = $(this).closest('.comment');
			$('.ellipsis', $comment).remove();
			$('.see-more', $comment).remove();
			$('.hidden-text', $comment).removeClass('hidden');
			return false;
		});
		
		//show all replies
		$comments.on('click', '[name="all-replies"]', function(){
			var view = $(this).closest('.comment').data('view');
			
			view.appendRestReplies();
			$(this).remove();
			
			return false;
		});
		
		//like/unlike
		$comments.on('click', '[name="like-comment"]', function(){
			var $comment = $(this).closest('.comment'),
		    id = $comment.data('id'),
		    comment = self.comments[id];
		
			if (!comment) {
				//maybe this is reply, search in parent comment model
				var $parent = $comment.parent().closest('.comment');
				if ($parent.length) {
					var parent = self.comments[$parent.data('id')];
					for (var i in parent.replies) { if (!parent.replies.hasOwnProperty(i)) continue;
						if (parent.replies[i]._id.$id==id) {
							comment = parent.replies[i];
							break;
						}
					}
				}
			}
			
			if (!comment)
				return false;
			
			if (!comment.liked)
				comment.like();
			else
				comment.unlike();
			
			return false;
		});
		
		//$('#comments .comment').remove();
		self.loader.load();
		
		//create comment form with the new comment model
		var newComment = self.createNewComment();
		var commentForm = view('CommentForm', newComment);
		commentForm.appendTo($comments);
		
		//log in to comment
		$comments.on('click', '.login-link', function(){
			Auth.modal('login');
			e('Auth', ['Comments', 'login']);
			return false;
		});
		
		//submit a comment
		$comments.on('click', '[name="send-comment"]', function(){
			if (self.sending) return false;
			self.sending = true;
			var content = commentForm.$el.find('[name="comment_content"]').val();
			var sending = newComment.send(content);
			
			commentForm.disable();
			
			//immediatly display sent comment
			if (!sending.isRejected()) {
				var commentView = view('Comment', newComment),
				    $scrollTarget;
				
				if (!newComment.isReply) {
					commentView.appendTo($$('#comments-list'));
					$scrollTarget = commentView.$el;
				} else {
					//NOTE: here will be MongoID for regular comments and WordPress ID for just posted comments
					var parentId = newComment.comment_parent.$id;
					var $parent = $$('#comments-list').find('.comment[data-id="'+parentId+'"]'),
					    $replies = $parent.find('> .replies');
					commentView.prependTo($replies);
					$scrollTarget = $parent;
				}
				self.scrollTo($scrollTarget);
			}
			
			sending.done(function(){
				//store new comment if it was successfully submitted...
				if (!newComment.isReply) {
					self.comments[newComment._id.$id] = newComment;
				} else {
					self.comments[newComment.comment_parent.$id].addChild(newComment);
				}
				//... and fill comment form with new empty model
				newComment = self.createNewComment();
				commentForm.reset(newComment);
			}).fail(function(){
				//new comment view will be destroyed by the model if an error occurs
				//commentView.destroy();
			}).always(function(){
				self.sending = false;
				commentForm.enable();
				e('commentSend');
			});
			
			return false;
		});
		
		$comments.on('click', '[name="reply-comment"]', function(){
			if (self.sending) return false;
			var id = $(this).closest('.comment').data('id');
			newComment.replyTo(self.comments[id]);
			e('commentReply', [id]);
			return false;
		});
		$comments.on('click', '[name="cancel-reply"]', function(){
			if (self.sending) return false;
			newComment.cancelReply();
			return false;
		});
		
		self.started = true;
	},
	/**
	 * Re-initialise the module with new parameters
	 * 
	 * Clears comments list and starts loading again.
	 * @param {Object} [params] Additional parameters.
	 */
	reset: function(params) {
		this.init(params);
		$('#comments .comment').remove();
		this.loader.load();
	},
	/**
	 * Load next comment portion
	 * 
	 * This function is typically called from loader object.
	 * @param {Object} [query] Additional query parameters - i. e. 'next_page';
	 * @returns {jqXHR}
	 */
	load: function(query) {
		query = query || {};
		query.count = 20;
		return api().getComments(this.postID, 'latest', query);
	},
	/**
	 * Render loaded comments
	 * 
	 * This function is typically called from loader object.
	 * @param {Object} data Loaded data with comments list.
	 */
	render: function(data) {
		var self = this,
		    firstly = $.isEmptyObject(self.comments),
		    $scroller = isLayout('mobile')? $('html, body') : $$('#sidebar');
		
		if (!firstly) {
			//remember current position relative to scrolling area
			var $first = $$('#comments-list').find('> .comment:first'),
			    firstPos = $first.position().top;
		}
		
		var newComments = [];
		$.each(data.comments, function(i, comment){
			comment = model('Comment', comment);
			self.comments[comment._id.$id] = comment;
			newComments.push(comment);
			
			var commentView = view('Comment', comment);
			commentView.prependTo( $$('#comments-list') );
		});
		this.updateLikes(newComments);
		
		if (firstly) {
			//in mobile version scrolling actually will done on sidebar open
			if (!isLayout('mobile'))
				$$('#sidebar').scrollTop( $$('#sidebar').prop('scrollHeight') );
			else
				$('html, body').scrollTop($(document).height());
		} else {
			//restore position
			var offset = $scroller.scrollTop() + $first.position().top;
			$scroller.scrollTop( offset-firstPos );
		}
	},
	/**
	 * Scroll sidebar to specific comment
	 * 
	 * @param {jQuery} $target The element to which to scroll.
	 */
	scrollTo: function($target) {
		var $scroller = isLayout('mobile')? $('html, body') : $$('#sidebar'),
		    offset = $scroller.scrollTop() + $target.position().top;
		$scroller.scrollTop( offset );
	},
	/**
	 * Event handler for start of loading.
	 */
	onLoading: function() {
		$$('#more-comments').hide();
		$$('#comments .loading-icon').show();
	},
	/**
	 * Event handler for finish of loading.
	 * @param {Object} data Loaded data with comments list.
	 */
	onLoaded: function(data) {
		$$('#comments .loading-icon').hide();
		$$('#more-comments').show();
	},
	/**
	 * Event handler for the end of all comments
	 */
	onFinish: function() {
		$('#more-comments').hide();
	},
	/**
	 * Update likes counters from Voting API
	 * 
	 * @param {Aws.models.Comment[]} comments Array of comment models.
	 */
	updateLikes: function(comments) {
		var self = this,
		    ids = [],
		    checkedComments = []; //all comments and replies scheduled for check will be stored for later use
		for (var i in comments) { if (!comments.hasOwnProperty(i)) continue;
			ids.push(comments[i]._id.$id);
			checkedComments[comments[i]._id.$id] = comments[i];
			
			if (!comments[i].replies) continue;
			for (var j in comments[i].replies) { if (!comments[i].replies.hasOwnProperty(j)) continue;
				ids.push(comments[i].replies[j]._id.$id);
				checkedComments[comments[i].replies[j]._id.$id] = comments[i].replies[j];
			}
		}
		//IE9 wants it to be global variable
		commentsLikesXHR = api().getCommentLikes(ids);
		commentsLikesXHR.done( function(data){
			$.each(data.items, function(i, item){
				checkedComments[item.object.$id].setLikes(item.likes, item.liked);
			});
		});
	},
	/**
	 * Create model for a new comment
	 * 
	 * @returns {AWS.models.NewComment}
	 */
	createNewComment: function() {
		return model('NewComment', {post: {$id: this.postID}});
	}
});
