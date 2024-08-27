import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  @ViewChild('filename_input') filename_input_ref?: ElementRef<HTMLInputElement>;

  public get_filename(): string | undefined {
    return this.filename_input_ref?.nativeElement?.value;
  }
}
