////
////  ArtistView.swift
////  EventFinder
////
////  Created by jenish karasariya on 4/30/23.
////
//
import SwiftUI
import Alamofire
import Kingfisher

struct artist: Hashable {
    var name: String
    var followers: Int
    var popularity: Int
    var spotify_link: String
    var image: String
    var id: String
    var album1: String
    var album2: String
    var album3: String
}

struct ArtistView: View {
    var id:String
    @State private var artistArray: [String] = []
    @State private var Type_genre: String = ""
    @State var spotifyDatass = [artist]()
    var popularity: Double = 0.75
    @State var showspotidata = true
    @State var showmsj = false
    @State public var isloading2 = true

    var body: some View {
        VStack{
            if isloading2{
                Spacer()
                ProgressView("Please wait...")
                Spacer()
            }
            else{
                if showspotidata{  ScrollView {
                    ForEach(spotifyDatass, id: \.self) { art in
                        VStack(alignment: .leading) {
                            HStack{
                                KFImage(URL(string: art.image))
                                    .resizable()
                                    .frame(width: 100,height: 100)
                                    .cornerRadius(10)
                                HStack{
                                    VStack{
                                        Text(art.name)
                                            .foregroundColor(.white)
                                            .fontWeight(.bold)
                                            .multilineTextAlignment(.center)
                                            .multilineTextAlignment(/*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                                        HStack{
                                            Text(formatFollowers(count: art.followers))
                                                .fontWeight(.bold)
                                                .foregroundColor(.white)
                                                .font(.system(size: 15))
                                                .padding(3)
                                            Text("Followers").foregroundColor(.white)
                                                .padding(5)
                                                .font(.system(size: 10))
                                        }
                                        HStack{
                                            Link(destination: URL(string: art.spotify_link)!){
                                                Image("spotify_logo")
                                                    .resizable()
                                                    .frame(width: 30,height: 30)
                                            }
                                            Text("Spotify")
                                                .foregroundColor(.green)
                                        }
                                    }
                                    //.padding(.horizontal)
                                    VStack{
                                        Text("Popularity")
                                            .foregroundColor(.white)
                                            .multilineTextAlignment(.center)
                                        ZStack{
                                            Circle()
                                                .stroke(Color.orange.opacity(0.3),
                                                        style: StrokeStyle(lineWidth:15))
                                                .frame(width: 50,height: 50)
                                            Circle()
                                                .trim(from: 0, to: Double(art.popularity)/100)
                                                .stroke(Color.orange,
                                                        style: StrokeStyle(lineWidth:15))
                                                .rotationEffect(.init(degrees: -90))
                                                .frame(width: 50,height: 50)
                                            
                                            Text(String(art.popularity))
                                                .foregroundColor(Color.white)
                                        }
                                        .padding(20)
                                    }
                                }
                            }
                            Text("Popular Albums")
                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                                .foregroundColor(.white)
                            //.multilineTextAlignment(.leading)
                            HStack{
                                KFImage(URL(string: art.album1)!)
                                    .resizable()
                                    .frame(width: 80,height: 80)
                                    .cornerRadius(10)
                                    .padding(10)
                                KFImage(URL(string: art.album2)!)
                                    .resizable()
                                    .frame(width: 80,height: 80)
                                    .cornerRadius(10)
                                    .padding(10)
                                KFImage(URL(string: art.album3)!)
                                    .resizable()
                                    .frame(width: 80,height: 80)
                                    .cornerRadius(10)
                                    .padding(10)
                            }
                        }
                        .padding(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
                        .background(Color.black.opacity(0.7))
                        .cornerRadius(5)
                        
                    }
                }
                .padding(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
                
                }
                if showmsj{
                    Text("No music related artist details to show")
                                        .font(.title)
                                        .fontWeight(.bold)
                                        .multilineTextAlignment(.center)
                                        .padding(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
                                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
                }
            }
        }
        .onAppear {
            getEventData(id: id) { result in
                switch result {
                case .success(let data):
                    do {
                        let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
                        if let Type_genre = json?["Type_genre"] as? String {
                            DispatchQueue.main.async {
                                self.Type_genre = Type_genre
                                print(self.Type_genre)
                                
                            }
                        }
                        if let artistArray = json?["artistArray"] as? [String] {
                            DispatchQueue.main.async {
                                self.artistArray = artistArray
                                print(self.artistArray)
                                if(self.Type_genre == "Music"){
                                    self.showspotidata=true
                                    self.showmsj=false
                                    spotifySearch(myArray:self.artistArray){spotifyDatass in
                                        self.spotifyDatass = spotifyDatass
                                        isloading2=false
                                    }
                                }
                                else{
                                    isloading2=false
                                    self.showmsj=true
                                    self.showspotidata=false
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
        }
        
        
    }
    
    func spotifySearch(myArray: [String], completion: @escaping ([artist]) -> Void) {
        let url = "https://myangularproject-381421.wl.r.appspot.com/Spotify-search"
        let parameters = ["arrayparam": myArray]
        
        AF.request(url, parameters: parameters).validate().responseJSON { response in
            switch response.result {
            case .success(let value):
                if var data = value as? [Dictionary<String, Any>] {
                    print(data)
                    var spotData: [artist] = []
                    var len = data.count
                    for i in 0...len-1{
                        var newArt = artist(name: data[i]["name"] as! String, followers:data[i]["followers"] as! Int, popularity: data[i]["popularity"] as! Int, spotify_link: data[i]["spotify_link"] as! String, image:data[i]["image"] as! String, id:data[i]["id"] as! String, album1: data[i]["album1"] as! String, album2: data[i]["album2"] as! String, album3: data[i]["album3"] as! String)
                        
                        spotData.append(newArt)
                    }
                    completion(spotData)
                } else {
                    let error = NSError(domain: "Invalid response data", code: 0, userInfo: nil)
                    //completion(.failure(error))
                }
            case .failure(let error):
                print("error")
                // completion(.failure(error))
            }
        }
    }
    
    func formatFollowers(count: Int) -> String {
        if count >= 1000000 {
            let millions = Double(count) / 1000000.0
            return String(format: "%.1fM", millions)
        } else if count >= 1000 {
            let thousands = Double(count) / 1000.0
            return String(format: "%.1fK", thousands)
        } else {
            return String(count)
        }
    }
    
}

struct ArtistView_Previews: PreviewProvider {
    static var previews: some View {
        ArtistView(id:"")
    }
}

