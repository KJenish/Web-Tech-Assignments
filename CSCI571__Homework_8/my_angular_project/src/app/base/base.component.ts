import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { GoogleMapsModule } from '@angular/google-maps';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import axios from 'axios';
import {
  filter,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
})
export class BaseComponent {
  auto_location: boolean = false;
  location: string = '';

  renderer: any;
  tabledisplay = false;
  el: any;
  carddisplay = false;
  Pricedisplay = true;
  Artistdisplay = true;
  Genredisplay = true;
  onsaledisplay = false;
  rescheduleddisplay = false;
  offsaledisplay = false;
  postponeddisplay = false;
  canceleddisplay = false;
  expanded: boolean = false;
  expanded1: boolean = false;
  expanded2: boolean = false;
  displayNoRecord = false;
  // mapDialog: ComponentType<unknown>;

  displaytbback() {
    setTimeout(() => {
      // Sort the table by Date column
      this.sortTable();
    });
    this.tabledisplay = true;
    this.carddisplay = false;

  }

  toggleLocation(): void {
    if (this.auto_location) {
      this.location = '';
    }
  }

  async auto_loc(): Promise<number[]> {
    let arr: number[];
    const response = await fetch('https://ipinfo.io/json?token=9611e33e821242');
    const data = await response.json();

    //console.log("hiiiiiiiiii",data);
    //var ip = jsonResponse.ip;
    const cord = String(data.loc).split(',');
    const floatNumber1 = parseFloat(cord[0]);
    const lat = parseFloat(floatNumber1.toFixed(4));
    const floatNumber2 = parseFloat(cord[1]);
    const lng = parseFloat(floatNumber2.toFixed(4));
    //var lat =37.7749;
    //var long =-122.4194;
    //var city = jsonResponse.city;
    // console.log("hiii22222222",lat, lng);
    arr = new Array<number>(lat, lng);

    //console.log(geohash);

    //console.log(arr);
    return arr;
  }

  async getCoordinates(address: string) {
    try {
      event?.preventDefault();
      let arr: number[];
      console.log('here2');
      const apiKey = 'AIzaSyBZ1inB67-gOCz4BbXuAyyLoU_60_vB320';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );
      const data = await response.json();
      //console.log(data);
      if (data?.results?.length > 0) {
        //console.log('hello');
        const latlon = data.results[0].geometry.location;
        const lat = latlon['lat'];
        const lng = latlon['lng'];
        //  console.log(lat,lng);
        arr = new Array<number>(lat, lng);
        //console.log(arr);
        return arr;
      } else {
        // document.getElementById('table-container').innerHTML = "";
        // document.getElementById('venue_address').style.display = "none";
        // document.getElementById('event_list').style.display = "none";

        // const txt = "<p class='error_msj'>No Records Found</p>"
        // document.getElementById('table-container').innerHTML = txt;
        return [];
      }
    } catch (error) {
      // document.getElementById('table-container').innerHTML = "";
      // document.getElementById('venue_address').style.display = "none";
      // document.getElementById('event_list').style.display = "none";

      // const txt = "<p class='error_msj'>No Records Found</p>"
      // document.getElementById('table-container').innerHTML = txt;
      return [];
    }
  }

  async getFormData(form: Event) {
    form.preventDefault();
    this.carddisplay = false;
    const keyword1 = document.getElementById('keyword') as HTMLInputElement;
    const location1 = document.getElementById('location') as HTMLInputElement;
    const distance1 = document.getElementById('distance') as HTMLInputElement;
    const category1 = document.getElementById('category') as HTMLInputElement;
    const autoLocation = document.querySelector(
      '#auto_location'
    ) as HTMLInputElement;
    const keywordIsValid = keyword1.checkValidity();
    const locationIsValid = location1.checkValidity();

    if (!keywordIsValid || !locationIsValid) {
      location1.reportValidity();
      keyword1.reportValidity();
      return;
    }

    const keyword = keyword1.value;
    const location = location1.value;
    const distance = distance1.value || '10';
    const category = category1.value;
    console.log(keyword, distance, category, location);

    let lat = 0;
    let lng = 0;
    let arr = [];
    let segmentid = '';

    switch (category) {
      case 'Music':
        segmentid = 'KZFzniwnSyZfZ7v7nJ';
        break;
      case 'Sports':
        segmentid = 'KZFzniwnSyZfZ7v7nE';
        break;
      case 'Arts & Theatre':
        segmentid = 'KZFzniwnSyZfZ7v7na';
        break;
      case 'Film':
        segmentid = 'KZFzniwnSyZfZ7v7nn';
        break;
      case 'Miscellaneous':
        segmentid = 'KZFzniwnSyZfZ7v7n1';
        break;
      default:
        segmentid = '';
    }

    if (autoLocation.checked) {
      try {
        console.log('in');
        arr = await this.auto_loc();
        console.log(arr);
        lat = arr[0];
        lng = arr[1];
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('here');
      arr = await this.getCoordinates(location);
      console.log('here1');
      console.log(arr);
      if (arr.length === 0) {
        //const tableContainer = document.getElementById('table-container');

        return;
      }
      lat = arr[0];
      lng = arr[1];
    }
    this.fetchData(keyword, distance, segmentid, lat, lng);
  }

  // ngOnInit() {
  //   axios.get('http://localhost:3000/api/data')
  //     .then(response => response.data)
  //     .then(data =>  {
  //       console.log(data);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }
  searchkeywordctrl = new FormControl();
  filteredkeyword: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 1;
  selectedKeyword: any = '';

  onSelected() {
    //  console.log(this.selectedKeyword);
    this.selectedKeyword = this.selectedKeyword.name;
  }

  displayWith(value: any) {
    return value;
  }

  clearSelection() {
    this.selectedKeyword = '';
    this.filteredkeyword = [];
  }

  ngOnInit() {
    this.searchkeywordctrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';
          this.filteredkeyword = [];
          this.isLoading = true;
        }),
        // switchMap(value => axios.get('http://localhost:3000/api/events?keyword='+value)
        // .then(response => {
        //   console.log(response)
        //   this.isLoading = false;
        //   console.log(response.data);
        //   console.log(response.data._embedded.attractions);
        //   return response.data._embedded.attractions;

        // })
        // .catch(error => {
        //   this.isLoading = false;
        //   throw error;
        // })
        // ))
        switchMap((value) =>
          axios
            .get('https://myangularproject-381421.wl.r.appspot.com/events?keyword=' + value)
            // .get('http://localhost:8081/events?keyword=' + value)
            .then((response) => {
              //console.log(response);
              this.isLoading = false;
              return response.data._embedded.attractions;
            })
            .catch((error) => {
              this.isLoading = false;
              throw error;
            })
        )
      )
      .subscribe((data: any) => {
        // console.log('Data:', data);
        if (data == undefined) {
          this.errorMsg = data['Error'];
          this.filteredkeyword = [];
        } else {
          this.errorMsg = '';
          this.filteredkeyword = data;
        }
        //  console.log('Filtered Keywords:', this.filteredkeyword); // Check the filtered keyword array
      });
  }

  tableData: any[] = [];

  async fetchData(
    keyword: string,
    distance: string,
    segmentid: string,
    lat: number,
    lng: number
  ) {
    try {
      const response = await axios.get(
        `https://myangularproject-381421.wl.r.appspot.com/my-nodejs-endpoint?param1=${keyword}&param2=${distance}&param3=${segmentid}&param4=${lat}&param5=${lng}`
        // `http://localhost:8081/my-nodejs-endpoint?param1=${keyword}&param2=${distance}&param3=${segmentid}&param4=${lat}&param5=${lng}`
      );
      // console.log(response);
      this.tableData = response.data as any[];
      setTimeout(() => {
        // Sort the table by Date column
        this.sortTable();
      });
      this.displayNoRecord = false;
      this.tabledisplay = true;
      this.carddisplay = false;

      const tableContainer = document.querySelector(
        '#table-container'
      ) as HTMLDivElement;
      if (tableContainer) {
        // tableContainer.innerHTML = tableHTML;

        this.sortTable();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Display a "No Record Found" message to the user
        this.displayNoRecord = true;
        this.tabledisplay = false;
        console.log('No Record Found');
      } else {
        // Handle other types of errors
        console.error(error);
      }

      console.error(error);
    }
  }

  //sortingDirection = 'asc';

  // makeTableSortable() {
  //   const table = document.querySelector('table');
  //   const tbody = table?.querySelector('tbody');
  //   const headers = table?.querySelectorAll('th');

  //   headers?.forEach((header, index) => {
  //     if (
  //       header.textContent === 'Date'

  //     ) {
  //       header.addEventListener('click', () => {
  //         const rows = Array.from(tbody?.querySelectorAll('tr') || []);
  //         const sortedRows = rows.sort((a, b) => {
  //           const cellA = a.querySelector(`td:nth-child(${index + 1})`);
  //           const cellB = b.querySelector(`td:nth-child(${index + 1})`);
  //           let comparison = 0;
  //           if (header.textContent === 'Genre') {
  //             comparison =
  //               cellA?.textContent
  //                 ?.toLowerCase()
  //                 .localeCompare(cellB?.textContent?.toLowerCase() || '') || 0;
  //           } else {
  //             comparison =
  //               cellA?.textContent?.localeCompare(cellB?.textContent || '') ||
  //               0;
  //           }
  //           return this.sortingDirection === 'asc' ? comparison : -comparison;
  //         });
  //         table?.querySelector('tbody')?.append(...sortedRows);
  //         this.sortingDirection =
  //           this.sortingDirection === 'asc' ? 'desc' : 'asc';
  //       });
  //     }
  //   });
  // }

  sortTable() {
    const table = document.getElementsByTagName('table')[0];
    const rows = Array.from(table.rows).slice(1); // exclude the header row
    const sortedRows = rows.sort((a, b) => {
      const dateA = new Date(a.cells[0].innerText);
      const dateB = new Date(b.cells[0].innerText);
      return dateA.getTime() - dateB.getTime();
    });
    table.tBodies[0].append(...sortedRows);
  }

  //event-detail api
  public eventName?: string;
  public datetime1?: string;
  public artist?: string;
  public venue?: string;
  public genere_type?: string;
  public price_range?: string;
  public Ticket_status?: string;
  public Ticket_URL?: string;
  public seat_map?: string;
  public fav = true;
  public fav1 = false;
  public fav_list: any;
  public id!: string;
  displayNoSpoRecord= false;
  displaySpoRecord=true;

  async getEventData(id: string): Promise<any> {
    try {
      this.onsaledisplay = false;
      this.rescheduleddisplay = false;
      this.offsaledisplay = false;
      this.postponeddisplay = false;
      this.canceleddisplay = false;
      this.tabledisplay = false;
      this.carddisplay = true;
      // const url = `https://myangularproject-381421.wl.r.appspot.com/event-search?id=${id}`;
      const url = `http://localhost:8081/event-search?id=${id}`;
      console.log(url);
      const response = await axios.get(url);
      // console.log(response);
      const data = response.data;
      console.log(data);
      this.eventName = data._embedded.events[0]?.name;
      console.log(this.eventName);

      //print date
      var date = false;
      this.datetime1 = '';
      if (data._embedded.events[0].dates) {
        if (data._embedded.events[0].dates.start.localDate != '') {
          //textContent = "<p class = 'headerValue'>Date: </p><br>";
          date = true;
          this.datetime1 = data._embedded.events[0].dates.start.localDate;
        }
        // if (data._embedded.events[0].dates.start?.localTime != '' ||data._embedded.events[0].dates.start?.localTime?.toLowerCase() != 'undefined' || data._embedded.events[0].dates.start.localTime?.toLowerCase() != undefined ) {
        if ('localTime' in data._embedded.events[0].dates.start) {
          if (date) {
            this.datetime1 += ' ';
          }
          this.datetime1 += data._embedded.events[0].dates.start.localTime;
          //textContent += "<p class = 'dataValue'>" + datetime1 + "</p>";
        } else {
          // textContent += "<p class = 'dataValue'>" + datetime1 + "</p>";
        }
      }

      //print Artist/Team
      this.artist = '';
      var artistTeam = [];
      if (data._embedded.events[0]._embedded.attractions) {
        if (data._embedded.events[0]._embedded.attractions != 'undefined') {
          this.Artistdisplay = true;
          for (
            var i = 0;
            i < data._embedded.events[0]._embedded.attractions.length;
            i++
          ) {
            if ('name' in data._embedded.events[0]._embedded.attractions[i]) {
             
              if (i > 0) {
                this.artist += ' | ';
              }
              this.artist +=
                data._embedded.events[0]._embedded.attractions[i].name;
              artistTeam.push(
                data._embedded.events[0]._embedded.attractions[i].name
              );
            } else {
              this.Artistdisplay = false;
              artistTeam = [];
              //this.artist += `<p class='art1'> ${data._embedded.events[0]._embedded.attractions[i].name}</p>`
            }
          }
          console.log("after for loop",artistTeam)

          // textContent += "<p class = 'headerValue'> Artist/Team </p><br>";
          // textContent += "<p class = 'dataValue'>" + artist + "</p>";
        }
        else {
          this.Artistdisplay = false;
          //this.artist += `<p class='art1'> ${data._embedded.events[0]._embedded.attractions[i].name}</p>`
        }
      }
      else {
        this.Artistdisplay = false;
        this.displayNoSpoRecord=true;
        this.displaySpoRecord=false;
        //this.artist += `<p class='art1'> ${data._embedded.events[0]._embedded.attractions[i].name}</p>`
      }
      console.log(artistTeam);

      //print venue name
      this.venue = '';
      this.venue = data._embedded.events[0]._embedded.venues[0].name;

      //type of genere
      this.genere_type = '';
      let subgnere = false,
        genre = false,
        sub_type = false,
        seg = true;
      var spo_genere_type;

      if (data._embedded.events[0].classifications) {
        if (
          data._embedded.events[0].classifications[0].subGenre &&
          data._embedded.events[0].classifications[0].subGenre?.name &&
          data._embedded.events[0].classifications[0].subGenre?.name.toLowerCase() !=
            'undefined'
        ) {
          this.genere_type +=
            data._embedded.events[0].classifications[0].subGenre?.name;
          subgnere = true;
        }
        if (
          data._embedded.events[0].classifications[0].genre &&
          data._embedded.events[0].classifications[0].genre?.name &&
          data._embedded.events[0].classifications[0].genre?.name.toLowerCase() !=
            'undefined'
        ) {
          if (subgnere) {
            this.genere_type += ' | ';
          }
          this.genere_type +=
            data._embedded.events[0].classifications[0].genre?.name;
          genre = true;
        }
        if (
          data._embedded.events[0].classifications[0].segment &&
          data._embedded.events[0].classifications[0].segment?.name &&
          data._embedded.events[0].classifications[0].segment?.name.toLowerCase() !=
            'undefined'
        ) {
          if (subgnere || genre) {
            this.genere_type += ' | ';
          }
          this.genere_type +=
            data._embedded.events[0].classifications[0].segment?.name;
          spo_genere_type =
            data._embedded.events[0].classifications[0].segment?.name;
          seg = true;
        }
        if (
          data._embedded.events[0].classifications[0].subType &&
          data._embedded.events[0].classifications[0].subType?.name &&
          data._embedded.events[0].classifications[0].subType?.name.toLowerCase() !=
            'undefined'
        ) {
          if (subgnere || genre || seg) {
            this.genere_type += ' | ';
          }
          this.genere_type +=
            data._embedded.events[0].classifications[0].subType?.name;
          sub_type = true;
        }
        if (
          data._embedded.events[0].classifications[0].type &&
          data._embedded.events[0].classifications[0].type?.name &&
          data._embedded.events[0].classifications[0].type?.name.toLowerCase() !=
            'undefined'
        ) {
          if (subgnere || genre || seg || sub_type) {
            this.genere_type += ' | ';
          }
          this.genere_type +=
            data._embedded.events[0].classifications[0].type?.name;
        }
      }
      console.log(artistTeam);
      if (spo_genere_type == 'Music') {
        if(artistTeam.length >= 1){
          this.SpotifySearch(artistTeam);

        }
      } else {
        this.displayNoSpoRecord = true;
        this.displaySpoRecord =false;
        
        console.log('not in Music Segment');
      }
      //price range

      this.price_range = '';
      if (data._embedded.events[0].priceRanges) {
        if (
          data._embedded.events[0].priceRanges[0].min != '' &&
          data._embedded.events[0].priceRanges[0].max != '' &&
          data._embedded.events[0].priceRanges[0].currency != ''
        ) {
          this.Pricedisplay = true;
          var val1 = data._embedded.events[0].priceRanges[0].min;
          console.log(val1);
          var min = val1.toString();
          var val2 = data._embedded.events[0].priceRanges[0].max;
          console.log(val2);
          var max = val2.toString();
          var curr = data._embedded.events[0].priceRanges[0].currency;
          console.log(curr);
          this.price_range = min.concat(' - ', max, ' ', curr);
          console.log(this.price_range);
          // textContent += "<p class = 'headerValue'> Price Ranges </p><br>";
          // textContent += "<p class = 'dataValue'>" + price_range + "</p>";
        }
      } else {
        this.Pricedisplay = false;
        console.log('no price range');
      }

      //ticket status
      //var butt;
      if (data._embedded.events[0].dates.status.code) {
        this.Ticket_status = data._embedded.events[0].dates.status.code;
        console.log(this.Ticket_status);

        if (this.Ticket_status == 'onsale') {
          this.onsaledisplay = true;
          //butt = "<p class = 'btt1'> On Sale</p>"
        } else if (this.Ticket_status == 'rescheduled') {
          this.rescheduleddisplay = true;
          //butt = "<p class = 'btt2'> Rescheduled</p>"
        } else if (this.Ticket_status == 'offsale') {
          this.offsaledisplay = true;
          //butt = "<p class = 'btt3'> Off sale</p>"
        } else if (this.Ticket_status == 'postponed') {
          this.postponeddisplay = true;
          //butt = "<p class = 'btt4'> Postponed</p>"
        } else if (this.Ticket_status == 'canceled') {
          this.canceleddisplay = true;
          //butt = "<p class = 'btt5'> Canceled</p>"
        }
      }

      // buy ticket at
      this.Ticket_URL = data._embedded.events[0].url;

      //map print

      // var txt2 = '';
      // if (data._embedded.events[0].seatmap && data._embedded.events[0].seatmap!='undefined' && data._embedded.events[0].seatmap!=undefined) {
      this.seat_map ='';
      if ('seatmap' in data._embedded.events[0]) {
        this.seat_map = data._embedded.events[0].seatmap.staticUrl;
        // txt2 = "<img class='imagesetter' src=\"" + seat_map + "\">";
        // document.getElementById("id2").innerHTML = txt2;
      } else {
        console.log('Hello');
        // document.getElementById("id2").innerHTML="";
        // document.getElementById("id2").innerHTML = txt2;

        //document.getElementById("id2").style.display = "none";
      }

      this.id = '';
      this.id = data._embedded.events[0].id;
      this.fav_list = '';
      //favorite array
      this.fav_list = {
        event: this.eventName,
        Date: data._embedded.events[0].dates.start.localDate,
        Category: this.genere_type,
        Venue: this.venue,
        id: data._embedded.events[0].id,
      };
      // var fav = true;

      // if(this.fav == false){
      //   // localStorage.clear();
      //   console.log('fav change to true')
      //   // this.getfavoritedata();
      //   // this.removefavoritedata('Z7r9jZ1AdjPb0')

      // }

      this.checkFavorite(this.id);

      // const div = this.el.nativeElement.querySelector('event_list');
      // this.renderer.addClass(div, 'event_box');

      // div.innerHTML = `<p>${event_name} </p>`;
      if (this.venue) {
        // console.log()
        var venue1 = [];
        this.getVenueData(this.venue);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async favo() {
    this.fav1 = true;
    this.fav = false;
    await this.addfavoritedata(this.fav_list);
  }

  public venue_name?: string;
  public addressline?: string;
  public phonenumber?: string;
  public openhours?: string;
  public genralrules?: string;
  public childrules?: string;
  phonedisplay = true;
  openhourdisply = true;
  GenralruleDisplay = true;
  childruleDisplay = true;

  async getVenueData(id: string): Promise<any> {
    try {
      this.tabledisplay = false;
      this.carddisplay = true;
      // const url = `https://myangularproject-381421.wl.r.appspot.com/venue-search?id=${id}`;
      const url = `http://localhost:8081/venue-search?id=${id}`;
      console.log(url);
      const response = await axios.get(url);
      const data = response.data;
      console.log(data);

      //print address
      var address,
        add1 = false,
        city1 = false,
        statecode1 = false,
        postal_code1 = false,
        statename1 = false,
        city,
        stateCode,
        postal_code,
        statename,
        map,
        venue,
        venue1 = false;
      if (data._embedded.venues) {
        if (data._embedded.venues[0].address?.line1 != undefined) {
          address = data._embedded.venues[0].address.line1;
          add1 = true;
        }
        if (data._embedded.venues[0].city?.name != undefined) {
          city = data._embedded.venues[0].city.name;
          city1 = true;
        }
        if (data._embedded.venues[0].state?.stateCode != undefined) {
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
          this.venue_name = data._embedded.venues[0].name;
          venue1 = true;
        }
      }
      this.addressline = '';
      if (add1) {
        this.addressline += address;
      }
      if (city1) {
        this.addressline += city + ',';
      }
      if (statecode1) {
        this.addressline += stateCode;
      }
      if (postal_code1) {
        this.addressline += postal_code;
      }
      let arr = [];
      if (add1 || city1 || statecode1 || postal_code1 || statename1 || venue1) {
        map = this.venue_name?.concat(
          ',',
          address,
          ',',
          city,
          ',',
          statename,
          ',',
          postal_code
        );
        if (map) {
          // arr = this.getCoordinates(map);

          // console.log('here');
          arr = await this.getCoordinates(map);
          this.coordinates = { lat: arr[0], lng: arr[1] };
          //console.log(this.center);
          this.mapOptions = {
            center: { lat: parseFloat(this.coordinates.lat), lng: parseFloat(this.coordinates.lng) },
            zoom: 14
          }
          this.marker = {
            position: { lat: parseFloat(this.coordinates.lat), lng: parseFloat(this.coordinates.lng) }
          }
          //this.getmaplocation(map);
        }
      }


      // const center = { lat: 0, lng: 0 };

      this.phonenumber = '';
      this.openhours = '';
      if ('boxOfficeInfo' in data._embedded.venues[0]) {
        if ('phoneNumberDetail' in data._embedded.venues[0].boxOfficeInfo) {
          this.phonedisplay = true;
          this.phonenumber =
            data._embedded.venues[0].boxOfficeInfo?.phoneNumberDetail;
        } else {
          this.phonedisplay = false;
        }
       
      } else {
        this.phonedisplay = false;
      }

      if ('boxOfficeInfo' in data._embedded.venues[0]) {
        if ('openHoursDetail' in data._embedded.venues[0].boxOfficeInfo) {
          this.openhourdisply = true;
          this.openhours =
            data._embedded.venues[0].boxOfficeInfo.openHoursDetail;
        }
        else {
          this.openhourdisply = false;
        }
      } else {
        this.openhourdisply = false;
      }
      this.genralrules = '';
      this.childrules = '';
      if ('generalInfo' in data._embedded.venues[0]) {
        if ('generalRule' in data._embedded.venues[0].generalInfo) {
          this.GenralruleDisplay = true;
          this.genralrules = data._embedded.venues[0].generalInfo.generalRule;
          console.log(this.genralrules);
        }
        else {
          this.GenralruleDisplay = false;
        }
      } else {
        this.GenralruleDisplay = false;
      }
      if ('generalInfo' in data._embedded.venues[0]) {
        if ('childRule' in data._embedded.venues[0].generalInfo) {
          this.childruleDisplay = true;
          this.childrules = data._embedded.venues[0].generalInfo.childRule;
          console.log(this.childrules);
        }
        else {
          this.childruleDisplay = false;
        }
      } else {
        this.childruleDisplay = false;
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  coordinates: any;

  //center: any;
  showMapFlag = false;

  // showMap() {
  //   console.log('ShowMap called');
  //   this.showMapFlag = true;
  // }

  // async getmaplocation(venueName: string){
  //   try{

  //     const apiKey = 'AIzaSyDdxzQz2LsKEIIcBc1r4ffo-Fu9zKHcSsY';
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //         venueName
  //       )}&key=${apiKey}`
  //     );

  //   //var mapres = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(venueName)}&key=AIzaSyDdxzQz2LsKEIIcBc1r4ffo-Fu9zKHcSsY`);
  //   const data = await response.json();
  //   console.log(data);
  //     this.center = data.results[0].geometry.location;
  // }
  // catch (error) {
  //   console.error(error);
  // }
  // }
  //constructor(public dialog: MatDialog) {}


  // openMapDialog() {
  //   this.dialog.open(MapDialogComponent, {
  //     data: { center: this.center },
  //   });
  // }
  // public spo_artist_name?:string;
  // public artist_popularity?:string;
  // public artist_image?:string;
  // public followers?:string;
  // public spotify_link?:string;
  public spotifyData = new Array();

  async SpotifySearch(myArray: string[]) {
    try {
      this.displayNoSpoRecord=false;
      this.displaySpoRecord=true;
      let params = {
        arrayparam: myArray,
      };
      console.log('inside spoti');
      //myArray = ["taylor swift"];

      // const url = `https://myangularproject-381421.wl.r.appspot.com/Spotify-search`;
      const url = `http://localhost:8081/Spotify-search`;
      //console.log(url);
      const response = await axios.get(url, { params });9
      this.spotifyData = response.data;
      //  this.spo_artist_name = data.artists.items[0].name;
      // // this.artist_popularity = data.artists.items[0].popularity;
      // this.artist_popularity = '75';
      // this. artist_image = data.artists.items[0].images[2].url;
      // this.followers =  data.artists.items[0].followers.total;
      // this.spotify_link = data.artists.items[1].external_urls.spotify;
      // //console.log(artist_name,artist_popularity,artist_image,followers,spotify_link);
      // var artist_id = data.artists.items[0].id;
      console.log('spotify data', this.spotifyData);
      for (let val of this.spotifyData) {
        val.active = false;
      }
      this.spotifyData[0].active = true;
    } catch (error) {
      this.displayNoSpoRecord=true;
      this.displaySpoRecord=false;
      console.log(error);
    }
  }
  //images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  // public favoritearray = new Array;
  favorites: any[] = [];

  ngAfterViewInit() {
    const prefix = 'favorite_';
    for (let key in localStorage) {
      if (key.startsWith(prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          this.favorites.push(JSON.parse(value));
        }
      }
    }
  }

  checkFavorite(id: string) {
    const favoriteIds = this.favorites.map((f) => f.id);
    if (favoriteIds.includes(id)) {
      // The ID is in the favorites array
      this.fav1 = true;
      this.fav = false;
    } else {
      // The ID is not in the favorites array
      this.fav1 = false;
      this.fav = true;
    }
  }

  // async getflagval(){

  // }

  // async addfavoritedata(arr :any){

  //   // console.log("initial array",this.favoritearray);
  //   console.log("favorite array from fetching",arr);
  //   // this.favoritearray.push(arr);
  //   // console.log("add array",this.favoritearray);
  //   localStorage.setItem(arr.id, JSON.stringify(arr));

  // }

  async addfavoritedata(arr: any) {
    this.favorites.push(arr);
    localStorage.setItem(`favorite_${arr.id}`, JSON.stringify(arr));
    alert('Event Added to Favorites');
  }

  // async getfavoritedata(){
  //   // var arr = localStorage.getItem(id);
  //   // console.log("fatch data from local storaje",arr);
  //   for (let key in localStorage) {
  //     const value = localStorage.getItem(key);
  //     if (value) {
  //       console.log(`${key}: ${value}`);
  //     }
  //   }

  // }

  // async getfavoritedata() {
  //   const prefix = 'favorite_';
  //   this.favorites = [];
  //   for (let key in localStorage) {
  //     if (key.startsWith(prefix)) {
  //       const value = localStorage.getItem(key);
  //       if (value) {
  //         const favorite = JSON.parse(value);
  //         this.favorites.push(favorite);
  //       }
  //     }
  //   }
  //   console.log("code inside get function",this.favorites);
  // }

  // async removefavoritedata(id:string){
  //   localStorage.removeItem(id);
  // }
  async removefavoritedata(id: string) {
    this.fav = true;
    this.fav1 = false;
    const index = this.favorites.findIndex((f) => f.id === id);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
    localStorage.removeItem(`favorite_${id}`);
    alert('Removed from favorites!');
  }

  async clearData() {
    this.tabledisplay = false;
    this.carddisplay = false;
    // console.log('inside clear');
    (document.getElementById('event_form') as HTMLFormElement).reset();
  }

  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
 }
 marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
 }


  // mapOptions: google.maps.MapOptions = {
  //   center:{lat: this.center.lat,lng:this.center.lng},

  //   zoom:14
    
  // }
  // marker= {
  //   //position:{lat: parseFloat(this.center.lat),lng:parseFloat(this.center.lng)}
  //   position:{lat: this.center.lat,lng:this.center.lng}
  // }
  constructor(private modalService: NgbModal) {}

  open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
			},
			(reason) => {

			},
		);
	}

}




// @Component({
//   selector: 'app-map-dialog',
//   template: ` <google-map [center]="data.center">
//   <map-marker [position]="data.center"></map-marker>
// </google-map>`

// })

// export class MapDialogComponent {
//   constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
// }
