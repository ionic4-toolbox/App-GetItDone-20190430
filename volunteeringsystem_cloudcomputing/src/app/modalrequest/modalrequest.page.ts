import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalrequest',
  templateUrl: './modalrequest.page.html',
  styleUrls: ['./modalrequest.page.scss'],
})
export class ModalrequestPage implements OnInit {

  constructor(private navParams: NavParams,
              private modalController: ModalController) { }


  public request = {
    negotiable: true
  };
  
  ngOnInit() {
    console.log(this.navParams.get('id'));
  }

  closeModal() {
    this.modalController.dismiss();
  }

  findVolunteers() {
    console.log(this.request);
  }

}
