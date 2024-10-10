import {Component, HostListener} from '@angular/core';
import {AppService} from '../app.service';

@Component({
  selector: 'app-resize-bar',
  standalone: true,
  templateUrl: './resize-bar.component.html',
  styleUrl: './resize-bar.component.scss'
})
export class ResizeBarComponent {
  constructor(private readonly app_service: AppService) {}

  @HostListener('mousedown') onMouseDown() {
    this.app_service.resizing = true;
  }
}
