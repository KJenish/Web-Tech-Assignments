//
//  EventView.swift
//  EventFinder
//
//  Created by jenish karasariya on 4/30/23.
//

import SwiftUI
import Alamofire
import Kingfisher
import SwiftUIX

struct EventView: View {
    var id:String
    @State private var eventName: String = ""
    @State private var seatMap: String = ""
    @State private var ticketURL: String = ""
    @State private var ticketStatus: String = ""
    @State private var artist: String = ""
    @State private var artistArray: [String] = []
    @State private var date: String = ""
    @State private var genreType: String = ""
    @State private var priceRange: String = ""
    @State private var venue: String = ""
    @State private var Type_genre: String = ""
    @State var deletedisplay = false
    @State var showdisplay = true
    @State private var showToast = false
    //@State private var toastMessage = ""
    @State private var savedEvent = false
    @State private var removedFavorite = false
    
    @State var onsale = false
    @State var offsale = false
    @State var rescheduled=false
    @State var postponed=false
    @State var canceled=false
    @State var displaydata=false
    @State private var isLoading = true
    @State private var data: String? = nil
    @Environment(\.presentationMode) var presentationMode
    
    
    var body: some View {
        
        VStack {
            if isLoading {
                Spacer()
                ProgressView("Please wait...")
                Spacer()
            } else {
                VStack {

                    Text(eventName)
                        .font(.system(size: 24, weight: .bold))
                        .multilineTextAlignment(.center)
                        .padding()
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Date")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            Text(date)
                                .fixedSize(horizontal: false, vertical: false)
                                .foregroundColor(.gray)
                        }
                        Spacer()
                        VStack(alignment: .trailing) {
                            Text("Artist | Team")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            Text(artist)
                                .fixedSize(horizontal: false, vertical: false)
                                .foregroundColor(.gray)

                        }
                    }
                    .padding(.bottom)
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Venue")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            Text(venue)
                                .fixedSize(horizontal: false, vertical: false)
                                .foregroundColor(.gray)

                        }
                        Spacer()
                        VStack(alignment: .trailing) {
                            Text("Genre")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            Text(genreType)
                                .fixedSize(horizontal: false, vertical: false)
                                .foregroundColor(.gray)

                        }
                    }
                    .padding(.bottom)
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Price Range")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            Text(priceRange)
                                .fixedSize(horizontal: false, vertical: false)
                                .foregroundColor(.gray)

                        }
                        Spacer()
                        VStack(alignment: .trailing) {
                            Text("Ticket Status")
                                .fontWeight(.bold)
                                .fixedSize(horizontal: false, vertical: false)
                            //                                Text(ticketStatus)
                            //                                    .fixedSize(horizontal: false, vertical: false)
                            if onsale{
                                Text("Onsale")
                                    .frame(width: 100.0)
                                    .background(Color.green)
                                    .foregroundColor(.white)
                                    .cornerRadius(3.0)
                            }
                            if offsale{
                                Text("offsale")
                                    .frame(width: 100.0)
                                    .background(Color.red)
                                    .foregroundColor(.white)
                                    .cornerRadius(3.0)
                            }
                            if rescheduled{
                                Text("rescheduled")
                                    .frame(width: 100.0)
                                    .background(Color.orange)
                                    .foregroundColor(.white)
                                    .cornerRadius(3.0)
                            }
                            if postponed{
                                Text("postponed")
                                    .frame(width: 100.0)
                                    .background(Color.orange)
                                    .foregroundColor(.white)
                                    .cornerRadius(3.0)
                            }
                            if canceled{
                                Text("canceled")
                                    .frame(width: 100.0)
                                    .background(Color.black)
                                    .foregroundColor(.white)
                                    .cornerRadius(3.0)
                            }
                        }
                    }
                    .padding(.bottom)
                    if showdisplay {
                        HStack{
                        Button(action: {
                            // Handle button tap here
                            saveEvent(eventName:eventName, date: date, genreType: genreType, venue: venue, id: id)
                            withAnimation {
                                self.showToast = true
                                            }
                        }) {
                            Text("Save Event")
                                .font(.headline)
                                .foregroundColor(.white)
                                .padding()
                                .frame(maxWidth:150)
                                .background(Color.blue)
                                .cornerRadius(10)
                                .onAppear {
                                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                                    withAnimation {
                                        showToast = false
                                    }
                                }
                            }
                        }.padding()

                    }
                    }
                    if deletedisplay{ HStack{
                        Button(action: {
                            // Handle button tap here
                            deleteEventFromStorage(eventId:self.id)
                            withAnimation {
                                            //self.showToast.toggle()
                                self.showToast = true
                                            }
                        }) {
                                Text("Remove Favorite")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .padding()
                                    .frame(maxWidth:150)
                                    .background(Color.red)
                                    .cornerRadius(10)
                                    .onAppear {
                                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                                            withAnimation {
                                                showToast = false
                                            }
                                        }
                                    }
                            }.padding()
                            //.toast(isShowing: $showToast, text: Text("Remove favorites!"))

                    }}
                            
                    HStack{
                        KFImage(URL(string: seatMap))
                            .resizable()
                            .frame(width: 300, height: 200)
                            .cornerRadius(10)
                            //.padding(.top, 60)
                    }
                    HStack{
                        Text("Buy Ticket At:")
                            .fontWeight(.bold)
                        Text("Ticketmaster")
                            .onTapGesture {
                                guard let url = URL(string: ticketURL) else { return }
                                UIApplication.shared.open(url)
                            }
                            .foregroundColor(/*@START_MENU_TOKEN@*/.blue/*@END_MENU_TOKEN@*/)
                    }
                    HStack{
                        Text("Share on:")
                            .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                        Image("facebook")
                            .resizable()
                            .frame(width: 30,height: 30)
                            .onTapGesture {
                                guard let url = URL(string: "https://www.facebook.com/sharer/sharer.php?u=\(ticketURL)") else { return }
                                UIApplication.shared.open(url)
                            }
                        Image("twitter")
                            .resizable()
                            .frame(width: 30,height: 30)
                            .onTapGesture {
                                let encodedEventName = eventName.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed) ?? ""
                                guard let url = URL(string: "https://twitter.com/intent/tweet?text=Check%20\(encodedEventName)%20on%20Ticketmaster&url=\(ticketURL)") else { return }
                                UIApplication.shared.open(url)
                            }
                    }
                    Spacer()

                }
                Spacer()
                    .padding(.bottom,40.0)
                // Existing VStack code
            }
        }
        .padding(.horizontal)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .toast(isShowing: $showToast, text: showdisplay ? Text("Remove event favorites") : Text("Added to favorites!!"))
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                isLoading = false
                getEventData(id: id) { result in
                    switch result {
                    case .success(let data):
                        self.displaydata=true
                        do {
                            DispatchQueue.main.async {
                                self.isLoading = false
                                
                            }
                            let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
                            if let eventName = json?["event_name"] as? String {
                                DispatchQueue.main.async {
                                    self.eventName = eventName
                                }
                            }
                            if let seatMap = json?["Seat_map"] as? String {
                                DispatchQueue.main.async {
                                    self.seatMap = seatMap
                                }
                            }
                            if let ticketURL = json?["Ticket_URL"] as? String {
                                DispatchQueue.main.async {
                                    self.ticketURL = ticketURL
                                }
                            }
                            if let ticketStatus = json?["Ticket_status"] as? String {
                                DispatchQueue.main.async {
                                    self.ticketStatus = ticketStatus
                                }
                                if(ticketStatus == "onsale"){
                                    self.onsale = true
                                }
                                if(ticketStatus == "rescheduled"){
                                    self.rescheduled = true
                                }
                                if(ticketStatus == "offsale"){
                                    self.offsale = true
                                }
                                if(ticketStatus == "postponed"){
                                    self.postponed = true
                                }
                                if(ticketStatus == "canceled"){
                                    self.canceled = true
                                }
                            }
                            if let artist = json?["artist"] as? String {
                                DispatchQueue.main.async {
                                    self.artist = artist
                                }
                            }
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
                                }
                            }
                            if let date = json?["date"] as? String {
                                DispatchQueue.main.async {
                                    self.date = date
                                }
                            }
                            if let genreType = json?["genre_type"] as? String {
                                DispatchQueue.main.async {
                                    self.genreType = genreType
                                }
                            }
                            if let priceRange = json?["price_range"] as? String {
                                DispatchQueue.main.async {
                                    self.priceRange = priceRange
                                }
                            }
                            if let venue = json?["venue"] as? String {
                                DispatchQueue.main.async {
                                    self.venue = venue
                                }
                            }
                        } catch {
                            print("Error parsing JSON: \(error.localizedDescription)")
                        }
                    case .failure(let error):
                        print("Error retrieving event data: \(error.localizedDescription)")
                    }
                }
                let defaults = UserDefaults.standard
                            let eventCount = defaults.integer(forKey: "event_count")
                            var eventExists = false
                            for i in 0..<eventCount {
                                let id1 = defaults.string(forKey: "id_\(i)") ?? ""
                                if id1 == id {
                                    eventExists = true
                                    break
                                }
                            }

                            // Update visibility of buttons based on event existence
                            if eventExists {
                                self.showdisplay = false
                                self.deletedisplay = true
                            } else {
                                self.showdisplay = true
                                self.deletedisplay = false
                            }
            }
        }
    }

    func saveEvent(eventName: String, date: String, genreType: String, venue: String,id:String) {
        self.showdisplay = false;
        self.deletedisplay = true;
        let defaults = UserDefaults.standard
        let eventCount = defaults.integer(forKey: "event_count")
        
        defaults.setValue(eventName, forKey: "event_name_\(eventCount)")
        defaults.setValue(date, forKey: "event_date_\(eventCount)")
        defaults.setValue(genreType, forKey: "event_genre_type_\(eventCount)")
        defaults.setValue(venue, forKey: "event_venue_\(eventCount)")
        defaults.setValue(id, forKey: "id_\(eventCount)")
        defaults.setValue(eventCount, forKey: "event_id_\(eventCount)")
        
        defaults.setValue(eventCount + 1, forKey: "event_count")
    }
    
    func deleteEventFromStorage(eventId: String) {
        self.deletedisplay=false
        self.showdisplay=true
        let defaults = UserDefaults.standard
        let eventCount = defaults.integer(forKey: "event_count")
        
        // find the index of the event with the given id
        var indexToDelete: Int?
        for i in 0..<eventCount {
            let id = defaults.string(forKey: "id_\(i)") ?? ""
            if id == eventId {
                indexToDelete = i
                break
            }
        }
        
        // if an event with the given id is found, delete it from storage
        if let index = indexToDelete {
            // shift all events after the deleted event back by one index
            for i in (index+1)..<eventCount {
                let eventName = defaults.string(forKey: "event_name_\(i)") ?? ""
                let date = defaults.string(forKey: "event_date_\(i)") ?? ""
                let genreType = defaults.string(forKey: "event_genre_type_\(i)") ?? ""
                let venue = defaults.string(forKey: "event_venue_\(i)") ?? ""
                let id = defaults.string(forKey: "id_\(i)") ?? ""
                
                defaults.set(eventName, forKey: "event_name_\(i-1)")
                defaults.set(date, forKey: "event_date_\(i-1)")
                defaults.set(genreType, forKey: "event_genre_type_\(i-1)")
                defaults.set(venue, forKey: "event_venue_\(i-1)")
                defaults.set(id, forKey: "id_\(i-1)")
            }
            
            // remove the last (now duplicate) event
            defaults.removeObject(forKey: "event_name_\(eventCount-1)")
            defaults.removeObject(forKey: "event_date_\(eventCount-1)")
            defaults.removeObject(forKey: "event_genre_type_\(eventCount-1)")
            defaults.removeObject(forKey: "event_venue_\(eventCount-1)")
            defaults.removeObject(forKey: "id_\(eventCount-1)")
            
            // update the event count
            defaults.set(eventCount-1, forKey: "event_count")
        }
    }
    
}

extension View {
    func toast(isShowing: Binding<Bool>, text: Text) -> some View {
        Toast(isShowing: isShowing,
              presenting: { self },
              text: text)
    }
}

struct EventView_Previews: PreviewProvider {
    static var previews: some View {
        EventView(id: "")
    }
}

public func getEventData(id: String, completion: @escaping (Result<Data, Error>) -> Void) {
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

struct Toast<Presenting>: View where Presenting: View {

    /// The binding that decides the appropriate drawing in the body.
    @Binding var isShowing: Bool
    /// The view that will be "presenting" this toast
    let presenting: () -> Presenting
    /// The text to show
    let text: Text

    var body: some View {

        GeometryReader { geometry in
            
            ZStack(alignment: .center) {
                
                self.presenting()
                    .blur(radius: self.isShowing ? 1 : 0)
                
                VStack {
                    self.text
                }
                .frame(width: geometry.size.width / 2,
                       height: geometry.size.height / 5)
                .background(Color.secondary.colorInvert())
                .foregroundColor(Color.primary)
                .cornerRadius(20)
                .transition(.slide)
                .opacity(self.isShowing ? 1 : 0)
        }

        }

    }

}
