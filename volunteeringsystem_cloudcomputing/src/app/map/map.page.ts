import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import '../../assets/geolocation-marker.js';
import { ModalrequestPage } from '../modalrequest/modalrequest.page';
import { User } from '../Models/user.js';
import { RequestService } from '../services/request.service.js';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs';
import { GeoService } from '../services/geo.service.js';
import { VolunteerService } from '../services/volunteer.service.js';

declare var google;
declare var GeolocationMarker;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {

  //public variables here
  @ViewChild('map')
  public mapElement: ElementRef;
  public map: any;
  public hits = new BehaviorSubject([]);

  //private variables here
  private lat: any;
  private lng: any;
  private loading: any;
  private users: User[];
  private volunteersLocation: any;
  private subscription1: any;
  private subscription2: any;
  private volunteers: any;



  

  constructor(private navCtrl: NavController,
              private geoService: GeoService,
              private volunteerService: VolunteerService,
              private geolocation: Geolocation,
              private modalController: ModalController,
              private loadingController: LoadingController) { 

    this.subscription1 = this.geoService.volunteersLocation.subscribe(volunteers => {
      this.volunteersLocation = volunteers
      console.log(this.volunteersLocation);
    });

    this.subscription2 = this.geoService.volunteers.subscribe(ele => {
      this.volunteers = ele;
      console.log('Volunteers', this.volunteers)
    });
  }

  ngOnInit() {
    this.loadingController.create({
      message: 'Setting satellites in position..'
    }).then( overlay => {
      this.loading = overlay;
      this.loading.present();
      this.getLocation();
    })
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }

  ionViewDidLoad(){
    
  }


  getLocation() {
    this.geolocation.getCurrentPosition().then( pos => {
      this.loading.dismiss();
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      // Uncomment this to load map.
      // this.initMap();
      this.geoService.getVolunteersLocation(10, [this.lat, this.lng]);
    })
  }

  initMap() {
    let coords = new google.maps.LatLng(this.lat, this.lng);
    let mapoptions = google.maps.MapOptions = {
      center: coords,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapoptions);
    let geoMarker = new GeolocationMarker(this.map);
  }

  async openRequestForm() {
    const modal = await this.modalController.create({
      component: ModalrequestPage,
      componentProps: {
        id: 1
      }
    });

    modal.onDidDismiss().then( newRequest => {
      console.log(newRequest);
      if(newRequest['data']){

      }else{

      }
    })

    return await modal.present();
  }
}
