$(document).ready(function() {
	var subjectsGroup;
	var map;
	var oldLayer;

	function UnityLoader (path) {
		var config = {
			width: '100%',
			height: '100%',
			params: {
				enableDebugging: '0',
				disableContextMenu: true
			}
		};

		var u = new UnityObject2(config);

		var $missingScreen = $('#unityPlayer').find('.missing');
		var $brokenScreen = $('#unityPlayer').find('.broken');

		$missingScreen.hide();
		$brokenScreen.hide();

		u.observeProgress(function (progress) {
			switch(progress.pluginStatus) {
				case 'broken':
					$brokenScreen.find('a').click(function (e) {
						e.stopPropagation();
						e.preventDefault();
						u.installPlugin();
						return false;
					});
					$brokenScreen.show();
				break;
				case 'missing':
					$missingScreen.find('a').click(function (e) {
						e.stopPropagation();
						e.preventDefault();
						u.installPlugin();
						return false;
					});
					$missingScreen.show();
				break;
				case 'installed':
					$missingScreen.remove();
				break;
				case 'first':
				break;
			}
		});

		u.initPlugin($('#unityPlayer')[0], path);
	}

	$('.object_navigate.models').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.models_slide').show();
	});


	$('.object_navigate.description').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.object_description_block').show();
	});

	$('.object_navigate.images').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.images_slide').show();
	});

	$('.object_navigate.subjects').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.subjects_slide').show();

		subjectsGroup = L.layerGroup();

		$('.object_slide_item.subjects').each(function() {
			var path = $(this).attr('path');

			var layer = L.tileLayer('/images/subjects/' + path + '/tiles/{z}/image_tile_{y}_{x}.jpg', {
				minZoom: 1,
				maxZoom: 4,
				attribution: '',
				tileSize: '256',
				tms: false,
				continuousWorld: true
			});

			layer._leaflet_id = path;
			subjectsGroup.addLayer(layer);
		});
	});

	$('.object_slide_item.subjects').on('click', function(event) {
		$('.object_images_block, .object_3d_block').hide();
		$('.object_subjects_block').show();
		$('.subjects_slide').hide();
		$('.object_navigate').removeClass('current');
		$('.description_item.images').hide();

		var index = $(this).index();
		$('.description_item.subjects').hide().eq(index).show();

		var path = $(this).attr('path');
		var currentLayer = subjectsGroup.getLayer(path);

		if (map === undefined) {
			map = L.map('subjects_view').setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}
		else {
			map.removeLayer(oldLayer).setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}

	});

	$('.object_slide_item.models').on('click', function(event) {
		$('.object_images_block, .object_subjects_block').hide();
		$('.object_3d_block').show();
		$('.subjects_slide').hide();
		$('.object_navigate').removeClass('current');

		var path = $(this).attr('path');
		UnityLoader(path);

	});


	$('.images_navigate_block_next').on('click', function(event) {
		var index = $(this).parents('.object_image').index();
		var length = $('.object_image').length - 1;

		if (index != length) {
			$(this).parents('.object_image').hide().next().show();
			$('.description_item.images').eq(index).hide().next().show();
		}
		else {
			$('.object_image').hide().eq(0).show();
			$('.description_item.images').hide().eq(0).show();
		}

	});


	$('.images_navigate_block_prev').on('click', function(event) {
		var index = $(this).parents('.object_image').index();

		if (index !== 0) {
			$(this).parents('.object_image').hide().prev().show();
			$('.description_item.images').eq(index).hide().prev().show();
		}
		else {
			$('.object_image').hide().last().show();
			$('.description_item.images').hide().last().show();
		}

	});


	$('.object_slide_item.images').on('click', function(event) {
		var index = $(this).index();
		$('.object_images_block').show();
		$('.object_subjects_block, .object_3d_block').hide();
		$('.images_slide').hide();
		$('.object_navigate').removeClass('current');
		$('.object_image').hide().eq(index).show();
		$('.description_item.subjects').hide();
		$('.description_item.images').hide().eq(index).show();
	});

	$('span.show').click(function(event) {
		$(this).hide();
		$('span.hide').show();
	});

	$(document).on('mouseup touchstart', function (event) {
		var container = $('.object_description_block, .images_slide, .subjects_slide, .models_slide');

		if (!container.is(event.target)
			&& container.has(event.target).length === 0)
		{
				container.hide();
				$('.object_navigate').removeClass('current');
		}
	});
});