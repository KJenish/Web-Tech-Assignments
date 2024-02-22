const express = require('express');
const axios = require('axios');
const Geohash = require('ngeohash');
var SpotifyWebApi = require('spotify-web-api-node');


var app = express();
app.use(express.json());
const cors = require('cors');
const { async, range } = require('rxjs');
const port = process.env.PORT || 8081;
app.use(cors());

apikey = 'U8o5Du5ndccraevra9oYAUXUzwaw4CPV';
app.get('/events', async function(req, res)  {
  try {
    const keyword = req.query.keyword;
    //var  keyword= 'taylor';
   // console.log(keyword);
   // apikey = 'U8o5Du5ndccraevra9oYAUXUzwaw4CPV';
    const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/suggest.json?apikey=U8o5Du5ndccraevra9oYAUXUzwaw4CPV&keyword=${keyword}`);
    // const events = response.data;
    const sugg = response.data._embedded.attractions.map(attraction => attraction.name);
       res.json(sugg);
    // });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.get('/Spotify-search',async function(req,res) {
// try{
//   const keyword = req.query.id;

// // credentials are optional
// var spotifyApi = new SpotifyWebApi({
//   clientId: 'd87f49b0a2284d0eba35ceda637dd897',
//   clientSecret: '46ec7f61b8184dcc9c15e60bec029f3e',
// });

// await spotifyApi.clientCredentialsGrant().then(function(data) {
//   console.log('The access token expires in ' + data.body['expires_in']);
//   console.log('The access token is ' + data.body['access_token']);

//   // Save the access token so that it's used in future calls
//   spotifyApi.setAccessToken(data.body['access_token']);
//   // Get multiple albums


//   // Make an API request
//   spotifyApi.searchArtists(keyword)
//     .then(function(data) {
//       console.log('Search artists by "Love"', data.body);
//       var art_id = data.body.artists.items[0].id;
//       console.log(art_id);
//       res.send(data.body);
//     }, function(err) {
//       console.error(err);
//     });
// }
// , function(err) {
//   console.log('Something went wrong when retrieving an access token', err);
// });


// }
// catch
//   (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }

// });

// app.get('/Spotify-search', async (req,res)=>  {
//   try {
//     const keyword = req.query.id;

    // credentials are optional

  async function spotifydata(artistTeams){
    console.log(artistTeams);
    var spotifyApi = new SpotifyWebApi({
      clientId: 'd87f49b0a2284d0eba35ceda637dd897',
      clientSecret: '46ec7f61b8184dcc9c15e60bec029f3e',
    });
    var spo_artist_obj = new Array;


    await spotifyApi.clientCredentialsGrant().then(async data => {
      //console.log('The access token expires in ' + data.body['expires_in']);
      //console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
     await spotifyApi.setAccessToken(data.body['access_token']);
      // Search for artists
      // for(let i=0;i<artistTeams.length;i++){
      //   console.log(artistTeams);
      // }
      for(let i=0;i<artistTeams.length;i++){
       await spotifyApi.searchArtists(artistTeams[i])
        .then(data => {
          console.log(artistTeams[i])
          console.log('inside function spoti')

          // if(data.body.hasOwnProperty('artists') && data.body.hasOwnProperty('items')){
            var art_detail={
              'name':data.body.artists.items[0].name,
              'followers':data.body.artists.items[0].followers.total,
              'popularity':data.body.artists.items[0].popularity,
              'spotify_link':data.body.artists.items[1].external_urls.spotify,
              'image':data.body.artists.items[0].images[2].url,
              'id':data.body.artists.items[0].id
            }
           console.log(art_detail);
          // }
          return art_detail
          //console.log('Search artists by "' + keyword + '"', data.body);
          // var art_id = data.body.artists.items[0].id;
          // console.log('Artist ID:', art_id);

          // Get the albums for the artist
          
        })
        .then(async(art_detail)=>{
          let images = [];
          if(art_detail == undefined ) return;
          await spotifyApi.getArtistAlbums(art_detail.id,{limit:3})
          .then(data => {
            //console.log('Albums information', data.body);
            // for (let img of data.body.items){
            //   images.push(img.images[0].url)
            //   console.log(images)
            // }
            // art_detail['albums']=images
            // console.log(art_detail);
            var album1 = data?.body?.items?.[0]?.images?.[0]?.url ?? '';
            var album2 = data?.body?.items?.[1]?.images?.[0]?.url ?? '';
            var album3 = data?.body?.items?.[2]?.images?.[0]?.url ?? '';

            art_detail['album1'] = album1
            art_detail['album2'] = album2
            art_detail['album3'] = album3

          })
          spo_artist_obj.push(art_detail)
          spo_artist_obj.sort((a, b) => b.popularity - a.popularity);

          // console.log(spo_artist_obj)
        })

       // console.log(spo_artist_obj);
       // res.send(spo_artist_obj);
      }
      


        
    });
    return spo_artist_obj;

  }  
    
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


app.get('/Spotify-search', async (req,res)=>{
  try{
    const arrayParam = req.query.arrayparam;
   // var artists = req.body.id;
   var spo_obj = [];
    console.log(arrayParam);
    spo_obj = await spotifydata(arrayParam);

    console.log('hello',spo_obj);
    res.json(spo_obj);

  }
  catch(error){
    console.log(error);
  }
})



app.get('/my-nodejs-endpoint', async (req, res) => {
  const param1 = req.query.param1;
  const param2 = req.query.param2;
  const param3 = req.query.param3;
  const param4 = req.query.param4;
  const param5 = req.query.param5;


  // const param1 = 'taylor swift';
  // const param2 =10 ;
  // const param3 = "";
  // const param4 =34.003;
  // const param5 = -118.2863;
  const geolocation = Geohash.encode(param4, param5, 7);

  const url = (`https://app.ticketmaster.com/discovery/v2/events.json?apikey=U8o5Du5ndccraevra9oYAUXUzwaw4CPV&keyword=${param1}&geoPoint=${geolocation}&radius=${param2}&unit=miles&segmentId=${param3}`);
  //const api_key = 'U8o5Du5ndccraevra9oYAUXUzwaw4CPV';

  // const params = {
  //   apikey: api_key,
  //   keyword: param1,
  //   geoPoint: geolocation,
  //   radius: param2,
  //   unit: 'miles',
  //   segmentId: param3,
  // };

  try {
    const response = await axios.get(url);
    //console.log(url);
    const data = response.data;
   

    if (!data._embedded) {
      res.status(404).json({ error: 'no data found' });
      return;
    }

    const events = data._embedded.events;
    const event_list = [];

    for (let event of events) {
      const event_details = [];

      if (event.dates && event.dates.start) {
        if (event.dates.start.localDate) {
          if (event.dates.start.localTime) {
            event_details.push(`${event.dates.start.localDate} ${event.dates.start.localTime}`);
          } else {
            event_details.push(event.dates.start.localDate);
          }
        } else {
          event_details.push('');
        }
      } else {
        event_details.push('');
      }

      event_details.push(event.images[0].url);
      event_details.push(event.name);
      event_details.push(event.classifications[0].segment.name);
      event_details.push(event._embedded.venues[0].name);
      event_details.push(event.id);
      event_list.push(event_details);
    }
    event_list.sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA - dateB;
    });
    //console.log(event_list);  
    res.json(event_list);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/event-search', async (req, res) => {
 const id = req.query.id;

 const baseUrl = "https://app.ticketmaster.com/discovery/v2/events";

  //id='vvG1iZ9Pm9OvzQ'
  const params = {
    apikey: apikey,
    id: id
  };

  try {
    const response = await axios.get(baseUrl, { params });
    // res.json(response.data);
    const data = response.data;
    const events = data._embedded.events;
    const eventName = data._embedded.events[0].name;


    var date = false;
    let datetime1 = '';
    if (data._embedded.events[0].dates) {
    if (data._embedded.events[0].dates.start.localDate != '') {
      date = true;
      datetime1 = data._embedded.events[0].dates.start.localDate;
    }
    // if ('localTime' in data._embedded.events[0].dates.start) {
    //   if (date) {
    //     datetime1 += ' ';
    //   }
    //   datetime1 += data._embedded.events[0].dates.start.localTime;
    // }
  }

  let artist = '';
  let artistTeam = [];
  

  if (data._embedded.events[0]._embedded.attractions) {
    if (data._embedded.events[0]._embedded.attractions != 'undefined') {
      for (let i = 0; i < data._embedded.events[0]._embedded.attractions.length; i++) {
        if ('name' in data._embedded.events[0]._embedded.attractions[i]) {
          if (i > 0) {
            artist += ' | ';
          }
          artist += data._embedded.events[0]._embedded.attractions[i].name;
          artistTeam.push(data._embedded.events[0]._embedded.attractions[i].name);
        } else {
          artistTeam = [];
        }
      }
    } else {
     
    }
  } 
    
  let venue = data._embedded.events[0]._embedded.venues[0].name;

  let genere_type = '';
  let subgnere = false;
  let genre = false;
  let sub_type = false;
  let seg = true;
  let spo_genere_type;
  

  if (data._embedded.events[0].classifications) {
    if (
      data._embedded.events[0].classifications[0].subGenre &&
      data._embedded.events[0].classifications[0].subGenre?.name &&
      data._embedded.events[0].classifications[0].subGenre?.name.toLowerCase() !=
        'undefined'
    ) {
      genere_type += data._embedded.events[0].classifications[0].subGenre?.name;
      subgnere = true;
    }
    if (
      data._embedded.events[0].classifications[0].genre &&
      data._embedded.events[0].classifications[0].genre?.name &&
      data._embedded.events[0].classifications[0].genre?.name.toLowerCase() !=
        'undefined'
    ) {
      if (subgnere) {
        genere_type += ' | ';
      }
      genere_type += data._embedded.events[0].classifications[0].genre?.name;
      genre = true;
    }
    if (
      data._embedded.events[0].classifications[0].segment &&
      data._embedded.events[0].classifications[0].segment?.name &&
      data._embedded.events[0].classifications[0].segment?.name.toLowerCase() !=
        'undefined'
    ) {
      if (subgnere || genre) {
        genere_type += ' | ';
      }
      genere_type += data._embedded.events[0].classifications[0].segment?.name;
      spo_genere_type = data._embedded.events[0].classifications[0].segment?.name;
      seg = true;
    }
    if (
      data._embedded.events[0].classifications[0].subType &&
      data._embedded.events[0].classifications[0].subType?.name &&
      data._embedded.events[0].classifications[0].subType?.name.toLowerCase() !=
        'undefined'
    ) {
      if (subgnere || genre || seg) {
        genere_type += ' | ';
      }
      genere_type += data._embedded.events[0].classifications[0].subType?.name;
      sub_type = true;
    }
    if (
      data._embedded.events[0].classifications[0].type &&
      data._embedded.events[0].classifications[0].type?.name &&
      data._embedded.events[0].classifications[0].type?.name.toLowerCase() !=
        'undefined'
    ) {
      if (subgnere || genre || seg || sub_type) {
        genere_type += ' | ';
      }
      genere_type += data._embedded.events[0].classifications[0].type?.name;
    }
  }
  let price_range = '';
  

  if (data._embedded.events[0].priceRanges) {
    if (
      data._embedded.events[0].priceRanges[0].min != '' &&
      data._embedded.events[0].priceRanges[0].max != '' &&
      data._embedded.events[0].priceRanges[0].currency != ''
    ) {
     
      let min = data._embedded.events[0].priceRanges[0].min.toString();
      let max = data._embedded.events[0].priceRanges[0].max.toString();
      // let curr = data._embedded.events[0].priceRanges[0].currency;
     
      price_range = `${min} - ${max}`;
      console.log(price_range)
    }
  } else {
   
    console.log('no price range');
  }

  let Ticket_status='';
if(data._embedded.events[0].dates.status.code){
  Ticket_status = data._embedded.events[0].dates.status.code

}

let Ticket_URL = data._embedded.events[0].url;

let seat_map ='';
      if ('seatmap' in data._embedded.events[0]) {
        seat_map = data._embedded.events[0].seatmap.staticUrl;
        // txt2 = "<img class='imagesetter' src=\"" + seat_map + "\">";
        // document.getElementById("id2").innerHTML = txt2;
      } else {
        console.log('Hello');
        // document.getElementById("id2").innerHTML="";
        // document.getElementById("id2").innerHTML = txt2;

        //document.getElementById("id2").style.display = "none";
      }

var event_detail_list={
  'event_name':eventName,
  'date':datetime1,
  'artist':artist,
  'artistArray':artistTeam,
  'venue':venue,
  'genre_type':genere_type,
  'price_range':price_range,
  'Ticket_status':Ticket_status,
  'Ticket_URL':Ticket_URL,
  'Seat_map':seat_map,
  'Type_genre':spo_genere_type
}
console.log(event_detail_list);
res.json(event_detail_list)

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
app.get('/venue-search', async (req, res) => {
  const id = req.query.id;
  // const id = "VVG11Z9KBigNAT"
  //const id='Dodger Stadium';
  const baseUrl = "https://app.ticketmaster.com/discovery/v2/venues";
 
   //id='vvG1iZ9Pm9OvzQ'
   const params = {
     apikey: apikey,
     keyword: id
   };
 
   try {
     const response = await axios.get(baseUrl, { params });
     const data = response.data;
     console.log(data)
   
     
     
  let address, city, stateCode, postal_code, statename, venue_name;
  let add1 = false, city1 = false, statecode1 = false, postal_code1 = false, statename1 = false, venue1 = false;
  if (data._embedded.venues) {
    if (data._embedded.venues[0].address?.line1 != undefined) {
      address = '';
      address = data._embedded.venues[0].address.line1;
      add1 = true;
    }
    if (data._embedded.venues[0].city?.name != undefined) {
      city='';
      city = data._embedded.venues[0].city.name;
      city1 = true;
    }
    if (data._embedded.venues[0].state?.stateCode != undefined) {
      stateCode='';
      stateCode = data._embedded.venues[0].state.stateCode;
      statecode1 = true;
    }
    if (data._embedded.venues[0].postalCode != undefined) {
      postal_code='';
      postal_code = data._embedded.venues[0].postalCode;
      postal_code1 = true;
    }
    if (data._embedded.venues[0].state.name != undefined) {
      statename='';
      statename = data._embedded.venues[0].state.name;
      statename1 = true;
    }
    if (data._embedded.venues[0].name != undefined) {
      venue_name='';
      venue_name = data._embedded.venues[0].name;
      venue1 = true;
    }
  }
  let addressline = '';
  if (add1) {
    addressline += address;
  }
  if (city1) {
    addressline += city + ',';
  }
  if (statecode1) {
    addressline += stateCode;
  }
  if (postal_code1) {
    addressline += postal_code;
  }
  let arr = [];
  if (add1 || city1 || statecode1 || postal_code1 || statename1 || venue1) {
    map = (venue_name ?? '') + ',' + (address ?? '') + ',' + (city ?? '') + ',' + (statename ?? '') + ',' + (postal_code ?? '');
  }


  let phonenumber = '', openhours = '', genralrules = '', childrules = ''
  if ('boxOfficeInfo' in data._embedded.venues[0]) {
    if ('phoneNumberDetail' in data._embedded.venues[0].boxOfficeInfo) {
     
      phonenumber = data._embedded.venues[0].boxOfficeInfo?.phoneNumberDetail;
    } 
  } 

  if ('boxOfficeInfo' in data._embedded.venues[0]) {
    if ('openHoursDetail' in data._embedded.venues[0].boxOfficeInfo) {
      
      openhours = data._embedded.venues[0].boxOfficeInfo.openHoursDetail;
    } 
  } 

  if ('generalInfo' in data._embedded.venues[0]) {
    if ('generalRule' in data._embedded.venues[0].generalInfo) {
      genralrules = data._embedded.venues[0].generalInfo.generalRule;  
    }
  } 

  if ('generalInfo' in data._embedded.venues[0]) {
    if ('childRule' in data._embedded.venues[0].generalInfo) {
      childrules = data._embedded.venues[0].generalInfo.childRule;
    } 
  } 





  var event_detail_list={
    'venue_name':venue_name,
    'Address':addressline,
    'PhoneNumber':phonenumber,
    'OpenHours':openhours,
    'GeneraleRule':genralrules,
    'childrules':childrules,
    'map_location':map
  }

  console.log(event_detail_list);
  res.json(event_detail_list)

    //  res.json(response.data);
   } catch (error) {
     console.error(error);
     res.status(500).send('Internal server error');
   }
 });
 
 //  const root = path.join(__dirname,"static", "dist","my_angular_project");
 const root = path.join(__dirname,'/public');
  app.get("*",function(req,res) {
   fs.stat(root + req.path, function(err) {
     if(err) {
       res.sendFile("index.html",{root});
     } else {
       res.sendFile(req.path,{root});
     }
   });
  });
  
app.use("/",express.static(path.join(__dirname,'/public')))
  



app.listen(port, () => console.log(`Server listening on port ${port}`));
