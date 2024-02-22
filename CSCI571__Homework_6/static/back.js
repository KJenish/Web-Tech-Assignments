function hidebox() {

  var x = document.getElementById('location');
  if (x.style.display == 'none') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }
  const checkbox = document.getElementById("auto_location");
  const textbox = document.getElementById("location");

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      textbox.removeAttribute("required");
    } else {
      textbox.setAttribute("required", "");
    }
  });
}


async function callss(keyword, distance, segmentid, lat, lng) {
  //axios.get(`/my-python-endpoint?param1=${keyword}&param2=${distance}`)
  url = "/my-python-endpoint?param1=" + keyword + "&param2=" + distance + "&param3=" + segmentid + "&param4=" + lat + "&param5=" + lng;
  //console.log("Helloooo");
  axios.get(url)
    .then(response => response.data)
    .then(data => {

      // if(response.status === 404){
      //   console.log('The resource was not found.');
      // }
      document.getElementById('table-container').style.display = 'block';

      document.getElementById('table-container').innerHTML = "";
     // console.log(data)
      var x = document.getElementById('table-container');
      x.classList.add('table_setar');
      const table = document.createElement('table');
      //table.setAttribute("id", "sort_table");
      table.style.border = '1px solid black';
      table.style.borderCollapse = 'collapse';
      table.style.backgroundColor = 'white';
      table.style.marginTop = '20px';
      table.style.width = '1200px';
      table.style.marginLeft = 'auto';
      table.style.marginRight = 'auto';
      table.style.textAlign = 'center'
      // table.style.border = '1px solid black';



      // create the table headers
      // const headers = ['Date', 'Icon', 'Event', 'Genre', 'Venue'];
      // const headerRow = table.insertRow();
      // //headers.style.border = '1px solid black';
      // headers.forEach(header => {
      //   const th = document.createElement('th');
      //   th.style.border ='1px solid black';
      //   th.textContent = header;
      //   headerRow.appendChild(th);
      // });
      // const table = document.createElement('table');
      // table.style.border = '1px solid black';
      // table.style.borderCollapse = 'collapse'; // add border collapse

      // create the table headers
      const headerRow = table.insertRow();
      headerRow.style.boxShadow = "0px 5px 5px rgba(0, 0, 0, 0.2)";
      const dateHeader = document.createElement('th');
      dateHeader.textContent = 'Date';
      dateHeader.style.border = '1px solid black'; // add border to header cell
      headerRow.appendChild(dateHeader);


      const iconHeader = document.createElement('th');
      iconHeader.textContent = 'Icon';
      iconHeader.style.border = '1px solid black'; // add border to header cell
      iconHeader.style.width = '50px' // add border to header cell
      iconHeader.style.height = '50px' // add border to header cell

      headerRow.appendChild(iconHeader);

      const eventHeader = document.createElement('th');
      eventHeader.textContent = 'Event';
      eventHeader.style.border = '1px solid black'; // add border to header cell
      eventHeader.className = "hov";
      headerRow.appendChild(eventHeader);
      eventHeader.addEventListener('click', async function () {
        await sortTable(2);
      });

      const genreHeader = document.createElement('th');
      genreHeader.textContent = 'Genre';
      genreHeader.className = "hov";
      genreHeader.style.border = '1px solid black'; // add border to header cell
      headerRow.appendChild(genreHeader);
      genreHeader.addEventListener('click', async function () {
        await sortTable(3);
      });

      const venueHeader = document.createElement('th');
      venueHeader.textContent = 'Venue';
      venueHeader.className = "hov";
      venueHeader.style.border = '1px solid black'; // add border to header cell
      headerRow.appendChild(venueHeader);
      venueHeader.addEventListener('click', async function () {
        await sortTable(4);
      });

      async function sortTable(n) {
        var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;

        switching = true;
        //Set the sorting direction to ascending:
        dir = "asc";
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
          //start by saying: no switching is done:
          switching = false;
          rows = table.rows;
          /*Loop through all table rows (except the
          first, which contains table headers):*/
          for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            } else if (dir == "desc") {
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }
          }
          if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
          } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
            }
          }
        }
      }



      // create the table rows using the data from the response
      data.forEach(rowData => {

        const row = table.insertRow();
        row.style.border = '1px solid black';

        const dateCell = row.insertCell();
        dateCell.textContent = rowData[0];
        //dateCell.style.border = '1px solid black';
        dateCell.style.padding = '20px 30px 20px 30px';
        dateCell.style.width = '120px';
        dateCell.style.display = 'inline-block';
        dateCell.style.outline = 'none';


        const iconCell = row.insertCell();
        //const icon = document.createElement('img');
        iconCell.style.border = '1px solid black';
        iconCell.style.width = '150px';
        iconCell.style.height = '40px';
        iconCell.style.padding = '5px 15px 5px 15px';
        const iconImage = document.createElement('img');
        iconImage.src = rowData[1];
        iconImage.style.width = '80px'; // add fixed width to image element
        iconImage.style.height = '50px'; // add fixed height to image element
        iconCell.appendChild(iconImage);
        //console.log(rowData[5]);
        var id_value = rowData[5];
        const eventCell = row.insertCell();
        const textContent = document.createElement("span");
        textContent.textContent = rowData[2];
        textContent.className = "hoverable";
        eventCell.style.border = '1px solid black';
        eventCell.appendChild(textContent);


        //eventCell.setAttribute('onclick',geteventdata(id_value))
        eventCell.addEventListener('click', async function () {
          document.getElementById('venue_address').style.display = "none";
          document.getElementById('venue_detail').style.display = "block";
          await geteventdata(id_value);
          //await getvenuedata(id_value);
        });

        const genreCell = row.insertCell();
        genreCell.textContent = rowData[3];
        genreCell.style.border = '1px solid black';
        genreCell.style.width = "120px"


        const venueCell = row.insertCell();
        venueCell.textContent = rowData[4];
        venueCell.style.border = '1px solid black';

      });

      // append the table to a container element in the HTML document
      const container = document.getElementById('table-container');
      container.appendChild(table);
      document.getElementById("table-container").scrollIntoView({ behavior: "smooth" });
    })
    .catch(error => {
      if (error.response.status === 404) {


        document.getElementById('table-container').innerHTML = "";
        document.getElementById('venue_address').style.display = "none";
        document.getElementById('event_list').style.display = "none";

        var txt = "<p class='error_msj'>No Records Found</p>"
        document.getElementById('table-container').innerHTML = txt;

        // console.log('The requested resource was not found.');
      }

      else {
        console.error('An error occurred while fetching the resource.', error);
      }
    });
}


async function auto_loc() {
  event.preventDefault()
  let arr;
  var response = await fetch("https://ipinfo.io/json?token=9611e33e821242")
  var data = await response.json();

  //console.log("hiiiiiiiiii",data);
  //var ip = jsonResponse.ip;
  var cord = String(data.loc).split(',');
  var floatNumber1 = parseFloat(cord[0]);
  let lat = parseFloat(floatNumber1.toFixed(4));
  var floatNumber2 = parseFloat(cord[1]);
  var lng = parseFloat(floatNumber2.toFixed(4));
  //var lat =37.7749;
  //var long =-122.4194;
  //var city = jsonResponse.city;
  // console.log("hiii22222222",lat, lng);
  arr = new Array(lat, lng);

  //console.log(geohash);

  //console.log(arr);
  return arr;
}

async function getformdata(form) {
  event.preventDefault()

  var keyword1 = document.getElementById('keyword');
  var location1 = document.getElementById('location');

  var auto_location = document.querySelector('#auto_location').checked;

  const keywordIsValid = keyword1.checkValidity();
  const locationIsValid = location1.checkValidity();


  if (!keywordIsValid || !locationIsValid) {
    location1.reportValidity();
    keyword1.reportValidity();

    return;
  }
  var keyword = document.getElementById('keyword').value;
  var location = document.getElementById('location').value;
  var distance = document.getElementById('distance').value;
  console.log(distance)
  if (distance == "") {
    distance = 10;
  }
  var category = document.getElementById('category').value;
  var auto_location = document.querySelector('#auto_location').checked;
  var lat, lng, arr, segmentid;
  if (category == "Music") { segmentid = "KZFzniwnSyZfZ7v7nJ" }
  else if (category == "Sports") { segmentid = "KZFzniwnSyZfZ7v7nE" }
  else if (category == "Arts & Theatre") { segmentid = "KZFzniwnSyZfZ7v7na" }
  else if (category == "Film") { segmentid = "KZFzniwnSyZfZ7v7nn" }
  else if (category == "Miscellaneous") { segmentid = "KZFzniwnSyZfZ7v7n1" }
  else { segmentid = "" }
  if (auto_location) {
    try {
      arr = await auto_loc();
      // console.log('here')
      lat = arr[0];
      lng = arr[1];
      //console.log(arr);

    } catch (error) {
      console.log(error);
    }
    //console.log('---------1---------')
    //console.log(geohash)
    //callss(keyword, distance, category);
    // lat = arr[0];
    // lng = arr[1];
  }
  else {
    arr = await getCoordinates(location);
    if (arr.length == 0) {
      document.getElementById('table-container').innerHTML = "";
      document.getElementById('venue_address').style.display = "none";
      document.getElementById('event_list').style.display = "none";

      var txt = "<p class='error_msj'>No Records Found</p>"
      document.getElementById('table-container').innerHTML = txt;
    }
    lat = arr[0];
    lng = arr[1];
  }
  //console.log(lat);
  // console.log(lng);
  // geohash = encodeGeohash(lat, lng, 7);
  // console.log(keyword, distance, category, geohash);
  document.getElementById('event_list').style.display = "none";
  document.getElementById('venue_address').style.display = "none";
  document.getElementById('venue_detail').style.display = "none";
  callss(keyword, distance, segmentid, lat, lng);

}

async function clear_data() {
  //   document.getElementById('keyword').value = "";
  //   document.getElementById('location').value = "";
  //   document.getElementById('distance').value = "10";
  document.getElementById('table-container').style.display = 'none'
  document.getElementById('venue_detail').style.display = 'none';
  document.getElementById('event_list').style.display = 'none';
  document.getElementById('venue_address').style.display = 'none';
  if (document.getElementById('auto_location').checked) {
    var x = document.getElementById('location');
    if (x.style.display == 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'block';
    }
  }

  //   document.getElementById('category').value="Default";
  document.getElementById("event_form").reset();



}

async function geteventdata(id) {
  url = "/event-search?id=" + id;
  axios.get(url)
    .then(response => response.data)
    .then(data => {

      document.getElementById('event_list').style.display = 'block';
      console.log(data)
      var event_name = data._embedded.events[0].name;

      var artist = '';


      //var artist_Team1 = "<a href = " + data._embedded.events[0]._embedded.attractions[0].url +" >"+ data._embedded.events[0]._embedded.attractions[0].name +"</a>";
      //ttractions[0].url;
      //let artist_Team = artist_Team1.concat(" | ", artist_Team2);
      var venue = data._embedded.events[0]._embedded.venues[0].name;
      // var segment = data._embedded.events[0].classifications[0].segment.name;
      var genere_type = '';
      let subgnere = false, genre = false, sub_type = false, seg = true;

      if (data._embedded.events[0].classifications) {
        if (data._embedded.events[0].classifications[0].subGenre && data._embedded.events[0].classifications[0].subGenre?.name && data._embedded.events[0].classifications[0].subGenre?.name.toLowerCase() != 'undefined') {
          genere_type += data._embedded.events[0].classifications[0].subGenre?.name;
          subgnere = true;
        }
        if (data._embedded.events[0].classifications[0].genre && data._embedded.events[0].classifications[0].genre?.name && data._embedded.events[0].classifications[0].genre?.name.toLowerCase() != 'undefined') {
          if (subgnere) {
            genere_type += " | "
          }
          genere_type += data._embedded.events[0].classifications[0].genre?.name;
          genre = true;
        }
        if (data._embedded.events[0].classifications[0].segment && data._embedded.events[0].classifications[0].segment?.name && data._embedded.events[0].classifications[0].segment?.name.toLowerCase() != 'undefined') {
          if (subgnere || genre) {
            genere_type += " | "
          }
          genere_type += data._embedded.events[0].classifications[0].segment?.name;
          seg = true;
        }
        if (data._embedded.events[0].classifications[0].subType && data._embedded.events[0].classifications[0].subType?.name && data._embedded.events[0].classifications[0].subType?.name.toLowerCase() != 'undefined') {
          if (subgnere || genre || seg) {
            genere_type += " | "
          }
          genere_type += data._embedded.events[0].classifications[0].subType?.name;
          sub_type = true;
        }
        if (data._embedded.events[0].classifications[0].type && data._embedded.events[0].classifications[0].type?.name && data._embedded.events[0].classifications[0].type?.name.toLowerCase() != 'undefined') {
          if (subgnere || genre || seg || sub_type) {
            genere_type += " | "
          }
          genere_type += data._embedded.events[0].classifications[0].type?.name;

        }

      }


      
      var butt;
      if( data._embedded.events[0].dates.status.code){
        var Ticket_status = data._embedded.events[0].dates.status.code;
        console.log(Ticket_status);
      
        if (Ticket_status == "onsale") {
          butt = "<p class = 'btt1'> On Sale</p>"
        }
        else if (Ticket_status == "rescheduled") {
          butt = "<p class = 'btt2'> Rescheduled</p>"
        }
        else if (Ticket_status == "offsale") {
          butt = "<p class = 'btt3'> Off sale</p>"
        }
        else if (Ticket_status == "postponed") {
          butt = "<p class = 'btt4'> Postponed</p>"
        }
        else if (Ticket_status == "cancled") {
          butt = "<p class = 'btt5'> Off sale</p>"
        }
  
      }
      var txt2 = '';
      var Ticket_URL = data._embedded.events[0].url;
      if (data._embedded.events[0].seatmap && data._embedded.events[0].seatmap!='undefined' && data._embedded.events[0].seatmap!=undefined) {
        var seat_map = data._embedded.events[0].seatmap.staticUrl;
        txt2 = "<img class='imagesetter' src=\"" + seat_map + "\">";
        // document.getElementById("id2").innerHTML = txt2;
      }
      else {
        console.log("Hello");
        // document.getElementById("id2").innerHTML="";
        // document.getElementById("id2").innerHTML = txt2;

        //document.getElementById("id2").style.display = "none";
      }
      
      //console.log(data);

      document.getElementById('event_list').innerHTML = "<div id='head_container' class='textcolor'></div><table><tr><td id='id1' style='font-family:sans-serif;width:max-content'></td><td id='id2'></td> </tr></table>";
      const head_container = document.getElementById("head_container");
      //head_container.id = "head_container";
      const heading = document.createElement("p");
      heading.textContent = event_name;
      heading.className = 'hed_set';
      head_container.innerHTML = heading.outerHTML;



      const myDiv = document.getElementById("event_list");
      myDiv.classList.add("event_box");

      var table = document.createElement("table");
      table.style.border = '1px solid black';
      table.style.borderCollapse = 'collapse';
      table.style.marginTop = '20px';


      // var row = document.createElement("tr");

      // var cell1 = document.createElement("td");
      var textContent = '', date = false, datetime1 = '';
      if (data._embedded.events[0].dates) {
        if (data._embedded.events[0].dates.start.localDate != '') {
          textContent = "<p class = 'headerValue'>Date: </p><br>";
          date = true;
          datetime1 = data._embedded.events[0].dates.start.localDate;
        }
        if (data._embedded.events[0].dates.start.localTime != '') {
          if (date) {
            datetime1 += ' ';
          }
          datetime1 += data._embedded.events[0].dates.start.localTime;
          textContent += "<p class = 'dataValue'>" + datetime1 + "</p>";
        }
        else {
          textContent += "<p class = 'dataValue'>" + datetime1 + "</p>";
        }
      }
      //var date = data._embedded.events[0].dates.start.localDate;
      //var time = data._embedded.events[0].dates.start.localTime;
      // let datetime = date.concat(" ", time);


      // var textContent = "<p class = 'headerValue'>Date: </p><br>";

      if (data._embedded.events[0]._embedded.attractions) {
        if (data._embedded.events[0]._embedded.attractions != 'undefined') {
          for (var i = 0; i < data._embedded.events[0]._embedded.attractions.length; i++) {
            if(data._embedded.events[0]._embedded.attractions[i].url && data._embedded.events[0]._embedded.attractions[i].name){
              if (i > 0) {
                artist += " | ";
              }
              artist += "<a  href = " + data._embedded.events[0]._embedded.attractions[i].url + " target = '_blank' class='hov1' >" + data._embedded.events[0]._embedded.attractions[i].name + "</a>";
            }
            else{
              artist += `<p class='art1'> ${data._embedded.events[0]._embedded.attractions[i].name}</p>`
            }
            }
            
          textContent += "<p class = 'headerValue'> Artist/Team </p><br>";
          textContent += "<p class = 'dataValue'>" + artist + "</p>";
        }


      }


      //textContent += "<p class = 'headerValue'> Artist/Team </p><br>";
      textContent += "<p class = 'headerValue'> Venue </p><br>";
      textContent += "<p class = 'dataValue'>" + venue + "</p>";
      textContent += "<p class = 'headerValue'> Genre </p><br>";
      textContent += "<p class = 'dataValue'>" + genere_type + "</p>";
      var price_range;
      if (data._embedded.events[0].priceRanges) {
        if (data._embedded.events[0].priceRanges[0].min != '' && data._embedded.events[0].priceRanges[0].max != '' && data._embedded.events[0].priceRanges[0].currency != '') {
          var val1 = data._embedded.events[0].priceRanges[0].min;
          var min = val1.toString();
          var val2 = data._embedded.events[0].priceRanges[0].max;
          var max = val2.toString();
          var curr = data._embedded.events[0].priceRanges[0].currency;
          price_range = min.concat(" - ", max, " ", curr);
          textContent += "<p class = 'headerValue'> Price Ranges </p><br>";
          textContent += "<p class = 'dataValue'>" + price_range + "</p>";

        }
      }
      else {
        console.log("no price range")
      }



      textContent += "<p class = 'headerValue'> Ticket Status </p><br>";
      //textContent += "<p class = 'dataValue'>" + Ticket_status + "</p>";
      textContent += butt;
      textContent += "<p class = 'headerValue'> Buy Ticket At:</p><br>";
      // textContent += "<a class = 'dataValue' href=\"" + Ticket_URL + "target = '_blank'>Ticketmaster</a>";
      textContent += `<a class = 'dataValue hov1' href='${Ticket_URL}' target='_blank'>Ticketmaster</a>`;


      var y = document.getElementById('id2');
      y.classList.add('img_set5');

      

      document.getElementById("id1").innerHTML = textContent;
      document.getElementById("id2").innerHTML = txt2;
      document.getElementById("event_list").scrollIntoView({ behavior: "smooth" });
      //new add1
      const myDiv5 = document.getElementById("venue_detail");

      myDiv5.classList.add('venue_center')

      var textContent = "<p class='venue_color'  > Show Venue Details</p> <br>";
      textContent += "<div class='arrow_center'><div class='arrow down' onclick='getVen(\"" + venue + "\")'></div></div>";
      var add_1 = document.getElementById('address');
      add_1.classList.add('add_cent');

      document.getElementById("venue_detail").innerHTML = textContent;

      document.getElementById("venue_detail").scrollIntoView({ behavior: "smooth" });
      //new add2
      // console.log(datetime, artist_Team, venue, result, price_Ranges, Ticket_URL, Ticket_status, seat_map)

    })
    .catch(error => {
  
        console.error('An error occurred while fetching the resource.', error);
     
    });
}


async function getCoordinates(address) {
  try {
    event.preventDefault()

    const apiKey = 'AIzaSyBZ1inB67-gOCz4BbXuAyyLoU_60_vB320';
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
    const data = await response.json();
    //console.log(data)
    latlon = data.results[0].geometry.location;
    //console.log(latlon);
    //console.log(typeof latlon);
    lat = latlon['lat'];
    lng = latlon['lng'];
    //console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    return new Array(lat, lng);
  }
  catch (error) {
    document.getElementById('table-container').innerHTML = "";
    document.getElementById('venue_address').style.display = "none";
    document.getElementById('event_list').style.display = "none";

    var txt = "<p class='error_msj'>No Records Found</p>"
    document.getElementById('table-container').innerHTML = txt;

  }
}




async function getVen(id) {
  url = "/venue-search?id=" + id;
  axios.get(url)
    .then(response => response.data)
    .then(data => {
     // console.log(data);

      document.getElementById('venue_detail').style.display = 'none';
      document.getElementById('venue_address').style.display = 'block';


      var box = document.getElementById('box_border');
      box.classList.add('box_set');
      // var event_name = data._embedded.events[0].name;
      // var address = data._embedded.events[0]._embedded.venues[0].address.line1;
      // var city = data._embedded.events[0]._embedded.venues[0].city.name;
      // var statecode = data._embedded.events[0]._embedded.venues[0].state.stateCode;
      // var statename = data._embedded.events[0]._embedded.venues[0].state.name;
      // var postal_code = data._embedded.events[0]._embedded.venues[0].postalCode;
      // var addline2 = city.concat(", ", statecode);
      var address, add1 = false, city1 = false, statecode1 = false, postal_code1 = false, statename1 = false, city, stateCode, postal_code, statename, map, venue, venue1 = false;
      if (data._embedded.venues) {
        if (data._embedded.venues[0].address.line1 != undefined) {
          address = data._embedded.venues[0].address.line1;
          add1 = true;

        }
        if (data._embedded.venues[0].city.name != undefined) {
          city = data._embedded.venues[0].city.name;
          city1 = true;
        }
        if (data._embedded.venues[0].state.stateCode != undefined) {
          stateCode = data._embedded.venues[0].state.stateCode;
          statecode1 = true;
        }
        if (data._embedded.venues[0].postalCode != undefined) {
          postal_code = data._embedded.venues[0].postalCode;
          postal_code1 = true;
        }
        if (data._embedded.venues[0].state.name != undefined) {
          statename = data._embedded.venues[0].state.name;
          statename1 = true;
        }
        if (data._embedded.venues[0].name != undefined) {
          venue = data._embedded.venues[0].name;
          venue1 = true;
        }
      }

      var txt2 = "<p>";
      if (add1) {
        txt2 += address + "<br>";
      }
      if (city1) {
        txt2 += city + ",";
      }
      if (statecode1) {
        txt2 += stateCode + "<br>";
      }
      if (postal_code1) {
        txt2 += postal_code + "</p>";
      }
      if (add1 || city1 || statecode1 || postal_code1 || statename1 || venue1) {
        map = venue.concat(",", address, ",", city, ",", statename, ",", postal_code);
      }

      // var venue = data._embedded.events[0]._embedded.venues[0].name;
      //var map = venue.concat(",", address, ",", city, ",", statename, ",", postal_code);
      //var statecode = data._embedded.events[0]._embedded.venues[0].state.stateCode;
     
      // var img_url = data._embedded.events[0]._embedded.venues[0].images[0].url;


      if (data._embedded.venues[0].images) {
        if (data._embedded.venues[0].images[0].url != null)
          var img_url = data._embedded.venues[0].images[0].url;
          document.getElementById('image_container').innerHTML = "<img class='img_set' src=" + img_url + " >";
      }
      else {
        document.getElementById('image_container').style.display = "none";
      }

      //const myDiv = document.getElementById("venue_detail");
      const myDiv2 = document.getElementById('venue_address');
      myDiv2.classList.add("hide");
      

      myDiv2.classList.add('venue_address');


      const myDiv3 = document.getElementById('map_details');
      var addr = document.getElementById('id3');
      addr.classList.add('add_vertical');
      var addr2 = document.getElementById('id4');
      addr2.classList.add('add_vertical1');
      var addr3 = document.getElementById('id5');
      addr3.classList.add('add_vertical2');
      var map_set = document.getElementById('map_details');
      map_set.classList.add('map_details_set');
      var venue_table = document.getElementById('venue_table');
      venue_table.classList.add('border_set');
      var venue_heading = document.getElementById('venue_heading');
      venue_heading.classList.add('hed_center');
      var venue = data._embedded.venues[0].name;


      var txt = "<p class='venue_color1'>" + venue + "</p>";
      var url2 = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(map);
      var txt1 = "<p> Address: </p>"
      var  txt3;
      // var txt2 = "<p>" + address + "<br>" + addline2 + "<br>" + postal_code + " </p>";
      if(data._embedded.venues[0].url){
        var upcoming_event = data._embedded.venues[0].url;
        txt3 = `<a class='hov1'  href=' ${upcoming_event}' target= '_blank'>More events at this venue</a>`;
      }
      else{
        txt3 = `<p class='hov2' >More events at this venue</p>`;

      }
      
      
      var txt4 = "<a class='hov1'  href=\"" + url2 + "\" target= \"_blank\">Open in Google Maps</a>";

      // var x = document.getElementById('location');
      // if (x.style.display == 'none') {
      //   x.style.display = 'block';
      // } else {
      //   x.style.display = 'none';
      // }




      document.getElementById("venue_heading").innerHTML = txt;
      document.getElementById("id3").innerHTML = txt1;
      document.getElementById("id4").innerHTML = txt2;
      document.getElementById("id5").innerHTML = txt3;
      document.getElementById("map_details").innerHTML = txt4;
      document.getElementById("venue_address").scrollIntoView({ behavior: "smooth" });

    })
    .catch(error => {
      console.error(error)
    })
}


