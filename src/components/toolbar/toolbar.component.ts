import {Component, ElementRef, EventEmitter, HostBinding, Output, viewChild} from '@angular/core';
import {ColorSchemeSwitcherComponent} from '../color-scheme-switcher/color-scheme-switcher.component';

@Component({
  standalone: true,
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [ColorSchemeSwitcherComponent]
})
export class ToolbarComponent {

  private _filename_input = viewChild.required<ElementRef<HTMLInputElement>>('filename_input');
  @HostBinding('attr.layout') layout: 'rtl' | 'ltr' = 'ltr';
  @Output() layout_changed = new EventEmitter<'rtl' | 'ltr'>();

  public get filename(): string | undefined {
    return this._filename_input().nativeElement?.value;
  }

  public trigger_layout_changed(): void {
    this.layout = this.layout === 'rtl' ? 'ltr' : 'rtl';
    this.layout_changed.emit(this.layout);
  }
}
