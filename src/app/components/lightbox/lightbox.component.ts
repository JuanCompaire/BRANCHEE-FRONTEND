import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.css'
})
export class LightboxComponent {

  @Input() imageUrl: string = '';
  @Output() close = new EventEmitter<void>();

  // Tamaño fijo para todas las imágenes
  readonly targetWidth = 1200;
  readonly targetHeight = 800;

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.closeLightbox();
  }

  closeLightbox() {
    this.close.emit();
  }

  getImageStyle() {
    return {
      'max-width': '100%',
      'max-height': '100%',
      'object-fit': 'contain',
      'display': 'block',
      'margin': 'auto'
    };
  }
}
