/*
 * Ampliación de tipos: los eventos del calendario de citas transportan
 * datos extra del paciente en `patientData` (dashboard y diálogos de
 * citas). El tipo CalendarEvent proviene de calendar-utils (dependencia
 * de angular-calendar); sin esta fusión de interfaces, tsc falla con
 * TS2339 en dashboard y los diálogos de citas.
 */
import { CalendarEvent } from 'calendar-utils';

declare module 'calendar-utils' {
  interface CalendarEvent<MetaType = any> {
    patientData?: any;
  }
}
