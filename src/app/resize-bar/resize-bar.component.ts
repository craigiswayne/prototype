import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-resize-bar',
  standalone: true,
  templateUrl: './resize-bar.component.html',
  styleUrl: './resize-bar.component.scss'
})
export class ResizeBarComponent {

  private resizing = false;

  @HostListener('mousedown') onMouseDown() {
    this.resizing = true;
  }

  @HostListener('window:mouseup') onMouseUp() {
    if(!this.resizing){
      return;
    }
    this.resizing = false;
  }

  @HostListener('window:mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if(!this.resizing){
      return;
    }
    this.update_editor_width(event.clientX);
  }

  private update_editor_width(pixels: number): void {
    const dynamic_styles_id = 'dynamic_styles'
    let dynamic_styles_tag = document.querySelector(`#${dynamic_styles_id}`);
    if(!dynamic_styles_tag){
      dynamic_styles_tag = document.createElement('style');
      document.body.appendChild(dynamic_styles_tag);
    }
    dynamic_styles_tag.innerHTML = `:root { --width-editor: ${pixels}px; }`
  }
}
