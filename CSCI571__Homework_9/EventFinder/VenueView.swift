//
//  VenueView.swift
//  EventFinder
//
//  Created by jenish karasariya on 4/30/23.
//

import SwiftUI
import Alamofire
import MapKit


struct VenueView: View {
    var id:String
    //    @State private var isLoading = true
    //    @State private var data: String? = nil
    @State var displaydata=false
    @State private var eventName: String = ""
    @State private var venue: String = ""
    @State private var Address: String = ""
    @State private var PhoneNumber: String = ""
    @State private var OpenHours: String = ""
    @State private var GeneraleRule: String = ""
    @State private var childrules: String = ""
    @State private var map_location: String = ""
    @State public var lat: Double? = 34.073851
    @State public var lng: Double? = -118.2399583
    @State private var showingSheet = false
    @State public var isloading1 = true
    
    
    var body: some View {
        
        VStack{
            if isloading1{
                Spacer()
                ProgressView("Please wait...")
                Spacer()
            }
            else{
                VStack {
                    Text(eventName)
                        .font(.system(size: 24, weight: .bold))
                        .multilineTextAlignment(.center)
                        .padding()
                    HStack{
                        VStack(alignment: .center) {
                            Text("Name")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            Text(venue)
                                .fixedSize(horizontal: false, vertical: false)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding(.bottom)
                    HStack{
                        VStack(alignment: .center) {
                            Text("Address")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            Text(Address)
                                .fixedSize(horizontal: false, vertical: false)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding(.bottom)
                    HStack{
                        VStack(alignment: .center) {
                            Text("Phone Number")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            Text(PhoneNumber)
                                .lineLimit(1)
                                .truncationMode(.tail)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding(.bottom)
                    HStack{
                        VStack(alignment: .center) {
                            Text("Open Hours")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            ScrollView {
                                Text(OpenHours)
                                    .frame(maxWidth: .infinity)
                            }
                            .frame(height: 70)
                            .foregroundColor(.gray)
                        }
                    }
                    HStack{
                        VStack(alignment: .center) {
                            Text("Generale Rule")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            ScrollView {
                                Text(GeneraleRule)
                                    .frame(maxWidth: .infinity)
                            }
                            .frame(height: 70)
                            .foregroundColor(.gray)
                        }
                    }
                    
                    HStack{
                        VStack(alignment: .center) {
                            Text("Child Rule")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            ScrollView {
                                Text(childrules)
                                    .frame(maxWidth: .infinity)
                            }
                            .frame(height: 70)
                            .foregroundColor(.gray)
                        }
                    }
                    HStack{
                        Button("Show venue on maps"){
                           
                            showingSheet = true
                            
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth:200)
                        .background(Color.red)
                        .cornerRadius(10)
                        .sheet(isPresented: $showingSheet, content: {
                            
                            MapViewSheet(location: CLLocationCoordinate2D(latitude: self.lat!, longitude: self.lng!))
                                .padding(10)
                        })
                    }
                    
                }
            }
                
                
        }
        
        
        
       
        .padding(.bottom)
        .padding([.leading, .bottom, .trailing])
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .onAppear {
            
            //                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            //                    isLoading = false
            getData(id: id) { result in
                switch result {
                case .success(let data):
                    self.displaydata=true
                    do {
                        //                                DispatchQueue.main.async {
                        //                                    self.isLoading = false
                        //                                }
                        let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
                        if let eventName = json?["event_name"] as? String {
                            DispatchQueue.main.async {
                                self.eventName = eventName
                            }
                        }
                        
                        if let venue = json?["venue"] as? String {
                            DispatchQueue.main.async {
                                self.venue = venue
                                getVen(venue: venue){result in
                                    switch result{
                                    case .success(let data):
                                        do{
                                            let json = try JSONSerialization.jsonObject(with: data,options: []) as?
                                            [String:Any]
                                            if let map_location = json?["map_location"] as? String{
                                                DispatchQueue.main.async {
                                                    self.map_location = map_location
                                                    print(self.map_location)
                                                }
                                            }
                                            geocode(location: map_location){ lati, lngi, error in
                                                if let error = error {
                                                    print("Error: \(error)")
                                                } else {
                                                    lat = lati
                                                    lng = lngi
                                                    isloading1=false
                                                    print("hello")
                                                    print(lat)
                                                    print(lng)
                                                }
                                            }
                                            if let Address = json?["Address"] as? String{
                                                DispatchQueue.main.async {
                                                    self.Address = Address
                                                }
                                                
                                            }
                                            if let PhoneNumber = json?["PhoneNumber"] as? String{
                                                DispatchQueue.main.async {
                                                    self.PhoneNumber = PhoneNumber
                                                }
                                                
                                            }
                                            if let OpenHours = json?["OpenHours"] as? String{
                                                DispatchQueue.main.async {
                                                    self.OpenHours = OpenHours
                                                }
                                                
                                            }
                                            if let GeneraleRule = json?["GeneraleRule"] as? String{
                                                DispatchQueue.main.async {
                                                    self.GeneraleRule = GeneraleRule
                                                }
                                                
                                            }
                                            if let childrules = json?["childrules"] as? String{
                                                DispatchQueue.main.async {
                                                    self.childrules = childrules
                                                }
                                                
                                            }
                                            
                                            
                                            
                                            
                                        }
                                        catch{
                                            print("Error parsing JSON: \(error.localizedDescription)")
                                        }
                                    case .failure(let error):
                                        print("Error retrieving event data: \(error.localizedDescription)")
                                    }
                                }
                            }
                        }
                    } catch {
                        print("Error parsing JSON: \(error.localizedDescription)")
                    }
                case .failure(let error):
                    print("Error retrieving event data: \(error.localizedDescription)")
                }
            }
//            geocode(location: map_location){ lati, lngi, error in
//                if let error = error {
//                    print("Error: \(error)")
//                } else {
//                    lat = lati
//                    lng = lngi
//                    print("hello")
//                    print(lat)
//                    print(lng)
//                }
//            }
        }
        
    }
    
    func geocode(location: String, completion: @escaping (Double?, Double?, Error?) -> Void) {
        let apiKey = "AIzaSyBZ1inB67-gOCz4BbXuAyyLoU_60_vB320"
        let url = "https://maps.googleapis.com/maps/api/geocode/json"
        let parameters: Parameters = [
            "address": location,
            "key": apiKey
        ]
        print("location:" + location)
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
                        //print(self.lat)
                        //print(self.lng)
                        completion(lat, lng, nil)
                        
                        
                    } else {
                        //                        completion(nil, AFError.responseSerializationFailed(reason: .inputDataNil))
                    }
                case .failure(let error):
                    completion(nil,nil, error)
                }
            }
    }
    
}

struct VenueView_Previews: PreviewProvider {
    static var previews: some View {
        VenueView(id:"")
    }
}

public func getData(id: String, completion: @escaping (Result<Data, Error>) -> Void) {
    let url = "https://myangularproject-381421.wl.r.appspot.com/event-search"
    let parameters = ["id": id]
    AF.request(url, parameters: parameters).validate().responseData { response in
        switch response.result {
        case .success(let data):
            
            completion(.success(data))
        case .failure(let error):
            completion(.failure(error))
        }
    }
}

public func getVen(venue:String,completion:@escaping(Result<Data,Error>) -> Void){
    let url = "https://myangularproject-381421.wl.r.appspot.com/venue-search"
    let parameters = ["id": venue]
    AF.request(url, parameters: parameters).validate().responseData { response in
        switch response.result {
        case .success(let data):
            
            completion(.success(data))
        case .failure(let error):
            completion(.failure(error))
        }
    }
}

struct MapViewSheet: View {
    let location: CLLocationCoordinate2D
    
    var body: some View {
        Map(coordinateRegion: .constant(MKCoordinateRegion(center: location, span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05))), annotationItems: [LocationAnnotation(coordinate: location)]) { annotation in
            MapMarker(coordinate: annotation.coordinate, tint: .red)
        }
    }
}

struct LocationAnnotation: Identifiable {
    let id = UUID()
    let coordinate: CLLocationCoordinate2D
}
