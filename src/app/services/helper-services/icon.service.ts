import { Injectable } from '@angular/core';
import { Icon } from '../../interfaces/icon.interface';


const files: Icon[] = [
  {
    src: '../../../../assets/user-icons/male.png',
    title: 'Male',
    selected: true
  },
  {
    src: '../../../../assets/user-icons/female.png',
    title: 'Female'
  },
  {
    src: '../../../../assets/user-icons/anya.png',
    title: 'Anya'
  },
  {
    src: '../../../../assets/user-icons/apa.png',
    title: 'Apa'
  },
  {
    src: '../../../../assets/user-icons/freba.png',
    title: 'Freba'
  },
  {
    src: '../../../../assets/user-icons/dodo.png',
    title: 'Dodo'
  },
  {
    src: '../../../../assets/user-icons/adam.png',
    title: 'Adam'
  },
  {
    src: '../../../../../assets/user-icons/soma.png',
    title: 'Soma'
  },
];

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor() { }
  getIcons(): Icon[] {
    return files;
  }
  getIconSrc(title: string): string {
    const ind = files.findIndex(icon => icon.title.toLowerCase() === title.toLowerCase());
    return files[ind].src;
  }
}
