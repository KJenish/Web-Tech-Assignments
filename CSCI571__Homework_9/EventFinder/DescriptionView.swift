//
//  DescriptionView.swift
//  EventFinder
//
//  Created by jenish karasariya on 4/29/23.
//

import SwiftUI
import Alamofire


struct DescriptionView: View {
    var id: String
    
    @State var eventData: Data?
    var body: some View {
//        Text("Hello, World! from jenish")
//        Text(id)
        
        TabView {
            EventView(id:id)
                .tabItem {
                    Label("Events", systemImage: "text.bubble.fill")
                }
//                .onTapGesture {
////                                    fetchEventData()
//                                }
//                                .onAppear {
////                                    fetchEventData()
//                                }
            ArtistView(id:id)
                .tabItem {
                    Label("Artist/Team", systemImage: "guitars.fill")
                }
            VenueView(id:id)
                .tabItem {
                    Label("Venue", systemImage: "location.fill")
                }
            
        }
//        .overlay(
//                    Group {
//                        if eventData != nil {
//                            // Use the unwrapped data value
////                            Text(String(data: data, encoding: .utf8) ?? "")
//                        } else {
//                            // Show a loading indicator or error message
//                            ProgressView()
//                        }
//                    }
//                )
    }
    func fetchEventData() {
//        getEventData(id: id) { result in
//            switch result {
//            case .success(let data):
//                eventData = data
//            case .failure(let error):
//                print(error.localizedDescription)
//            }
//        }
    }
}

struct DescriptionView_Previews: PreviewProvider {
    static var previews: some View {
        DescriptionView(id:"")
        
    
    }
}

public func getEData(id: String, completion: @escaping (Result<Data, Error>) -> Void) {
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

