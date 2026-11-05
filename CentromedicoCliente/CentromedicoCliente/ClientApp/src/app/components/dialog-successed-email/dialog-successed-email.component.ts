import { Component } from '@angular/core';

/** Confirmation dialog shown after the home contact form is sent successfully. */
@Component({
  selector: 'dialog-successed-email',
  template: `<h1 mat-dialog-title>Mensaje enviado</h1>
    <div mat-dialog-content>Recibimos tu mensaje. Te responderemos lo antes posible.</div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close cdkFocusInitial>Cerrar</button>
    </div>`,
})
export class DialogSuccessedEmail { }
