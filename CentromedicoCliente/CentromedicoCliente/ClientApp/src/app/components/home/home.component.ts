import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CorreoPregunta } from '../../interfaces/InterfacesDto';
import { PreguntaService } from '../../services/pregunta.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DialogSuccessedEmail } from '../contact/contact.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  // ---- Map (ubicaciones) ----
  markers: { name: string; position: { lat: number; lng: number } }[] = [];
  center = { lat: 18.436234, lng: -69.46064 };
  zoom = 8;
  options: google.maps.MapOptions = {
    fullscreenControl: false,
    scrollwheel: false,
    zoomControl: false,
    scaleControl: true,
    disableDoubleClickZoom: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    maxZoom: 15,
    minZoom: 7,
  };

  // ---- Contact form ----
  contactFormGroup: FormGroup;
  serverMsj: string = "";
  contactForm: CorreoPregunta;
  isSent: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder, private preguntaSvc: PreguntaService) { }

  ngOnInit(): void {
    // Map markers
    this.markers.push({
      position: { lat: 18.4634403, lng: -69.9499557 },
      name: 'La Romana'
    });
    this.markers.push({
      position: { lat: 18.4296925, lng: -68.9656023 },
      name: 'Santo Domingo'
    });

    // Contact form
    this.contactFormGroup = this._formBuilder.group({
      nameControl: ['', Validators.required],
      reasonControl: [0, Validators.required],
      emailControl: ['', [
        Validators.required,
        Validators.email,
      ]],
      phoneControl: ['', Validators.required],
      messageControl: ['', Validators.required]
    });
  }

  openDialog(): void {
    this.dialog.open(DialogSuccessedEmail);
  }

  onClickSubmit(): void {
    const formdata = this.contactFormGroup.value;
    if (this.contactFormGroup.valid) {
      this.isSent = true;
      this.contactForm = {
        "nombre": formdata.nameControl,
        "correo": formdata.emailControl,
        "motivo": formdata.reasonControl,
        "mensaje": formdata.messageControl,
        "contacto": formdata.phoneControl
      };

      try {
        this.preguntaSvc.SendQuestion(this.contactForm).subscribe((r) => {
          this.serverMsj = "";
          this.contactFormGroup.reset();
          this.openDialog();
          this.isSent = false;
        }, err => {
          this.isSent = false;
          this.serverMsj = err;
        });
      } catch (e) {
        this.isSent = false;
        this.serverMsj = e;
      }
    }
  }

  // ---- Map methods ----
  openInfoWindow(marker: MapMarker): void {
    this.infoWindow.open(marker);
  }

  setCenter(lat: number, lng: number): void {
    this.zoom = 8;
    this.center = { lat, lng };
  }

  setFocus(lat: number, lng: number): void {
    this.zoom = 14;
    this.center = { lat, lng };
  }
}
