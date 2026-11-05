import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { medico } from 'src/app/interfaces/InterfacesDto';
import { DoctorService } from 'src/app/services/doctor.service';
import * as _moment from 'moment';
import { catchError, finalize } from 'rxjs/operators';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit, OnDestroy {

  constructor(
    private rutaActiva: ActivatedRoute,
    private doctorSvc: DoctorService,
    private router: Router
  ) { }

  loading: boolean = true;
  _medico: medico;
  mode: ProgressSpinnerMode = 'indeterminate';
  medicoId: number;
  _especialidades: string = "";

  ngOnInit(): void {
    this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.medicoId = params.id;

        this.doctorSvc.GetMedicoById(this.medicoId)
          .pipe(
            catchError(err => {
              this.loading = false;
              console.error('Error al cargar perfil de médico: ' + err);
              return null;
            }),
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe((r: medico) => {
            this._medico = r;

            if (r) {
              if (r.especialidades && r.especialidades.length > 0) {
                this._especialidades = r.especialidades.join(", ");
              }
            }
          });
      }
    );
  }

  get hasHorarios(): boolean {
    if (!this._medico?.horarios) return false;
    return Object.keys(this._medico.horarios).some(day => {
      const hours = (this._medico.horarios as any)[day];
      return Array.isArray(hours) && hours.length > 0;
    });
  }

  get hasServicios(): boolean {
    return Array.isArray(this._medico?.servicios) && this._medico.servicios.length > 0;
  }

  get hasSeguros(): boolean {
    return Array.isArray(this._medico?.seguros) && this._medico.seguros.length > 0;
  }

  get hasRedes(): boolean {
    return !!(this._medico?.url_facebook || this._medico?.url_twitter || this._medico?.url_instagram);
  }

  get hasTelefonos(): boolean {
    return !!(this._medico?.telefono1 || this._medico?.telefono2);
  }

  get telefonoPrincipal(): string {
    return this._medico?.telefono1 || this._medico?.telefono2 || '809-550-5565';
  }

  Cita(): void {
    try {
      this.router.navigate(['/crear-cita', { medicoId: this.medicoId }]);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnDestroy(): void { }
}
