$(document).ready(function() {
	var count = $('.child').size();
	var eng = true;
	var event = false;
	var project = false;
	var news = false;


// ------------------------
// *** Toggles Block ***
// ------------------------


	function checkEnglish () {
		if (eng === true)
			$('.en').prop('disabled', true);
		else
			$('.en').prop('disabled', false).show();
	}

	function toggleEnglish () {
		if (eng = !eng) {
			eng = true;
			$('.en').prop('disabled', eng).hide();
			$('.ru').css('float','none');
		}
		else {
			eng = false;
			$('.en').prop('disabled', eng).show();
			$('.ru').css('float','left');
		}
	}



// ------------------------
// *** Constructors Block ***
// ------------------------


	function snakeForward () {
		var snake = $('.snake');
		snake.first().clone()
			.find('option').prop('selected', false).end()
			.insertAfter(snake.last());
	}

	function snakeBack () {
		if ($('.snake').size() == 1) return null;
		$(this).parent('.snake').remove();
	}


	$('.toggle_eng').on('click', toggleEnglish);
	$(document).on('click', '.back', snakeBack);
	$('.forward').on('click', snakeForward);


	$('form').submit(function(event) {
		var areas = $('textarea');
		areas.each(function() {
			var newValue = $(this).val().replace(/\n/g, "<br />");
			$(this).val(newValue);
		});
		$('form').submit();
	});



});