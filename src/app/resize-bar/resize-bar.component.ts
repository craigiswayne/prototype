import {Component, EventEmitter, HostListener, Output} from '@angular/core';

@Component({
  selector: 'app-resize-bar',
  standalone: true,
  imports: [],
  templateUrl: './resize-bar.component.html',
  styleUrl: './resize-bar.component.scss'
})
export class ResizeBarComponent {
  private resizing = false;
  private resize_start: number = 0;

  @Output('onResize') onResize: EventEmitter<string> = new EventEmitter();

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    this.resizing = true;
    this.resize_start = event.clientX;
    console.log(event.clientX);
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    this.resizing = false;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if(!this.resizing){
      return;
    }
    console.log(event.clientX);
    // var workspace_width = parseInt(window.getComputedStyle(nexus.prototype.workspace).width);
    // var difference = event.clientX - this.resize_start;
    // var new_width = ((nexus.prototype.editor_width + difference) / workspace_width) * 100;
    // nexus.prototype.code_boxes_container.style.width = new_width + "%";
    // nexus.prototype.preview_container.style.width = "calc(100% - " + nexus.prototype.code_boxes_container.style.width + ")";
    // this.onResize.emit()
  }

  public onlyEditor(): void {
    this.onResize.emit('calc(100% - var(--width-resize-bar))');
  }

  public noEditor(): void {
    this.onResize.emit('0px');
  }
}
