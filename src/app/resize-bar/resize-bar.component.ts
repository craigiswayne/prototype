import {Component, EventEmitter, HostListener, Output} from '@angular/core';

@Component({
  selector: 'app-resize-bar',
  standalone: true,
  templateUrl: './resize-bar.component.html',
  styleUrl: './resize-bar.component.scss'
})
export class ResizeBarComponent {

  public resizing = false;

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
    this.update_editor_width(`${event.clientX}px`);
  }

  public update_editor_width(width: string): void {
    const dynamic_styles_id = 'dynamic_styles'
    let dynamic_styles_tag = document.querySelector(`#${dynamic_styles_id}`);
    if(!dynamic_styles_tag){
      dynamic_styles_tag = document.createElement('style');
      dynamic_styles_tag.setAttribute('id', 'dynamic_styles');
      document.body.appendChild(dynamic_styles_tag);
    }
    dynamic_styles_tag.innerHTML = `:root { --width-editor: ${width}; }`
  }
}
