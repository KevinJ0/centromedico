import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { CorreoPregunta, especialidad, seguro } from '../../interfaces/InterfacesDto';
import { PreguntaService } from '../../services/pregunta.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { SeguroService } from '../../services/seguro.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DialogSuccessedEmail } from '../dialog-successed-email/dialog-successed-email.component';
import * as L from 'leaflet';

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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  // ---- Hero Quick Search ----
  heroDoctorName: string = '';
  heroSpecialtyId: string = '';
  heroSeguroId: string = '';
  especialidades$: Observable<especialidad[]>;
  seguros$: Observable<seguro[]>;
  popularSpecialties: { id: number; name: string }[] = [
    { id: 1, name: 'Cardiología' },
    { id: 2, name: 'Pediatría' },
    { id: 3, name: 'Ginecología' },
    { id: 4, name: 'Medicina Interna' },
    { id: 5, name: 'Ortopedia' }
  ];

  // ---- Map (ubicaciones con Leaflet) ----
  private map: L.Map;
  private leafletMarkers: { [key: string]: L.Marker } = {};
  markers: { id: string; name: string; address: string; phone: string; position: { lat: number; lng: number } }[] = [];
  center = { lat: 18.436234, lng: -69.46064 };
  zoom = 8;
  activeSede: 'all' | 'romana' | 'sd' = 'all';
  selectedMarker: { name: string; address: string; phone: string } | null = null;

  // ---- Contact form ----
  contactFormGroup: FormGroup;
  serverMsj: string = "";
  contactForm: CorreoPregunta;
  isSent: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private preguntaSvc: PreguntaService,
    private router: Router,
    private especialidadSvc: EspecialidadService,
    private seguroSvc: SeguroService
  ) { }

  ngOnInit(): void {
    // Carga optimizada de especialidades y seguros con shareReplay(1)
    this.especialidades$ = this.especialidadSvc.GetEspecialidades()
      .pipe(
        tap(specs => {
          if (specs && specs.length > 0) {
            this.popularSpecialties = specs.slice(0, 5).map(s => ({ id: s.id, name: s.descrip }));
          }
        }),
        shareReplay(1),
        catchError(err => {
          console.error('Error al cargar especialidades en home:', err);
          return of([]);
        })
      );

    this.seguros$ = this.seguroSvc.GetSeguros()
      .pipe(
        shareReplay(1),
        catchError(err => {
          console.error('Error al cargar seguros en home:', err);
          return of([]);
        })
      );

    // Map markers with accurate coordinates for each campus
    this.markers = [
      {
        id: 'romana',
        position: { lat: 18.4296925, lng: -68.9656023 },
        name: 'Hospital Salvador — Sede La Romana',
        address: 'Calle Dolores Tejeda, La Romana 22000',
        phone: '809-550-5565'
      },
      {
        id: 'sd',
        position: { lat: 18.4634403, lng: -69.9499557 },
        name: 'Hospital Salvador — Sede Santo Domingo',
        address: 'Av. Rafael Augusto Sánchez 45, Santo Domingo',
        phone: '809-550-5565'
      }
    ];

    this.selectedMarker = this.markers[0];

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

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    if (typeof window === 'undefined') return;

    // Inicializar mapa de Leaflet centrado en República Dominicana
    this.map = L.map('hospital-leaflet-map', {
      center: [this.center.lat, this.center.lng],
      zoom: this.zoom,
      scrollWheelZoom: false,
      zoomControl: true
    });

    // Capa de mapas Esri World Street Map (alta definición, calidad corporativa, sin API key ni advertencias)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> &mdash; Esri, DeLorme, TomTom',
      maxZoom: 19
    }).addTo(this.map);

    // Pin médico personalizado con el color primario del Hospital (#186cb2)
    const customPin = L.divIcon({
      className: 'medical-map-pin-container',
      html: `
        <div class="medical-map-pin">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M19 10.5V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4.5A4.5 4.5 0 0 0 9.5 15h.5v3H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-2v-3h.5a4.5 4.5 0 0 0 4.5-4.5zM7 6h10v4H7V6zm4 11v-2h2v2h-2zm-1.5-4a2.5 2.5 0 0 1-2.5-2.5V12h10v.5a2.5 2.5 0 0 1-2.5 2.5h-5z"/>
          </svg>
        </div>
      `,
      iconSize: [38, 44],
      iconAnchor: [19, 42],
      popupAnchor: [0, -38]
    });

    // Agregar marcadores
    this.markers.forEach(m => {
      const marker = L.marker([m.position.lat, m.position.lng], { icon: customPin }).addTo(this.map);
      marker.bindPopup(`
        <div class="map-popup">
          <strong class="map-popup__title" style="color: #0a2540; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.25rem; display: block;">${m.name}</strong>
          <p class="map-popup__line" style="margin: 0 0 0.2rem; color: #5b6472; font-size: 0.85rem;">${m.address}</p>
          <p class="map-popup__line" style="margin: 0; color: #186cb2; font-size: 0.85rem; font-weight: 600;">Tel: ${m.phone}</p>
        </div>
      `);
      this.leafletMarkers[m.id] = marker;
    });

    // Asegurar redimensionamiento correcto una vez renderizado el contenedor
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);
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
        this.preguntaSvc.SendQuestion(this.contactForm).subscribe(() => {
          this.serverMsj = "";
          this.contactFormGroup.reset({ reasonControl: 0 });
          this.openDialog();
          this.isSent = false;
        }, err => {
          this.isSent = false;
          this.serverMsj = typeof err === 'string' ? err : 'No se pudo enviar el mensaje en este momento. Intenta nuevamente.';
        });
      } catch (e) {
        this.isSent = false;
        this.serverMsj = 'Error al procesar la solicitud.';
      }
    }
  }

  // ---- Hero Quick Search methods ----
  onSearchHero(): void {
    const queryParams: any = {};
    if (this.heroDoctorName && this.heroDoctorName.trim()) {
      queryParams.nombre = this.heroDoctorName.trim();
    }
    if (this.heroSpecialtyId && this.heroSpecialtyId !== '0') {
      queryParams.especialidad = this.heroSpecialtyId;
    }
    if (this.heroSeguroId && this.heroSeguroId !== '0') {
      queryParams.seguro = this.heroSeguroId;
    }
    this.router.navigate(['/medicos'], { queryParams });
  }

  onSelectQuickSpecialty(id: number): void {
    this.router.navigate(['/medicos'], { queryParams: { especialidad: id } });
  }

  // ---- Map methods ----
  setCenter(lat: number, lng: number): void {
    this.activeSede = 'all';
    this.zoom = 8;
    this.center = { lat, lng };
    if (this.map) {
      this.map.flyTo([lat, lng], 8, { duration: 1.2 });
      this.map.closePopup();
    }
  }

  setFocus(lat: number, lng: number, sede?: 'romana' | 'sd'): void {
    if (sede) {
      this.activeSede = sede;
    }
    this.zoom = 15;
    this.center = { lat, lng };
    if (this.map) {
      this.map.flyTo([lat, lng], 15, { duration: 1.2 });
      if (sede && this.leafletMarkers[sede]) {
        this.leafletMarkers[sede].openPopup();
      }
    }
  }
}
