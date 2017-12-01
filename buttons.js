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
    Systemic risk map of health care in Austria.<br />\
    For each primary health care provider (HCP)<br/>\
    we study how an assumed inoperability of the HCP affects<br/>\
    the remaining health care system.<br/>\
    Each circle represents an HCP.<br/>  \
    The size of the circle indicates the number of treated patients per quarter.<br/>\
    The color of the circles indicate for how long health care is inaccessible for patients of the local HCP.<br/>\
		Mouse-over a primary health-care provider to display information.<br />\
		Circle size represents the number of patients visited per quarter.<br />\
		Circle color represents the average number of displacements each<br />\
		patient must undergo to find a new available doctor.<br />\
		BLUE: short/low reduction of accessibility <br />\
		RED: long/severe reduction of accessibilty<br />\
    <b> Scenario creation: <b/>\
    Double click on a HCP to create a scenario where this HCP becomes inactive. The impact on the remaining health care system can be observed in  the dynamic graph to the bottom right.<br/> \
    There time progresses on the x-axis (in days). The y-axis shows the percentage of patients in the given district with immediate access to a HCP, which defines the Resilience Indicator Level (RIL).<br/>\
    to remove health-care provider. Observe the drop in<br />\
		the percentage of patients being cared for in bottom right graph.<br />\
		<b>HEALTH-CARE PROVIDERS IS FIXED AT RANDOM WITHIN SAME LAND</b>');
}

/////////////////////////////////////////////
function logoCSH() {

  $('.leaflet-top.leaflet-left')
        .append('<img id="csh_logo" height="50px" src="./img/CSH_Logo.png"/>')
        .append('<img id="csh_logo" height="50px" src="./img/LogoSM.png"/>');

}
