$(document).ready(function() {
	$('.form_description').popline({disable:['color']});
	$('.form_images_second').sortable({placeholder: 'column_placeholder', cancel: '.image_second_description'});


	$(document).on('dblclick', '.image_second_preview', function() {
		$(this).remove();
	});


	$('.ages').hide().eq(0).show().children('input').attr('disabled', false);
	$('.era').change(function() {
		var index = $(this).children('option:selected').index();
	  $('.ages').hide().eq(index).show();
	  $('.ages').children('input').attr('disabled', true);
	  $('.ages').eq(index).children('input').attr('disabled', false);
	});



	$('.form_image_main').filedrop({
		url: '/preview',
		paramname: 'image',
		fallback_id: 'image_main_fallback',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		allowedfileextensions: ['.jpg','.jpeg','.png','.gif'],
		maxfiles: 1,
		maxfilesize: 8,
		dragOver: function() {
			$(this).css('outline', '2px solid red');
		},
		dragLeave: function() {
			$(this).css('outline', 'none');
		},
		uploadStarted: function(i, file, len) {

		},
		uploadFinished: function(i, file, response, time) {
			$('.form_image_main').css('background-image','url(' + response + ')');
			$('.form_image_main').attr('path', response);
			console.log(response);
		},
		progressUpdated: function(i, file, progress) {

		},
		afterAll: function() {
			$('.form_image_main').css('outline', 'none');
		}
	});



	$('.form_images_second').filedrop({
		url: '/preview',
		paramname: 'image',
		// fallback_id: 'images_second_fallback',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		allowedfileextensions: ['.jpg','.jpeg','.png','.gif'],
		maxfiles: 5,
		maxfilesize: 8,
		dragOver: function() {
			$(this).css('outline', '2px solid red');
		},
		dragLeave: function() {
			$(this).css('outline', 'none');
		},
		uploadStarted: function(i, file, len) {

		},
		uploadFinished: function(i, file, response, time) {
			var image = $('<div />', {'class': 'image_second_preview', 'path': response, 'style': 'background-image:url(' + response + ')'});
			var description = $('<div />', {'class': 'image_second_description', 'contenteditable': true, 'text':'Описание'});
			$('.form_images_second').append(image.append(description));
			console.log(response);
		},
		progressUpdated: function(i, file, progress) {

		},
		afterAll: function() {
			$('.form_images_second').css('outline', 'none');
		}
	});


	$('.submit').click(function(event) {
		var images_second_upload = [];
		// var old = $('.form_old').is(':checked') ? true : false;

		var title = $('.form_title').html();
		var description = $('.form_description').html();

		var category = $('.form_category').val();

		var adress = $('.form_adress').val();
		var interval_start = $('.interval_start').val();
		var interval_end = $('.interval_end').val();

		var era = $('.era').val();
		var ages_submit = [];
		var ages = $('.age').filter(':checked').each(function() {
			var age = $(this).val();
			ages_submit.push(age);
		});

		var images_main = $('.form_image_main').attr('path');
		var images_second = $('.image_second_preview');


		images_second.each(function(index, el) {
			images_second_upload.push({
				path: $(this).attr('path'),
				description: $(this).children('.image_second_description').text()
			});
		});

		var images = {
			main: images_main,
			second: images_second_upload
		};

		var ru = {
			title: title,
			description: description
		};

		var history = {
			era: era,
			ages: ages_submit
		};

		var meta = {
			interval: {
				start: interval_start,
				end: interval_end
			},
			adress: {
				ru: adress
			}
		};

		$.post('', {
			ru: ru,
			meta: meta,
			history: history,
			images: images,
			// category: category
		}).done(function(object) {
			window.location.reload();
		});
	});
});