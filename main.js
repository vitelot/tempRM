function main() {
  Initmap();

  DrawLand();

  InfoBox();
  docInfos();

  Plot();

//    runningSim();
}

function Initmap() {

  	// set up the map
  	mymap = new L.Map('mapid');

    //create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    //var osmUrl='http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
  	//var osmUrl='http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';

  	var osmAttrib='Complexity Science Hub Vienna | Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  	var osm = new L.TileLayer(osmUrl, {minZoom: 7, maxZoom: 11, attribution: osmAttrib});

  	// start the map in Austria
    //mymap.setView(new L.LatLng(47.488, 12.881),7); // whole Austria
    mymap.setView(new L.LatLng(47.1666, 13.000),7);
  	mymap.addLayer(osm);

    mymap.doubleClickZoom.disable();


    mymap.on('zoomend', function(e) {
      let i;
        if(mymap.getZoom()>=11) {
          for(i in circle_list) {
            var c = circle_list[i];
            c.setRadius(getRadiusFromPatNum(c.doc.mean_pat_num)/6);
          }
        } else if (mymap.getZoom()==10) {
          for(i in circle_list) {
            var c = circle_list[i];
            c.setRadius(getRadiusFromPatNum(c.doc.mean_pat_num));
          }
        }
    });

}

function DrawLand() {
    var bc = {};

    $.getJSON("./data/Austria.geojson", function(bc) {

      function setStyle(feature) {
        return {
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.5,
          fillColor: getRandomColor()
        };
      }

      geojson =
        L.geoJson(bc, {
            style: setStyle
            //onEachFeature: onEachFeature
        }).addTo(mymap);

        DrawDoctors();
    });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function DrawDoctors() {

  var docs = [];
  let i;

    $.getJSON("./data/doctors_new.json", function(docs) {
      var max = 0;
      for(i in docs) {
          let disp = parseFloat(docs[i].mean_disp);
          if(max<disp) max = disp;
      }
      disp_max = max;

      for(i in docs) {
        var doctor = docs[i];
        var circle = L.circle([doctor.lat, doctor.lng], {
            color: 'Null',
            fillColor: getColorFromDisp(doctor.mean_disp),
            fillOpacity: 0.8,
            radius: getRadiusFromPatNum(doctor.mean_pat_num)
        }).addTo(mymap);

        circle.doc = doctor;
        circle_list[doctor.docid] = circle;

        circle.bindPopup(
            "<p class=\"circlepopup\">"+
            "      Id: "+doctor.docid.toString()+
            "<br />Land: "+doctor.land_name.toString()+
            "<br />Patients:"+
            " "+Math.round(doctor.mean_pat_num).toString()+
            "<br />Displacement:"+
            " "+Math.round(doctor.mean_disp).toString()+
            "</p>"
        );
        circle.on('mouseover', function (e) {
              let zoom = mymap.getZoom();
              // if(zoom < 12) {
              //   this.setRadius(5000);
              // } else {
              //   this.setRadius(2000);
              // }
              // this.setRadius(1000 - (zoom-13)*(9000/7));
              this.setRadius(360000/(zoom*zoom));
              this.setStyle( {
                fillOpacity: 0.5,
                color: 'black'
              })
              this.openPopup();
          });
        circle.on('mouseout', function (e) {
              if(mymap.getZoom()>=11) {
                this.setRadius(getRadiusFromPatNum(this.doc.mean_pat_num)/6);
              } else {
                this.setRadius(getRadiusFromPatNum(this.doc.mean_pat_num));                
              }
              this.setStyle( {
                fillOpacity: 0.8,
                color: 'Null'
              })
              this.closePopup();
        });
        circle.on('click', function (e) {
              // var zoom = mymap.getZoom();
              let doctor = this.doc; // recalls a global var

              if(e.originalEvent.altKey || e.originalEvent.shiftKey) {
                RemoveDoctor(doctor.docid);
                return;
              } else {
                $('#info').html(
                  //"<p>"+
                  "Id:"+doctor.docid.toString()+"<br>"+
                  "BZ:"+doctor.district_name.toString()+"<br>"+
                  "Activity:"+Math.floor(doctor.mean_pat_num).toString()+"<br>"
                  //+"</p>"
                );
              }

              this.setStyle( {
                fillOpacity: 0.5,
                color: 'white'
              })

          });
        circle.on('dblclick', function (e) {

                RemoveDoctor(this.doc.docid);

          });

      }

    });
}

function RemoveDoctor(docid) {
// this function is triggered when a doctor is removed
// i.e. when SHIFT-click or ALT-click is pressed
// docid: the id of the doctor to be removed

  let doctor = circle_list[docid].doc;
  let model = {
    p1: doctor.p1,
    p2: doctor.p2,
    q1: doctor.q1
  };

  feedPlot(model);

  setTimeout(KillCircle, 200, circle_list[docid]);
}



function KillCircle(circle) {

  printInfo(
      //"<p>"+
      "Removing doctor with "+
      "Id="+circle.doc.docid.toString()+"<br>"
      //+"</p>"
  );

  delete circle_list[circle.doc.docid];
  mymap.removeLayer(circle);

}

function printInfo(text) {
  $('#info').prepend(text);
}

function getColorFromFG(fg) {
        //var number = (Math.floor(1e7*Math.tan(fg*1.5))%parseInt('FFFFFF',16)).toString(16);
        var number = parseInt(fg);
        //console.log(number);
        var color;
        switch(number) {
          case 1:
          case 7:
          case 8:
          case 47:
          case 48: color = '#FFAA00'; break; // primary doctors
          case 59:
          case 60: color = '#FF00FF'; break; // farmacies
          case 50:
          case 51:
          case 52:
          case 55: color = '#0000FF'; break; // Labs
          default: color = '#00FFFF'; break;
        }

        //var color = '#'+number;
        return color;
}

function getColorFromDisp(d) {
  var huemax = 240;
  var huemin = 0;
  var number = parseFloat(d);
  var hue = Math.floor(huemin+(huemax-huemin)*(1.0-d/disp_max));
  return "hsl("+hue+",100%,50%)";

}

function getRadiusFromPatNum(d) {
  let val = 50*Math.sqrt(d);
  // let val = 200*Math.log(1.1+d);
  return (val>3000)? 3000: val;
}
