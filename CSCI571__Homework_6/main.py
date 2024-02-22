from flask import Flask,request, jsonify
import requests
import sys
from geolib import geohash
from flask_cors import cross_origin


app = Flask(__name__,static_url_path='/static')

@app.route('/')
@cross_origin()
def methodssss():
  return app.send_static_file('events.html')


# @app.route('/send_data', methods=['GET'])
# def receive_data():
#     data = request.args
#     print(data)
#     return jsonify({'message': data})

# if __name__ == '__main__':
#     app.run(debug=True)


@app.route('/my-python-endpoint')
def my_python_endpoint():
  param1 = request.args.get('param1')
  param2 = request.args.get('param2')
  param3 = request.args.get('param3')
  param4 = request.args.get('param4')
  param5 = request.args.get('param5')
  geolocation=geohash.encode(param4, param5, 7)
  url = "https://app.ticketmaster.com/discovery/v2/events"
  api_key = "U8o5Du5ndccraevra9oYAUXUzwaw4CPV"
  params = {
    "apikey": api_key,
    "keyword": param1,
    "geoPoint": geolocation,
    "radius": param2,
    "unit":"miles",
    "segmentId": param3,
  }
  
  response = requests.get(url, params=params)
  data = response.json()
  #print(data)
  
  if "_embedded" not in data:
    return jsonify({"error":"no data found"}),404
  
  else:
    events = data["_embedded"]["events"]
  
  event_list = []
  for i in range(len(events)):
    
        event_details = []
        # # date = False
        # # time=False
        # # value_date =[]
        # # if(events[i]['dates']['start']['localDate']):
        # #   date=True
        # #   value_date = value_date.append(events[i]['dates']['start']['localDate'])
        # # if(events[i]['dates']['start']['localTime']):
        # #   if(date):
        # #     valuedate
        
        # start_datetimes = []

        # for i in range(len(events)):
        #   if 'localDate' in events[i]['dates']['start'] and 'localTime' in events[i]['dates']['start']:
        #     start_datetime = events[i]['dates']['start']['localDate'] + " " + events[i]['dates']['start']['localTime']
        #   elif 'localDate' in events[i]['dates']['start']:
        #     start_datetime = events[i]['dates']['start']['localDate']
        #   else:
        #     start_datetime = None
    
        # start_datetimes.append(start_datetime)
      
        # # if 'localDate' in events[i]['dates']['start'] and 'localTime' in events[i]['dates']['start']:
        # #   start_datetime = events[i]['dates']['start']['localDate'] + " " + events[i]['dates']['start']['localTime']
        # # elif 'localDate' in events[i]['dates']['start']:
        # #   start_datetime = events[i]['dates']['start']['localDate']   
          
        if('dates' in events[i] and 'start' in events[i]['dates']):
          if('localDate' in events[i]['dates']['start']):
            if( 'localTime' in events[i]['dates']['start']):
              event_details.append(events[i]['dates']['start']['localDate']+ " " + events[i]['dates']['start']['localTime'])
            else:
                 event_details.append(events[i]['dates']['start']['localDate'])
          else:
            event_details.append("")
        else:
          event_details.append("")
          
          # event_details.append(events[i]['dates']['start']['localDate']+ " " + events[i]['dates']['start']['localTime'])
        # event_details.append(start_datetimes[i])
        event_details.append(events[i]['images'][0]['url'])
        event_details.append(events[i]['name'])
        event_details.append(events[i]['classifications'][0]['segment']['name'])
        event_details.append(events[i]['_embedded']['venues'][0]['name'])
        event_details.append(events[i]['id'])
        event_list.append(event_details)
  return jsonify(event_list)  
  
  #return jsonify(data)
  

  # if(request.method == 'GET'):
  #   data = {
  #     "keyword": param1,
  #     "distance":param2,
  #     "segmentid":param3,
  #     "geolocation":geolocation
  #   }
  # Do something with the parameters...
  #return jsonify(data)
  
@app.route('/event-search')
def event_search():
  param1 = request.args.get('id')
  url = "https://app.ticketmaster.com/discovery/v2/events"
  api_key = "U8o5Du5ndccraevra9oYAUXUzwaw4CPV"
  params = {

    "apikey": api_key,
     "id": param1,
  }
  response = requests.get(url, params=params)
  data = response.json()
  
  

  return jsonify(data)


if __name__ == '__main__':
  app.run(debug=True)
  
  
@app.route('/venue-search')
def venue_search():
  param1 = request.args.get('id')
  url = "https://app.ticketmaster.com/discovery/v2/venues"
  api_key = "U8o5Du5ndccraevra9oYAUXUzwaw4CPV"
  params = {

    "apikey": api_key,
     "keyword": param1,
  }
  response = requests.get(url, params=params)
  data = response.json()
  
  

  return jsonify(data)


if __name__ == '__main__':
  app.run(debug=True, port=3000) 



# url = "https://app.ticketmaster.com/discovery/v2/events"

# # Replace YOUR_API_KEY with your Ticketmaster API key
# api_key = "U8o5Du5ndccraevra9oYAUXUzwaw4CPV"

# # Set the parameters for the API request
# params = {
#     "apikey": api_key,
#     "keyword": "music",
#     "city": "Los Angeles",
#     "stateCode": "CA",
#     "countryCode": "US",
# }

# # Make the API request
# response = requests.get(url, params=params)

# # Parse the JSON response
# data = response.json()
# print(data)

