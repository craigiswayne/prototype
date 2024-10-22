import {Component, ElementRef, EventEmitter, HostBinding, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  @ViewChild('filename_input') filename_input_ref?: ElementRef<HTMLInputElement>;

  @HostBinding('attr.layout') layout: 'rtl' | 'ltr' = 'ltr';
  @HostBinding('attr.color_scheme') color_scheme: 'dark' | 'light';

  @Output() layout_changed = new EventEmitter<'rtl' | 'ltr'>();
  @Output() color_scheme_changed = new EventEmitter<'dark' | 'light'>();

  constructor() {
    this.color_scheme = this.get_color_scheme();
  }

  public get_filename(): string | undefined {
    return this.filename_input_ref?.nativeElement?.value;
  }

  public trigger_layout_changed(): void {
    this.layout = this.layout === 'rtl' ? 'ltr' : 'rtl';
    this.layout_changed.emit(this.layout);
  }

  public trigger_color_scheme_changed(color_scheme: 'light' | 'dark'): void {
    this.color_scheme = color_scheme;
    this.color_scheme_changed.emit(this.color_scheme);
  }

  private get_color_scheme(): 'dark' | 'light' {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }
}
