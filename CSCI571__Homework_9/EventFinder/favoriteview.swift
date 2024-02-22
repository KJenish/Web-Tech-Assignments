//
//  favoriteview.swift
//  EventFinder
//
//  Created by jenish karasariya on 5/2/23.
//

import SwiftUI
import Alamofire



struct favoriteview: View {
    
    @State var events: [Event] = []
    @State var eventsToDelete: [Event] = []

    var body: some View {
        NavigationView{
            displaySavedEvents()
        }
        .navigationTitle("Favorites")
        .onAppear {
            loadSavedEvents()
        }
    }
    
    func displaySavedEvents() -> some View {
        let defaults = UserDefaults.standard
        let eventCount = defaults.integer(forKey: "event_count")

        events.removeAll()
        
        for i in 0..<eventCount {
            let eventName = defaults.string(forKey: "event_name_\(i)") ?? "No event name saved"
            let date = defaults.string(forKey: "event_date_\(i)") ?? "No event date saved"
            let genreType = defaults.string(forKey: "event_genre_type_\(i)") ?? "No event genre type saved"
            let venue = defaults.string(forKey: "event_venue_\(i)") ?? "No event venue saved"
            let id = defaults.string(forKey: "id_\(i)") ?? "No event id saved"
            
            let event = Event(eventName: eventName, date: date, genreType: genreType, venue: venue, id: id)
            events.append(event)
        }
        
        return List{
            ForEach(events, id: \.id) { event in
                HStack(spacing: 8) {
                    Text(event.date)
                        .font(.system(size: 12))
                    Text(event.eventName)
                        .font(.system(size: 12))
                        .lineLimit(2)
                    Text(event.genreType)
                        .font(.system(size: 12))
                    Text(event.venue)
                        .font(.system(size: 12))
                }
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Color.white)
                )
                
            }
            .onDelete(perform:  { indexSet in
                deleteEvents(at: indexSet)
                if events.isEmpty {
                    eventsToDelete.removeAll()
                }
            })
            
        }
      
            
    
        
        .overlay(
               eventCount == 0 ?
                   Text("No favorites found")
                       .foregroundColor(.red)
                       .padding() :
                   nil
           )
    }
    func loadSavedEvents() {
            let defaults = UserDefaults.standard
            let eventCount = defaults.integer(forKey: "event_count")
            
            var events: [Event] = []
            
            for i in 0..<eventCount {
                let eventName = defaults.string(forKey: "event_name_\(i)") ?? "No event name saved"
                let date = defaults.string(forKey: "event_date_\(i)") ?? "No event date saved"
                let genreType = defaults.string(forKey: "event_genre_type_\(i)") ?? "No event genre type saved"
                let venue = defaults.string(forKey: "event_venue_\(i)") ?? "No event venue saved"
                let id = defaults.string(forKey: "id_\(i)") ?? "No event id saved"
                
                let event = Event(eventName: eventName, date: date, genreType: genreType, venue: venue, id: id)
                events.append(event)
            }
            
            self.events = events
        }
    func deleteEventFromStorage(eventId: String) {
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
    
    func deleteEvents(at offsets: IndexSet) {
        let defaults = UserDefaults.standard
        var eventCount = defaults.integer(forKey: "event_count")
        
        // Remove selected events from storage
        for index in offsets {
            let eventId = events[index].id
            
            // Find the index of the event with the given id
            var indexToDelete: Int?
            for i in 0..<eventCount {
                let id = defaults.string(forKey: "id_\(i)") ?? ""
                if id == eventId {
                    indexToDelete = i
                    break
                }
            }
            
            // If an event with the given id is found, delete it from storage
            if let index = indexToDelete {
                // Shift all events after the deleted event back by one index
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
                
                // Remove the last (now duplicate) event
                defaults.removeObject(forKey: "event_name_\(eventCount-1)")
                defaults.removeObject(forKey: "event_date_\(eventCount-1)")
                defaults.removeObject(forKey: "event_genre_type_\(eventCount-1)")
                defaults.removeObject(forKey: "event_venue_\(eventCount-1)")
                defaults.removeObject(forKey: "id_\(eventCount-1)")
                
                // Update the event count
                eventCount -= 1
                defaults.set(eventCount, forKey: "event_count")
                loadSavedEvents()
            }
        }
        
       
        eventsToDelete.removeAll(where: { _ in true })


        
        // Clear the eventsToDelete array
        eventsToDelete.removeAll()
    }

    
    
}



struct favoriteview_Previews: PreviewProvider {
    static var previews: some View {
        favoriteview()
    }
}

//struct Event: Identifiable {
//    var id = UUID()
//    var name: String
//    var date: String
//    var genreType: String
//    var venue: String
//    var eventId: String
//}

struct Event {
    let eventName: String
    let date: String
    let genreType: String
    let venue: String
    let id: String
}
