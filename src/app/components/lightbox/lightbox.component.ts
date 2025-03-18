import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.css'
})
export class LightboxComponent {

  @Input() imageUrl: string = '';
  isOpen: boolean = false;

  openLightbox(image: string) {
    console.log("se ha hecho el click en openLightbox");
    this.imageUrl = image;
    this.isOpen = true;
  }

  closeLightbox() {
    this.isOpen = false;
  }

}
