import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';

@Component({
    selector: 'app-dialog-pospone-appointment',
    templateUrl: './dialog-pospone-appointment.component.html',
    styleUrls: ['./dialog-pospone-appointment.component.css']
})
export class DialogPosponeAppointmentComponent implements OnInit {
    reason: string = '';

    constructor(
        public dialogRef: MatDialogRef<DialogPosponeAppointmentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
    }

    get cita(): any {
        return this.data?.cita;
    }

    get formattedDate(): string {
        if (!this.cita?.fecha_hora) return '';
        return _moment(this.cita.fecha_hora).locale('es').format('dddd, D [de] MMMM [de] YYYY • hh:mm A');
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirm(): void {
        this._snackBar.open('Su cita ha sido puesta para posponer, le notificaremos cuando el personal confirme dicha acción.', 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
        this.dialogRef.close({ confirmed: true, reason: this.reason });
    }
}
