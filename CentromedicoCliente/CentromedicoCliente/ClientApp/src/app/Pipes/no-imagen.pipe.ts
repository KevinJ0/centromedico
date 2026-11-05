import { Pipe, PipeTransform } from '@angular/core';

const DOCTOR_PHOTOS_BY_ID: { [id: number]: string } = {
  1: 'assets/imgs/doctors/doctor-1.jpg',
  2: 'assets/imgs/doctors/doctor-2.jpg',
  3: 'assets/imgs/doctors/doctor-3.jpg',
  4: 'assets/imgs/doctors/doctor-4.jpg',
  5: 'assets/imgs/doctors/doctor-5.jpg',
  6: 'assets/imgs/doctors/doctor-6.jpg',
  7: 'assets/imgs/doctors/doctor-7.jpg',
  8: 'assets/imgs/doctors/doctor-8.jpg'
};

const DOCTOR_PHOTOS_BY_FILENAME: { [file: string]: string } = {
  'd1.png': 'assets/imgs/doctors/doctor-1.jpg',
  'emmanuel.jpg': 'assets/imgs/doctors/doctor-2.jpg',
  'd6.jpg': 'assets/imgs/doctors/doctor-3.jpg',
  'd5.jpg': 'assets/imgs/doctors/doctor-4.jpg',
  'd3.jpg': 'assets/imgs/doctors/doctor-5.jpg',
  'd2.jpg': 'assets/imgs/doctors/doctor-6.jpg',
  'd4.jpg': 'assets/imgs/doctors/doctor-7.jpg',
  'd1.jpg': 'assets/imgs/doctors/doctor-8.jpg'
};

@Pipe({
  name: 'noProfilePhoto'
})
export class NoProfilePhotoPipe implements PipeTransform {

  transform(poster?: string | null, doctorId?: number): string {
    if (doctorId && DOCTOR_PHOTOS_BY_ID[doctorId]) {
      return DOCTOR_PHOTOS_BY_ID[doctorId];
    }

    if (!poster || !poster.trim() || poster.includes('noProfileImage.png') || poster.includes('no-image.png')) {
      return 'assets/imgs/doctors/doctor-1.jpg';
    }

    if (poster.includes('centromedico-assets.s3')) {
      const lower = poster.toLowerCase();
      for (const key of Object.keys(DOCTOR_PHOTOS_BY_FILENAME)) {
        if (lower.includes(key)) {
          return DOCTOR_PHOTOS_BY_FILENAME[key];
        }
      }
      return 'assets/imgs/doctors/doctor-1.jpg';
    }

    return poster;
  }
}
