$(document).ready(function() {
	var eng = true;


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


	$('.sub').hide().eq(0).show().children('input').attr('disabled', false);
	$('.glob').change(function() {
		var index = $(this).children('option:selected').index();
	  $('.sub').hide().eq(index).show();
	  $('.sub').children('input').attr('disabled', true);
	  $('.sub').eq(index).children('input').attr('disabled', false);
	});


	function snakeForward () {
		var snake = $(this).closest('.snake').children('select');
		snake.first().clone()
			.find('option').prop('selected', false).end()
			.insertAfter(snake.last());
	}

	function snakeBack () {
		var snake = $(this).closest('.snake').children('select');
		if (snake.size() == 1) return null;
		snake.last().remove();
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