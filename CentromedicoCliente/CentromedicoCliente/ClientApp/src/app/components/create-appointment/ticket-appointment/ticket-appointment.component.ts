import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { citaResult } from '../../../interfaces/InterfacesDto';
import { CitaService } from '../../../services/cita.service';
import * as _moment from 'moment';
const moment = _moment;
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'app-ticket-appointment',
  templateUrl: './ticket-appointment.component.html',
  styleUrls: ['./ticket-appointment.component.css']
})

export class TicketAppointmentComponent implements OnInit, AfterViewInit, OnDestroy {

  citaDataResult: citaResult;
  isDependent: boolean;

  constructor(private router: Router, public citaSvc: CitaService) {
    moment.locale('es');

    this.citaDataResult = this.citaSvc._citaResult;
    if (!this.citaDataResult) {
      try {
        const saved = sessionStorage.getItem('lastCitaResult');
        if (saved) {
          this.citaDataResult = JSON.parse(saved);
        }
      } catch (e) {}
    }
    console.log(this.citaDataResult);
    if (this.citaDataResult != null) {
      if (this.citaDataResult.doc_identidad_tutor) {
        console.log("is dependent: " + this.citaDataResult.doc_identidad_tutor);
        this.isDependent = true;
      }
      const fechaHora: string = this.citaDataResult.fecha_hora;
      if (fechaHora) {
        this.citaDataResult.fecha_hora = _moment(fechaHora).utc().format('dddd DD MMM Y hh:mm A');
      }
    } else {
      this.router.navigate(['..']);
    }
  }

  ngOnInit(): void {
    this.forceScrollTop();
  }

  ngAfterViewInit(): void {
    this.forceScrollTop();
  }

  private forceScrollTop(): void {
    if (typeof window === 'undefined') return;

    const reset = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const target = document.querySelector('.ticket-page') || document.getElementById('print-section');
      if (target && typeof (target as HTMLElement).scrollIntoView === 'function') {
        (target as HTMLElement).scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    };

    reset();
    requestAnimationFrame(reset);
    setTimeout(reset, 50);
    setTimeout(reset, 180);
  }

  ngOnDestroy() {

  }
}
