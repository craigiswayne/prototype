import {Component, ElementRef, EventEmitter, HostBinding, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  @ViewChild('filename_input') filename_input_ref?: ElementRef<HTMLInputElement>;
  @Output() layout_changed = new EventEmitter<'rtl' | 'ltr'>();

  @HostBinding('class') layout: 'rtl' | 'ltr' = 'ltr';

  public get_filename(): string | undefined {
    return this.filename_input_ref?.nativeElement?.value;
  }

  public trigger_layout_changed(): void {
    this.layout = this.layout === 'rtl' ? 'ltr' : 'rtl';
    this.layout_changed.emit(this.layout);
  }
}
