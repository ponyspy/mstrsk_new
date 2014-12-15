$(document).ready(function() {

	$('.prev').click(function() {
		$('.styles_line').animate({
			scrollLeft: '-=240',
			}, 500 );
		});

	$('.next').click(function() {
		$('.styles_line').animate({
			scrollLeft: '+=240',
			}, 500 );
	});

	$('.goto_down a').click(function() {
		scr = $('.intro_block').height();

		$('body').animate({
			scrollTop: scr,
			}, 500 );
	});

});