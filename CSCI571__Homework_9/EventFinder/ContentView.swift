//
//  ContentView.swift
//  EventFinder
//
//  Created by jenish karasariya on 4/13/23.
//

import SwiftUI
import Alamofire
import Kingfisher

struct ContentView: View {
    @State public var keyword: String = ""
    @State public var distance: String = "10"
    @State public var category: String = "Default"
    public let categories = ["Default", "Music", "Sports", "Art & Theatre", "Film", "Miscellaneous"]
    @State public var location: String = ""
    @State public var autoDetectLocation: Bool = false
    var isSubmitDisabled: Bool {
        keyword.isEmpty || (!autoDetectLocation && location.isEmpty)
    }
    //    @State var apiResponseData: [(String, String, String, String, String, String)] = []
    @State var apiResponseData: [[String]] = []
    
    
    @State public var lat: Double? = 0.0
    @State public var lng: Double? = 0.0
    @State public var id: String? = ""
    //@State public var displaytable = false
    @State public var displaymassge = false
    @State public var displaydata = false
    @State public var opensheet = false
    @State public var sugg: [String] = []
    @State public var loader = true
    @State public var loader1 = false
    
    
    
    var body: some View {
        VStack {
            
            NavigationView {
                //  HStack {
                Form {
                    HStack{
                        
                        LabeledContent("Keyword:")
                        {
                            TextField("Required", text: $keyword)
                                .foregroundColor(.black)
                            
                                .onSubmit {
                                    opensheet =  true
                                    getnames(for: keyword)
                                    loader = true
                                }
                        }
                        .foregroundColor(.gray)
                        
                        
                        .sheet(isPresented: $opensheet, onDismiss: {
                            loader = false
                        })
                        {
                            if loader{
                                VStack(alignment: .center, spacing: 7){
                                    ProgressView()
                                        .progressViewStyle(CircularProgressViewStyle())
                                    Text("loading...")
                                        .foregroundColor(.gray)
                                        .font(.caption)
                                    
                                    
                                }
                                
                            }
                            else{
                                VStack{
                                    Text("Suggestions")
                                        .fontWeight(.bold)
                                        .font(.largeTitle)
                                    List(sugg, id: \.self) { suggestion in
                                        Text(suggestion)
                                            .onTapGesture {
                                                keyword = suggestion
                                                opensheet = false
                                            }
                                        
                                    }
                                }
                            }
                        }
                        
                    }
                    HStack{
                        LabeledContent("Distance:") {
                            TextField("", text:  $distance)
                                .keyboardType(.numberPad)
                                .foregroundColor(.black)
                        }
                        .foregroundColor(.gray)
                    }
                    HStack{
                        
                        Picker("Category:", selection: $category) {
                            ForEach(categories, id: \.self) {
                                Text($0)
                                    .foregroundColor(.black)
                                
                            }
                        }
                        .pickerStyle(.menu)
                        .foregroundColor(.gray)
                        
                    }
                    
                    
                    if !autoDetectLocation{ LabeledContent("Location:") {
                        TextField("Required", text: $location)
                            .foregroundColor(.black)
                        
                    }                        .foregroundColor(.gray)
                        
                    }
                    
                    
                    LabeledContent("Auto-detect my location:") {
                        Toggle("", isOn: $autoDetectLocation)
                            .fixedSize(horizontal: true, vertical: false)
                    }
                    .foregroundColor(.gray)
                    
                    
                    VStack{
                        
                        
                        HStack(spacing: 35){
                            Button(action: {
                                
                                
                                
                            }) {
                                Text("Submit")
                                    .foregroundColor(.white)
                                    .frame(width: 100)
                                    .padding()
                                    .background(isSubmitDisabled ? Color.gray : Color.red)
                                    .cornerRadius(8)
                                    .onTapGesture {
                                        getdataofevents()
                                        displaydata=false
                                        displaymassge=false
                                        loader1=true
                                    }
                            }
                            Button(action: {
                            }) {
                                Text("Clear")
                                    .foregroundColor(.white)
                                    .frame(width: 100.0)
                                    .padding()
                                    .background(Color.blue)
                                    .cornerRadius(8)
                                    .onTapGesture {
                                        cleardata()
                                    }
                            }
                        }
                    }
                    .padding()
                    .disabled(isSubmitDisabled)
                    
                    //if displaytable{
                    Section (header:Text(""))
                    { if loader1{
                        
                        Text("Results")
                            .fontWeight(.bold)
                            .font(.title)
                        VStack(alignment: .center, spacing: 5){
                            Spacer()
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle())
                            Text("Please wait...")
                                .foregroundColor(.gray)
                                .font(.caption)
                            Spacer()
                            
                            
                        }
                        .id(UUID())
                        .frame(maxWidth: .infinity)
                    }
                        
                        if displaymassge{
                            Text("Results")
                                .fontWeight(.bold)
                                .font(.title)
                            Text("No result found")
                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                                .foregroundColor(.red)
                                .multilineTextAlignment(.center)
                        }
                        if displaydata{
                            Text("Results")
                                .fontWeight(.bold)
                                .font(.title)
                            
                            List($apiResponseData, id: \.self) { item in
                                NavigationLink(destination:DescriptionView(id:item[5].wrappedValue))
                                {
                                    HStack{
                                        Text(item[0].wrappedValue)
                                            .foregroundColor(.gray)// Date
                                        
                                        KFImage(URL(string: item[1].wrappedValue))
                                            .resizable()
                                            .frame(width: 45, height: 45)
                                            .cornerRadius(10)
                                        
                                        Text(item[2].wrappedValue)
                                            .lineLimit(3)// Event Name
                                        Text(item[4].wrappedValue)
                                            .foregroundColor(.gray)// Venue Name
                                    }
                                    
                                }
                            }
                        }
                    }
                    
                    //}
                }
                //}
                //}
                .navigationTitle("Event Search")
                .navigationBarItems(trailing:
                                        NavigationLink(destination: favoriteview()) {
                    Image(systemName: "heart.circle")
                }
                )
                
            }
            
        }
    }
    
    
    func getLocationData(completion: @escaping (Double, Double) -> Void) {
        let apiKey = "9611e33e821242"
        let urlString = "https://ipinfo.io/json?token=\(apiKey)"
        
        AF.request(urlString).responseJSON { response in
            switch response.result {
            case .success(let data):
                if let json = data as? [String: Any], let loc = json["loc"] as? String {
                    let components = loc.split(separator: ",")
                    if components.count == 2, let lat = Double(components[0]), let lng = Double(components[1]) {
                        completion(lat, lng)
                        //                        print("Latitude: \(lat), Longitude: \(lng)")
                    }
                }
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
            }
        }
    }
    
    func geocode(location: String, completion: @escaping (Double?, Double?, Error?) -> Void) {
        let apiKey = "AIzaSyBZ1inB67-gOCz4BbXuAyyLoU_60_vB320"
        let url = "https://maps.googleapis.com/maps/api/geocode/json"
        let parameters: Parameters = [
            "address": location,
            "key": apiKey
        ]
        
        AF.request(url, parameters: parameters)
            .validate()
            .responseJSON { response in
                switch response.result {
                case .success(let value):
                    if let json = value as? [String: Any],
                       let results = json["results"] as? [[String: Any]],
                       let geometry = results[0]["geometry"] as? [String: Any],
                       let location = geometry["location"] as? [String: Any],
                       let lat = location["lat"] as? Double,
                       let lng = location["lng"] as? Double {
                        self.lat=lat
                        self.lng=lng
                        print(self.lat)
                        print(self.lng)
                        completion(lat, lng, nil)
                    } else {
                        //                        completion(nil, AFError.responseSerializationFailed(reason: .inputDataNil))
                    }
                case .failure(let error):
                    completion(nil,nil, error)
                }
            }
    }
    
    func getdataofevents(){
        var keyword = keyword
        var location = location
        //           let autoLocation = autoDetectLocation
        var distanceValue = distance
        var categorySegmentId = ""
        switch category {
        case "Music":
            categorySegmentId = "KZFzniwnSyZfZ7v7nJ"
        case "Sports":
            categorySegmentId = "KZFzniwnSyZfZ7v7nE"
        case "Arts & Theatre":
            categorySegmentId = "KZFzniwnSyZfZ7v7na"
        case "Film":
            categorySegmentId = "KZFzniwnSyZfZ7v7nn"
        case "Miscellaneous":
            categorySegmentId = "KZFzniwnSyZfZ7v7n1"
        default:
            break
        }
        if autoDetectLocation{
            getLocationData { lat, lng in
                // Do something with the latitude and longitude values
                //                print("Latitude: \(lat), Longitude: \(lng)")
                
                
                //                print(keyword,location,autoDetectLocation,distanceValue,lat,lng,category,categorySegmentId);
                makeAPIRequest(keyword: keyword, distance: distance, segmentid: categorySegmentId, lat: lat, lng:lng)
            }
            
            
            
        }
        else{
            geocode(location: location){ lat, lng, error in
                if let error = error {
                    print("Error: \(error)")
                } else if let lat = lat, let lng = lng {
                    let lat1 = lat
                    let lng1 = lng
                    print("Latitude: \(lat1), Longitude: \(lng1)")
                    
                    
                    print(keyword,location,autoDetectLocation,distanceValue,lat1,lng1,category,categorySegmentId);
                    makeAPIRequest(keyword: keyword, distance: distance, segmentid: categorySegmentId, lat: lat1, lng:lng1)
                    
                }
            }
            
        }
        
        
        
    }
    func makeAPIRequest(keyword: String, distance: String, segmentid: String, lat: Double, lng: Double) {
        //        print(keyword,distance,segmentid,lat,lng)
        // Construct the URL with the parameters
        let endpointURLString = "https://myangularproject-381421.wl.r.appspot.com/my-nodejs-endpoint"
        
        let parameters: Parameters = [
            "param1": keyword,
            "param2": distance,
            "param3": segmentid,
            "param4": lat,
            "param5": lng
        ]
        
        // Make the request with Alamofire
        AF.request(endpointURLString, parameters: parameters)
            .validate()
            .responseJSON { response in
                switch response.result {
                case .success(let value):
                    //                            print("API call successful with response: \(value)")
                    //                            print(type(of: value))
                    if let apiResponseData = value as? [[String]] {
                        //                                                    print("Inside apiResponseData")
                        
                        self.apiResponseData = apiResponseData
                        //self.displaytable=true
                        if apiResponseData.isEmpty{
                            self.displaymassge = true
                            self.displaydata = false
                        }
                        else{
                            self.displaydata = true
                            self.displaymassge = false
                            loader1 = false
                        }
                        
                        
                        //                                print( self.$apiResponseData)
                    }
                case .failure(let error):
                    self.displaymassge = true
                    self.displaydata = false
                    loader1 = false
                    print("API call failed with error: \(error)")
                }
            }
    }
    
    func cleardata(){
        self.keyword = ""
        self.distance = "10"
        self.category = "Default"
        self.location = ""
        self.autoDetectLocation = false
        self.displaymassge = false
        self.displaydata = false
        loader1=false
    }
    
    func getnames(for keyword: String){
        let url = "https://myangularproject-381421.wl.r.appspot.com/events"
        let parameters: [String: Any] = ["keyword" : keyword]
        
        AF.request(url, parameters: parameters)
            .validate()
            .responseDecodable(of: [String].self){ response in
                switch response.result{
                case .success(let sugg):
                    self.sugg = sugg
                    print(sugg)
                    sleep(1)
                    loader = false
                case .failure(let error):
                    print("Error: \(error)")
                    loader = false
                }
                
            }
        
        
        
    }
    
    
}

//func submithandler(){
//    AF.request("http://127.0.0.1:8081/").response { response in
//        debugPrint(response)
//    }
//}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

