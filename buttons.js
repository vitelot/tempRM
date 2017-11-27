/////////////////////////////////////////////
function docInfos() {
	var info = L.control({ position: 'bottomleft' });

	info.onAdd = function (map) {
    	this._div = L.DomUtil.create('div', 'doc_info'); // create a div with a class "info"
    	this._div.id = "doc_info";
    	return this._div;
	};

	info.addTo(mymap);
	$('.doc_info').prepend('\
		Mouse-over doctor to display information.<br />\
		Doctor sizes represent the number of patients visited per quarter;<br />\
		Doctor colors represent the average number of displacements each<br />\
		patient must undergo to find a new available doctor.<br />\
		BLUE: Low average displacements;<br />\
		RED: High average displacements.<br />\
		<b>DOCTOR POSITION IS FIXED AT RANDOM</b>');
}
