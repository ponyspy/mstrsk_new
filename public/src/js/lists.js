$(document).ready(function() {
	function remove(event) {
		var id  = $(this).attr('id');

		if (confirm(event.data.description)) {
			$.post(event.data.path, {'id': id}).done(function() {
				location.reload();
			});
		}
	}

	function tiles_gen(event) {
		var $this = $(this);
		var id  = $this.attr('id');

		$this.off().removeClass('ok');
		$.post('/tiles_gen', {subject_id: id}).done(function(result) {
			$this.addClass('ok').on('click', tiles_gen);
		});
	}

	$('.rm_event').on('click', {path: '/rm_event', description: 'Удалить событие?'}, remove);
	$('.rm_partner').on('click', {path: '/rm_partner', description: 'Удалить партнера?'}, remove);
	$('.rm_member').on('click', {path:'/rm_member', description:'Удалить?\n\nУчастник будет удален из всех событий!'}, remove);
	$('.rm_news').on('click', {path:'/rm_news', description: 'Удалить новость?'}, remove);
	$('.rm_schedule').on('click', {path: '/rm_schedule', description: 'Удалить?'}, remove);
	$('.rm_press').on('click', {path: '/rm_press', description: 'Удалить источник?\n\nИсточник будет удален из всех событий!'}, remove);
	$('.rm_photo').on('click', {path: '/rm_photo', description: 'Удалить фотографию?'}, remove);
	$('.rm_project').on('click', {path: '/rm_project', description: 'Удалить спецпроект?'}, remove);

	$('.tiles_gen').on('click', tiles_gen);

	$('.ages_all').click(function(event) {
		$('.object').show();
	});

	$('.age_navigate_title, .sub_item').click(function(event) {
		var sort = $(this).attr('id');

		$('.object').show().not('.' + sort).hide();
	});

	$('.option').click(function(event) {
		var option = $(this).attr('class').split(' ')[1];

		$('.object').show().not(':has(.' + option + ')').hide();
	});
});