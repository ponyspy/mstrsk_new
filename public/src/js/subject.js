$(document).ready(function() {
	var map = L.map('subject_view').setView([0, 0], 3);

	var path = $('.subject_map').attr('path');

	L.tileLayer('/images/subjects/' + path + '/tiles/{z}/image_tile_{y}_{x}.jpg', {
		minZoom: 1,
		maxZoom: 4,
		attribution: '',
		tileSize: '256',
		tms: false,
		continuousWorld: true
	}).addTo(map);
});