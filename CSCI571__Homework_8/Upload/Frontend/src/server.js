const express = require('express');
const axios = require('axios');
const Geohash = require('ngeohash');
var SpotifyWebApi = require('spotify-web-api-node');


var app = express();
app.use(express.json());
const cors = require('cors');
const { async, range } = require('rxjs');
const port = 8081;
app.use(cors());

apikey = 'U8o5Du5ndccraevra9oYAUXUzwaw4CPV';
app.get('/events', async function(req, res)  {
  try {
    const keyword = req.query.keyword;
    //var  keyword= 'taylor';
   // console.log(keyword);
   // apikey = 'U8o5Du5ndccraevra9oYAUXUzwaw4CPV';
    const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/suggest.json?apikey=U8o5Du5ndccraevra9oYAUXUzwaw4CPV&keyword=${keyword}`);
    const events = response.data;
    
       res.send(events);
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
            for (let img of data.body.items){
              images.push(img.images[0].url)
              console.log(images)
            }
            art_detail['albums']=images
            console.log(art_detail);

          })
          spo_artist_obj.push(art_detail)
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
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
app.get('/venue-search', async (req, res) => {
  const id = req.query.id;
  //const id='Dodger Stadium';
  const baseUrl = "https://app.ticketmaster.com/discovery/v2/venues";
 
   //id='vvG1iZ9Pm9OvzQ'
   const params = {
     apikey: apikey,
     keyword: id
   };
 
   try {
     const response = await axios.get(baseUrl, { params });
     res.json(response.data);
   } catch (error) {
     console.error(error);
     res.status(500).send('Internal server error');
   }
 });



app.listen(port, () => console.log(`Server listening on port ${port}`));
