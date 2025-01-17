import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Request } from '../Models/request';
import { VolunteerService } from '../services/volunteer.service';
import { Constants } from '../Models/constants';
import { RequestService } from '../services/request.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-modalrequest',
  templateUrl: './modalrequest.page.html',
  styleUrls: ['./modalrequest.page.scss'],
})
export class ModalrequestPage implements OnInit {

  constructor(private navParams: NavParams,
              private modalController: ModalController,
              private geolocation: Geolocation,
              private alertController: AlertController,
              private requestService: RequestService,
              private loadingController: LoadingController) {

    this.geolocation.getCurrentPosition().then( pos => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
    })
}


  private lat: any;
  private lng: any;
  private loading: any;

  request: Request;
  

  ngOnInit() {
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
  }

  closeModal() {
    this.modalController.dismiss();
  }

  saveRequest(requestForm: NgForm) {
    console.log(requestForm.value);
    requestForm.value.createdAt = new Date().getTime();
    requestForm.value.lat = this.lat;
    requestForm.value.lng = this.lng;
    this.loadingController.create({
      message: 'Saving Request'
    }).then(overlay => {
      this.loading = overlay;
      this.loading.present();
    })

    this.requestService.addRequest(requestForm.value).then( savedRequest => {
      console.log(savedRequest);
      this.loading.dismiss();
      this.findVolunteers();
    });
   
  }

  findVolunteers(){
    // this.volunteerService.findVolunteers(reqObj).subscribe( response => {
    //   console.log(response);
    //   if(response.length == 0){
    //     this.createAlert(response);
    //   }else{

    //   }
    // })
  }

  async createAlert(response: any){
    let length = response.length;
    const alert = await this.alertController.create({
      header: 'Success',
      message: length == 0 ? Constants.SUCCESS_LENGTH_0 : `${Constants.SUCCESS} ${length} volunteers!`,
      animated: true,
      buttons: [{
        text: 'Okay',
        cssClass: 'secondary',
        handler: () => {
          if(length > 0){
            this.modalController.dismiss(response);
          }else{
            this.modalController.dismiss();
          }
          
        }
      }]
    })
    await alert.present();
  }

}
