$(document).ready(function() {
	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			$.post('/search', {search: result}).done(function(data) {
				$('.objects_context, .architects_context, .subjects_context').hide().children('.context_results_block').empty();

				data.objects.forEach(function(object) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/objects/' + object._id, 'text': object.title[0].value});
					$('.objects_context').show().children('.context_results_block').append(context_result);
				});

				data.architects.forEach(function(architect) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/architects/' + architect._id, 'text': architect.name[0].value});
					$('.architects_context').show().children('.context_results_block').append(context_result);
				});

				data.subjects.forEach(function(subject) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/subjects/' + subject._id, 'text': subject.title[0].value});
					$('.subjects_context').show().children('.context_results_block').append(context_result);
				});
			});
		}
	};

	$('.search_field')
	.on('keyup change', function(event) {
		search.val = $(this).val();
	})
	.on('focusin', function(event) {
		search.interval = setInterval(function() {
			search.checkResult.call(search);
		}, 1000);
	})
	.on('focusout', function(event) {
		clearInterval(search.interval);
	});


	function toggleSearch() {
		$('.content_title_block').hide();
		$('.content_search_block').show();
		$('.search_field').focus();
	}

	function hideSearch() {
		$('.content_title_block').show();
		$('.content_search_block').hide();
	}

	$('.menu_item.search').on('click', toggleSearch);
	// $(document).keydown(function(event) {
	// 	toggleSearch()
	// 	event.which == 27
	// 		? hideSearch()
	// 		: false
	// });

	$('.search_title').click(function(event) {
		$('.objects_context, .architects_context, .subjects_context').hide().children('.context_results_block').empty();
		$('.search_field').val('').focus();
	});


	$('.header_logo').on('click', function() {
		$(this).data('clicked', !$(this).data('clicked'));

		if ($(this).data('clicked')) {
			$('.menu_navigate_block').show();
			$('.navigate_style_progress').css('opacity', 0);
		}
		else {
			$('.menu_navigate_block').hide();
		}
	});


	$(document).on('mouseup touchstart', function (event) {
		var container = $('.content_search_block, .menu_navigate_block');

		if (!container.is(event.target)
			&& container.has(event.target).length === 0)
		{
				container.hide();
				$('.content_title_block').show();
				$('.navigate_style_progress').css('opacity', 1);
				$('.header_logo').data('clicked', false);
		}
	});
});