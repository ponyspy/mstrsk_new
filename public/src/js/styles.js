$(document).ready(function() {
	$('.age_block').data({skip: 0});

	$.fn.scrollStopped = function(callback) {
		$(this).on('scroll', function() {
			var self = this, $this = $(self);

			$this.data('scrollTimeout')
				? clearTimeout($this.data('scrollTimeout'))
				: false;

			$this.data('scrollTimeout', setTimeout(callback, 250, self));
		});
	};


	function ageLoader (event, limit) {
		$(this).find('.age_block').each(function() {
			var $this = $(this);
			var outer_offset_top = $('.styles_block').offset().top;
			var outer_offset_bottom = $('.styles_block').height();
			var age_offset_top = $this.offset().top;
			var age_offset_bottom = age_offset_top + $this.height();


			if (age_offset_top <= outer_offset_top + 115) {
				var skip = $this.data('skip');
				var lim = limit || event.data.limit;

				var objects = $this.children('.age_objects').children('.object_block').slice(skip, skip + lim);

				objects.each(function(index, el) {
					if (skip == 'out') return true;

					var image = $(this).attr('image_path');
					$(this).css('background-image', 'url(' + image + ')');

					objects.length === 0
						? $this.data({skip: 'out'})
						: $this.data({skip: skip + lim});
				});

			}
		});
	}


	function ageScroll (event) {
		var scroll_percentage = 100 * $(this).scrollTop() / ($(this).find('.style_inner_height').height() - $(this).height());

		$(this).data({scroll_position: $(this).scrollTop()});

		$('.navigate_style_block').eq(event.data.style_index).find('.navigate_style_progress').addClass('on_scroll').css('width', scroll_percentage + '%');

		$(this).find('.age_block').each(function() {
			var $this = $(this);
			var outer_offset_bottom = $('.styles_block').height();
			var age_offset_top = $this.offset().top;


			age_offset_top <= outer_offset_bottom
				? $('.navigate_style_ages')
					.eq(event.data.style_index).find('.navigate_age').removeClass('current')
					.eq($this.index() - $this.length - 1).addClass('current')
				: false;
		});
	}

	function stylesSlide (event) {
		var style_id = window.location.hash.replace('#','.');
		var style_index = window.location.hash === '' ? 0 : $(style_id).index();

		$('.navigate_style_title').removeClass('current').eq(style_index).addClass('current');
		$('.navigate_style_ages').hide().eq(style_index).show();
		$('.style_block_inner')
			.off('scroll', ageScroll)
			.off('scroll', ageLoader)
			.eq(style_index)
				.on('scroll', {style_index: style_index}, ageScroll)
				.on('scroll', {limit: 5}, ageLoader).trigger('scroll', [15]);
		$style_inner = $('.style_block_inner').eq(style_index);


		$style_inner.scrollStopped(function() {
				$('.navigate_style_progress').removeClass('on_scroll');
				history.pushState({scroll_position: $style_inner.scrollTop()});
		});


		if (!$(style_id).data('loaded')) {
			$.ajax({
				url: '/styles/get_objects',
				type: 'POST',
				dataType: 'json',
				data: {style_id: style_id.replace('.', '')},
				async: false
			}).done(function(objects) {

				$(style_id).data({'loaded': true});

				objects.forEach(function(object) {
					var start = new Date(object.meta.interval.start);
					var end = new Date(object.meta.interval.end);
					start = start.getUTCFullYear();
					end = end.getUTCFullYear();

					var image_thumb = object.images.length > 0 ? object.images[0].thumb : '';

					var object_block = $('<a/>', {'href': '/objects/' + object._id, 'class': 'object_block', 'image_path':  image_thumb });
					var object_description = $('<div/>', {'class': 'object_description'});
					var object_description_inner = $('<div/>', {'class': 'object_description_inner'});
					var object_title = $('<div/>', {'class': 'object_title', 'text': object.title[0].value});
					var object_date= $('<div/>', {'class': 'object_date', 'text': start + ' - ' + end});

					var obj = object_block.append(object_description.append(object_description_inner.append(object_title, object_date)));
					var object_ages = object.ages.sub.map(function(age) {
						return '#' + age;
					}).join(', ');

					$(object_ages).children('.age_objects').append(obj);
				});
			});
		}


		$style_inner.scrollTop(0).animate({
			'scrollTop': history.state ? history.state.scroll_position : $style_inner.data('scroll_position')
		}, 400);
		$('.styles_block').animate({
			'scrollLeft': style_index * $('.styles_block').width()
		}, 400);
	}

	$(window).on('hashchange', stylesSlide).trigger('hashchange');

	$('.navigate_age').on('click', function(event) {
		var age_index = $(this).index();
		var style_index = $(this).closest('.navigate_style_block').index();
		var $style = $('.style_block_inner').eq(style_index);
		var age_offset_top = $style.find('.age_block').eq(age_index).offset().top;
		var style_scroll_top = $style.scrollTop();
		var style_offset_top = $style.offset().top;

		$style.animate({
			'scrollTop': age_offset_top + style_scroll_top - style_offset_top
		}, 300);
	});

	$('.navigate_style_title').on('click', function(event) {
		var $this = $(this);
		var style_index = $this.index('.navigate_style_title');
		var style_id = $this.closest('.navigate_style_block').attr('class').split(' ')[1];
		var width = $this.width();
		var styles_length = $('.navigate_style_title').length;

		style_index >= Math.round(styles_length / 2)
			? $('.navigate_styles_block').animate({
				'scrollLeft': '+=' + width
			}, 300)
			: $('.navigate_styles_block').animate({
				'scrollLeft': '-=' + width
			}, 300);

		window.location.hash = style_id;
		$('.navigate_style_ages').hide().eq(style_index).show();
	});

	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$('.style_block').swipe({
			swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
				switch (direction) {
					case 'left':
						var style_id = $(this).next().attr('class').split(' ')[1];
						var style_index = $(this).next().index();
					break;
					case 'right':
						var style_id = $(this).prev().attr('class').split(' ')[1];
						var style_index = $(this).prev().index();
					break;
				}

				window.location.hash = style_id;
				$('.navigate_style_ages').hide().eq(style_index).show();
			},

			 threshold: 60
		});
	}

});