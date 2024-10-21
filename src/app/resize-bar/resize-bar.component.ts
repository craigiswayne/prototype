import {Component, HostListener} from '@angular/core';

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
    this.inject_resizer_style(`${event.clientX}px`);
  }

  public inject_resizer_style(width: string): void {
    const resizer_style_id = 'resizer_styles'
    let resizer_style_tag = document.querySelector(`#${resizer_style_id}`);

    if(!resizer_style_tag){
      resizer_style_tag = document.createElement('style');
      resizer_style_tag.setAttribute('id', resizer_style_id);
      document.body.appendChild(resizer_style_tag);
    }

    resizer_style_tag.innerHTML = `:root { --width-resizer: ${width}; }`
  }
}
