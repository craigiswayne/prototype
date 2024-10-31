import {Component, ElementRef, EventEmitter, HostBinding, Output, ViewChild} from '@angular/core';
import {ColorSchemeSwitcherComponent} from '../color-scheme-switcher/color-scheme-switcher.component';

@Component({
  standalone: true,
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [ColorSchemeSwitcherComponent]
})
export class ToolbarComponent {

  @ViewChild('filename_input') filename_input_ref?: ElementRef<HTMLInputElement>;
  @HostBinding('attr.layout') layout: 'rtl' | 'ltr' = 'ltr';
  @Output() layout_changed = new EventEmitter<'rtl' | 'ltr'>();

  public get_filename(): string | undefined {
    return this.filename_input_ref?.nativeElement?.value;
  }

  public trigger_layout_changed(): void {
    this.layout = this.layout === 'rtl' ? 'ltr' : 'rtl';
    this.layout_changed.emit(this.layout);
  }
}
