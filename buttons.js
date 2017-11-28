/////////////////////////////////////////////
 function InfoBox() {
	// here we create the info box at the upper right corner
	// where information of the running processes will
	// be reported

    var info = L.control();
    info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
          //this.update();
			this._div.id = "info"; // and id="info"
          return this._div;
        };
    info.addTo(mymap);

    $("#info").append("Info box:<br>");

	$('#info').hover(function() {
			$(this).css("background", "rgba(250,250,250,0.6)");
	}, function() {
			$(this).css("background", "rgba(167,167,167,0.6)");
	});

	$('#info').click( function() {
		$(this).html("");
	});
}


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

/////////////////////////////////////////////
function logoCSH() {

  $('.leaflet-top.leaflet-left')
        .append('<img id="csh_logo" width="200px" src="./img/CSH_Logo.png"/>');

}
